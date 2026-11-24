{-# LANGUAGE DataKinds #-}
{-# LANGUAGE TypeOperators #-}
<<<<<<< HEAD
=======
{-# LANGUAGE TypeApplications #-}
>>>>>>> 360d4dc (refactor: Organização das pastas e arquivos)
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

<<<<<<< HEAD
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
=======
------------------------------------------------------------------
-- Rotas (tipo API)
-- No Servant as rotas são declaradas neste tipo; a função server, lá embaixo,
-- liga cada rota ao seu handler na mesma ordem.
------------------------------------------------------------------

-- Sabores e linhas têm as mesmas 4 rotas; só muda o nome na URL.
type RotasCadastro =
       Get '[JSON] CadastrosResposta                                       -- GET    /api/sabores
  :<|> ReqBody '[JSON] Cadastro :> Post '[JSON] Resultado                  -- POST   /api/sabores
  :<|> Capture "id" Int :> ReqBody '[JSON] Cadastro :> Put '[JSON] NoContent -- PUT /api/sabores/:id
  :<|> Capture "id" Int :> Delete '[JSON] NoContent                        -- DELETE /api/sabores/:id

type API = "api" :>
  (    "categorias" :> Get '[JSON] CadastrosResposta
  :<|> "sabores"    :> RotasCadastro
  :<|> "linhas"     :> RotasCadastro
  :<|> "lotes" :> Get '[JSON] LotesResposta
  :<|> "lotes" :> Capture "id" Int :> Get '[JSON] Lote
  :<|> "lotes" :> ReqBody '[JSON] Lote :> Post '[JSON] Resultado
  :<|> "lotes" :> Capture "id" Int :> ReqBody '[JSON] Lote :> Put '[JSON] NoContent
  :<|> "lotes" :> Capture "id" Int :> Delete '[JSON] NoContent
  :<|> "lotes" :> Capture "id" Int :> "saida" :> ReqBody '[JSON] Saida :> Patch '[JSON] NoContent
  )

-- Abre a conexão, executa a consulta e fecha a conexão.
-- (Uma conexão por requisição: o front faz 4 GETs ao mesmo tempo e
-- uma conexão MySQL única não pode ser usada por várias requisições juntas.)
>>>>>>> 360d4dc (refactor: Organização das pastas e arquivos)
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

<<<<<<< HEAD
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
=======
handlerCategorias :: ConnectInfo -> Handler CadastrosResposta
handlerCategorias info = handlerListar "categoria" info

handlerListar :: String -> ConnectInfo -> Handler CadastrosResposta
handlerListar tabela info = CadastrosResposta <$> banco info (\conn -> listarCadastros conn tabela)

handlerCriar :: String -> ConnectInfo -> Cadastro -> Handler Resultado
handlerCriar tabela info cadastro = do
    let novoNome = T.strip (nome cadastro)
    when (T.null novoNome) $ erro err400 "Informe o nome."
    repetido <- banco info (\conn -> nomeRepetido conn tabela 0 novoNome)
    when repetido $ erro err409 "Já existe um cadastro com esse nome."
    novoId <- banco info (\conn -> criarCadastro conn tabela novoNome)
    pure (Resultado novoId)

handlerEditar :: String -> ConnectInfo -> Int -> Cadastro -> Handler NoContent
handlerEditar tabela info ident cadastro = do
    let novoNome = T.strip (nome cadastro)
>>>>>>> 360d4dc (refactor: Organização das pastas e arquivos)
    when (T.null novoNome) $ erro err400 "Informe o nome."
    existe <- banco info (\conn -> existeCadastro conn tabela ident)
    when (not existe) $ erro err404 "Cadastro não encontrado."
    repetido <- banco info (\conn -> nomeRepetido conn tabela ident novoNome)
    when repetido $ erro err409 "Já existe um cadastro com esse nome."
<<<<<<< HEAD
    banco info (\conn -> editarCadastro conn tabela ident novoNome)

handlerExcluir :: String -> String -> ConnectInfo -> Int -> Handler NoContent
handlerExcluir tabela coluna info ident = do
    existe <- banco info (\conn -> existeCadastro conn tabela ident)
    when (not existe) $ erro err404 "Cadastro não encontrado."
    emUso <- banco info (\conn -> cadastroEmUso conn coluna ident)
    when emUso $ erro err409 "Este cadastro está vinculado a lotes e não pode ser excluído."
    banco info (\conn -> excluirCadastro conn tabela ident)
    return NoContent
=======
    -- O MySQL devolve 0 linhas alteradas quando o nome não mudou,
    -- por isso a existência é conferida antes, e não pelo resultado do UPDATE.
    _ <- banco info (\conn -> editarCadastro conn tabela ident novoNome)
    pure NoContent

handlerExcluir :: String -> String -> ConnectInfo -> Int -> Handler NoContent
handlerExcluir tabela coluna info ident = do
    emUso <- banco info (\conn -> cadastroEmUso conn coluna ident)
    when emUso $ erro err409 "Este cadastro está vinculado a lotes e não pode ser excluído."
    apagadas <- banco info (\conn -> excluirCadastro conn tabela ident)
    if apagadas == 1
        then pure NoContent
        else erro err404 "Cadastro não encontrado."
>>>>>>> 360d4dc (refactor: Organização das pastas e arquivos)

------------------------------------------------------------------
-- Lotes
------------------------------------------------------------------

<<<<<<< HEAD
handlerLotes :: ConnectInfo -> Handler [Lote]
handlerLotes info = banco info listarLotes

acharLote :: ConnectInfo -> Int -> Handler Lote
acharLote info ident = do
    resultado <- banco info (\conn -> buscarLote conn ident)
    maybe (erro err404 "Lote não encontrado.") return resultado
=======
handlerLotes :: ConnectInfo -> Handler LotesResposta
handlerLotes info = LotesResposta <$> banco info listarLotes

-- GET /api/lotes/:id (200 com o lote ou 404)
handlerLote :: ConnectInfo -> Int -> Handler Lote
handlerLote info ident = do
    encontrado <- banco info (\conn -> buscarLote conn ident)
    case encontrado of
        Just lote -> pure lote
        Nothing   -> erro err404 "Lote não encontrado."
>>>>>>> 360d4dc (refactor: Organização das pastas e arquivos)

-- minimo = 1 ao criar e 0 ao editar (um lote editado pode ficar zerado)
validarLote :: ConnectInfo -> Int -> Lote -> Handler ()
validarLote info minimo lote = do
    when (quantidade lote < minimo) $ erro err400 "Confira a quantidade."
    valido <- banco info (\conn -> referenciasValidas conn lote)
    when (not valido) $ erro err400 "Selecione sabor, categoria e linha."

<<<<<<< HEAD
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
=======
handlerCriarLote :: ConnectInfo -> Lote -> Handler Resultado
handlerCriarLote info lote = do
    validarLote info 1 lote
    novoId <- banco info (\conn -> criarLote conn lote)
    pure (Resultado novoId)

handlerEditarLote :: ConnectInfo -> Int -> Lote -> Handler NoContent
handlerEditarLote info ident lote = do
    _ <- handlerLote info ident
    validarLote info 0 lote
    _ <- banco info (\conn -> editarLote conn ident lote)
    pure NoContent

handlerExcluirLote :: ConnectInfo -> Int -> Handler NoContent
handlerExcluirLote info ident = do
    apagadas <- banco info (\conn -> excluirLote conn ident)
    if apagadas == 1
        then pure NoContent
        else erro err404 "Lote não encontrado."

-- PATCH /api/lotes/:id/saida: muda só a quantidade do lote.
handlerSaida :: ConnectInfo -> Int -> Saida -> Handler NoContent
handlerSaida info ident (Saida qtd) = do
    lote <- handlerLote info ident
    when (qtd < 1 || qtd > quantidade lote) $
        erro err400 "Informe uma quantidade dentro do saldo."
    alteradas <- banco info (\conn -> darSaida conn ident qtd)
    if alteradas == 1
        then pure NoContent
        else erro err400 "Informe uma quantidade dentro do saldo."
>>>>>>> 360d4dc (refactor: Organização das pastas e arquivos)

------------------------------------------------------------------
-- Servidor (mesma ordem das rotas do tipo API)
------------------------------------------------------------------

<<<<<<< HEAD
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
=======
rotasCadastro :: String -> String -> ConnectInfo -> Server RotasCadastro
rotasCadastro tabela coluna info =
       handlerListar  tabela info
  :<|> handlerCriar   tabela info
  :<|> handlerEditar  tabela info
  :<|> handlerExcluir tabela coluna info

server :: ConnectInfo -> Server API
server info =
       handlerCategorias info
  :<|> rotasCadastro "sabores" "sabor_id" info
  :<|> rotasCadastro "linha"   "linha_id" info
  :<|> handlerLotes info
  :<|> handlerLote info
>>>>>>> 360d4dc (refactor: Organização das pastas e arquivos)
  :<|> handlerCriarLote info
  :<|> handlerEditarLote info
  :<|> handlerExcluirLote info
  :<|> handlerSaida info

app :: ConnectInfo -> Application
<<<<<<< HEAD
app info = serve (Proxy :: Proxy API) (server info)
=======
app info = serve (Proxy @API) (server info)
>>>>>>> 360d4dc (refactor: Organização das pastas e arquivos)
