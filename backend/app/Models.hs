{-# LANGUAGE DeriveGeneric #-}
<<<<<<< HEAD
{-# LANGUAGE DuplicateRecordFields #-}

module Models where

import Data.Aeson (FromJSON, ToJSON)
import Data.Text (Text)
import Data.Time.Calendar (Day)
import Database.MySQL.Simple.QueryResults (QueryResults (..), convertError)
import Database.MySQL.Simple.Result (convert)
import GHC.Generics (Generic)

-- Sabor, linha ou categoria: { "id": 1, "nome": "Morango" }
data Cadastro = Cadastro
    { id   :: Int
    , nome :: Text
    } deriving (Show, Generic)

instance ToJSON Cadastro
instance FromJSON Cadastro
instance QueryResults Cadastro where
    convertResults [fa, fb] [va, vb] = Cadastro (convert fa va) (convert fb vb)
    convertResults fs vs = convertError fs vs 2
=======

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
>>>>>>> 360d4dc (refactor: Organização das pastas e arquivos)

-- Lote: { "id": 1, "sabor_id": 1, "categoria_id": 1, "linha_id": 1,
--         "quantidade": 6, "validade": "2026-11-22" }
data Lote = Lote
<<<<<<< HEAD
    { id           :: Int
=======
    { idLote       :: Int
>>>>>>> 360d4dc (refactor: Organização das pastas e arquivos)
    , sabor_id     :: Int
    , categoria_id :: Int
    , linha_id     :: Int
    , quantidade   :: Int
    , validade     :: Day
    } deriving (Show, Generic)

<<<<<<< HEAD
instance ToJSON Lote
instance FromJSON Lote
instance QueryResults Lote where
    convertResults [f1, f2, f3, f4, f5, f6] [v1, v2, v3, v4, v5, v6] =
        Lote (convert f1 v1) (convert f2 v2) (convert f3 v3)
             (convert f4 v4) (convert f5 v5) (convert f6 v6)
    convertResults fs vs = convertError fs vs 6

-- Saída de estoque: { "saida": 3 }
=======
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
>>>>>>> 360d4dc (refactor: Organização das pastas e arquivos)
newtype Saida = Saida
    { saida :: Int
    } deriving (Show, Generic)

instance FromJSON Saida
