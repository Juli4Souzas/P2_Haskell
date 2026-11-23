{-# LANGUAGE DataKinds #-}
{-# LANGUAGE TypeOperators #-}
{-# LANGUAGE OverloadedStrings #-}

module Handler where

import Control.Exception (bracket)
import Control.Monad (when)
import Control.Monad.Except (throwError)
import Control.Monad.IO.Class (liftIO)
import Data.Aeson (encode, object, (.=))
import Data.Proxy (Proxy (..))
import Data.Text (Text)
import qualified Data.Text as T
import Database.MySQL.Simple (ConnectInfo, Connection, close, connect)
import Network.Wai (Application)
import Servant
import Models
import Queries

type API =
       "api" :> "categorias" :> Get '[JSON] [Cadastro]

  :<|> "api" :> "sabores" :> Get '[JSON] [Cadastro]
  :<|> "api" :> "sabores" :> ReqBody '[JSON] Cadastro :> Post '[JSON] Cadastro
  :<|> "api" :> "sabores" :> Capture "id" Int :> ReqBody '[JSON] Cadastro :> Put '[JSON] Cadastro
  :<|> "api" :> "sabores" :> Capture "id" Int :> DeleteNoContent

  :<|> "api" :> "linhas" :> Get '[JSON] [Cadastro]
  :<|> "api" :> "linhas" :> ReqBody '[JSON] Cadastro :> Post '[JSON] Cadastro
  :<|> "api" :> "linhas" :> Capture "id" Int :> ReqBody '[JSON] Cadastro :> Put '[JSON] Cadastro
  :<|> "api" :> "linhas" :> Capture "id" Int :> DeleteNoContent

  :<|> "api" :> "lotes" :> Get '[JSON] [Lote]
  :<|> "api" :> "lotes" :> ReqBody '[JSON] Lote :> Post '[JSON] Lote
  :<|> "api" :> "lotes" :> Capture "id" Int :> ReqBody '[JSON] Lote :> Put '[JSON] Lote
  :<|> "api" :> "lotes" :> Capture "id" Int :> DeleteNoContent
  :<|> "api" :> "lotes" :> Capture "id" Int :> "saida" :> ReqBody '[JSON] Saida :> Post '[JSON] Lote

-- Abre a conexão, executa a consulta e fecha a conexão.
banco :: ConnectInfo -> (Connection -> IO a) -> Handler a
banco info acao = liftIO (bracket (connect info) close acao)

-- Devolve o erro em JSON: { "erro": "mensagem" }
erro :: ServerError -> Text -> Handler a
erro codigo mensagem = throwError codigo
    { errBody    = encode (object ["erro" .= mensagem])
    , errHeaders = [("Content-Type", "application/json; charset=utf-8")]
    }

------------------------------------------------------------------
-- Categorias, sabores e linhas
------------------------------------------------------------------

handlerCategorias :: ConnectInfo -> Handler [Cadastro]
handlerCategorias info = banco info (\conn -> listarCadastros conn "categoria")

handlerListar :: String -> ConnectInfo -> Handler [Cadastro]
handlerListar tabela info = banco info (\conn -> listarCadastros conn tabela)

handlerCriar :: String -> ConnectInfo -> Cadastro -> Handler Cadastro
handlerCriar tabela info (Cadastro _ nomeEnviado) = do
    let novoNome = T.strip nomeEnviado
    when (T.null novoNome) $ erro err400 "Informe o nome."
    repetido <- banco info (\conn -> nomeRepetido conn tabela 0 novoNome)
    when repetido $ erro err409 "Já existe um cadastro com esse nome."
    banco info (\conn -> criarCadastro conn tabela novoNome)

handlerEditar :: String -> ConnectInfo -> Int -> Cadastro -> Handler Cadastro
handlerEditar tabela info ident (Cadastro _ nomeEnviado) = do
    let novoNome = T.strip nomeEnviado
    when (T.null novoNome) $ erro err400 "Informe o nome."
    existe <- banco info (\conn -> existeCadastro conn tabela ident)
    when (not existe) $ erro err404 "Cadastro não encontrado."
    repetido <- banco info (\conn -> nomeRepetido conn tabela ident novoNome)
    when repetido $ erro err409 "Já existe um cadastro com esse nome."
    banco info (\conn -> editarCadastro conn tabela ident novoNome)

handlerExcluir :: String -> String -> ConnectInfo -> Int -> Handler NoContent
handlerExcluir tabela coluna info ident = do
    existe <- banco info (\conn -> existeCadastro conn tabela ident)
    when (not existe) $ erro err404 "Cadastro não encontrado."
    emUso <- banco info (\conn -> cadastroEmUso conn coluna ident)
    when emUso $ erro err409 "Este cadastro está vinculado a lotes e não pode ser excluído."
    banco info (\conn -> excluirCadastro conn tabela ident)
    return NoContent

------------------------------------------------------------------
-- Lotes
------------------------------------------------------------------

handlerLotes :: ConnectInfo -> Handler [Lote]
handlerLotes info = banco info listarLotes

acharLote :: ConnectInfo -> Int -> Handler Lote
acharLote info ident = do
    resultado <- banco info (\conn -> buscarLote conn ident)
    maybe (erro err404 "Lote não encontrado.") return resultado

-- minimo = 1 ao criar e 0 ao editar (um lote editado pode ficar zerado)
validarLote :: ConnectInfo -> Int -> Lote -> Handler ()
validarLote info minimo lote = do
    when (quantidade lote < minimo) $ erro err400 "Confira a quantidade."
    valido <- banco info (\conn -> referenciasValidas conn lote)
    when (not valido) $ erro err400 "Selecione sabor, categoria e linha."

handlerCriarLote :: ConnectInfo -> Lote -> Handler Lote
handlerCriarLote info lote = do
    validarLote info 1 lote
    banco info (\conn -> criarLote conn lote)

handlerEditarLote :: ConnectInfo -> Int -> Lote -> Handler Lote
handlerEditarLote info ident lote = do
    _ <- acharLote info ident
    validarLote info 0 lote
    banco info (\conn -> editarLote conn ident lote)

handlerExcluirLote :: ConnectInfo -> Int -> Handler NoContent
handlerExcluirLote info ident = do
    _ <- acharLote info ident
    banco info (\conn -> excluirLote conn ident)
    return NoContent

handlerSaida :: ConnectInfo -> Int -> Saida -> Handler Lote
handlerSaida info ident (Saida qtd) = do
    lote <- acharLote info ident
    when (qtd < 1 || qtd > quantidade lote) $
        erro err400 "Informe uma quantidade dentro do saldo."
    _ <- banco info (\conn -> darSaida conn ident qtd)
    acharLote info ident

------------------------------------------------------------------
-- Servidor (mesma ordem das rotas do tipo API)
------------------------------------------------------------------

server :: ConnectInfo -> Server API
server info =
       handlerCategorias info

  :<|> handlerListar  "sabores" info
  :<|> handlerCriar   "sabores" info
  :<|> handlerEditar  "sabores" info
  :<|> handlerExcluir "sabores" "sabor_id" info

  :<|> handlerListar  "linha" info
  :<|> handlerCriar   "linha" info
  :<|> handlerEditar  "linha" info
  :<|> handlerExcluir "linha" "linha_id" info

  :<|> handlerLotes info
  :<|> handlerCriarLote info
  :<|> handlerEditarLote info
  :<|> handlerExcluirLote info
  :<|> handlerSaida info

app :: ConnectInfo -> Application
app info = serve (Proxy :: Proxy API) (server info)
