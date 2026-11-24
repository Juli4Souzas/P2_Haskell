{-# LANGUAGE DeriveGeneric #-}

module Models where

import Data.Aeson
import Data.Text (Text)
import Data.Time.Calendar (Day)
import GHC.Generics (Generic)

-- Os campos se chamam idCadastro e idLote, e não "id", para não esconder
-- a função id que já existe no Haskell (shadowing), como no vídeo do PUT.
-- No JSON eles continuam saindo como "id", então o front não muda.
opcoesJson :: Options
opcoesJson = defaultOptions { fieldLabelModifier = trocar }
  where
    trocar campo
        | campo == "idCadastro" || campo == "idLote" = "id"
        | otherwise = campo

-- Sabor, linha ou categoria: { "id": 1, "nome": "Morango" }
data Cadastro = Cadastro
    { idCadastro :: Int
    , nome       :: Text
    } deriving (Show, Generic)

instance ToJSON Cadastro where
    toJSON = genericToJSON opcoesJson
instance FromJSON Cadastro where
    parseJSON = genericParseJSON opcoesJson

-- Lote: { "id": 1, "sabor_id": 1, "categoria_id": 1, "linha_id": 1,
--         "quantidade": 6, "validade": "2026-11-22" }
data Lote = Lote
    { idLote       :: Int
    , sabor_id     :: Int
    , categoria_id :: Int
    , linha_id     :: Int
    , quantidade   :: Int
    , validade     :: Day
    } deriving (Show, Generic)

instance ToJSON Lote where
    toJSON = genericToJSON opcoesJson
instance FromJSON Lote where
    parseJSON = genericParseJSON opcoesJson

-- Envelopes das listas, como o ClienteResponse do vídeo do GET:
-- { "cadastros": [...] } e { "lotes": [...] }
newtype CadastrosResposta = CadastrosResposta
    { cadastros :: [Cadastro]
    } deriving (Show, Generic)

instance ToJSON CadastrosResposta

newtype LotesResposta = LotesResposta
    { lotes :: [Lote]
    } deriving (Show, Generic)

instance ToJSON LotesResposta

-- Resposta do POST com o id criado, como o ResultadoResponse do vídeo do POST:
-- { "resultado": 5 }
newtype Resultado = Resultado
    { resultado :: Int
    } deriving (Show, Generic)

instance ToJSON Resultado

-- Corpo do PATCH de saída (atualiza só um campo), como o ClienteNome do vídeo do PATCH:
-- { "saida": 3 }
newtype Saida = Saida
    { saida :: Int
    } deriving (Show, Generic)

instance FromJSON Saida
