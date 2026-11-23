{-# LANGUAGE DeriveGeneric #-}
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

-- Lote: { "id": 1, "sabor_id": 1, "categoria_id": 1, "linha_id": 1,
--         "quantidade": 6, "validade": "2026-11-22" }
data Lote = Lote
    { id           :: Int
    , sabor_id     :: Int
    , categoria_id :: Int
    , linha_id     :: Int
    , quantidade   :: Int
    , validade     :: Day
    } deriving (Show, Generic)

instance ToJSON Lote
instance FromJSON Lote
instance QueryResults Lote where
    convertResults [f1, f2, f3, f4, f5, f6] [v1, v2, v3, v4, v5, v6] =
        Lote (convert f1 v1) (convert f2 v2) (convert f3 v3)
             (convert f4 v4) (convert f5 v5) (convert f6 v6)
    convertResults fs vs = convertError fs vs 6

-- Saída de estoque: { "saida": 3 }
newtype Saida = Saida
    { saida :: Int
    } deriving (Show, Generic)

instance FromJSON Saida
