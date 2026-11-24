{-# LANGUAGE OverloadedStrings #-}

module Queries where

import Data.Int (Int64)
import Data.Maybe (listToMaybe)
import Data.String (fromString)
import Data.Text (Text)
import Data.Time.Calendar (Day)
import Database.MySQL.Simple
import Database.MySQL.Simple.QueryParams (QueryParams)
import Models

-- Executa um SELECT COUNT(*) e devolve o total.
contar :: QueryParams q => Connection -> String -> q -> IO Integer
contar conn sql params = do
    [Only total] <- query conn (fromString sql) params
    return total

-- Como no vídeo do GET: o SELECT devolve tuplas e montamos o registro com map,
-- sem precisar de instância de conversão do banco no Models.
paraCadastro :: (Int, Text) -> Cadastro
paraCadastro (ident, nomeBanco) = Cadastro ident nomeBanco

paraLote :: (Int, Int, Int, Int, Int, Day) -> Lote
paraLote (ident, sabor, categoria, linha, qtd, venc) = Lote ident sabor categoria linha qtd venc

------------------------------------------------------------------
-- Sabores, linhas e categorias
-- (tabela = "sabores", "linha" ou "categoria")
------------------------------------------------------------------

listarCadastros :: Connection -> String -> IO [Cadastro]
listarCadastros conn tabela =
    map paraCadastro <$> query_ conn (fromString ("SELECT id, nome FROM " ++ tabela ++ " ORDER BY nome"))

existeCadastro :: Connection -> String -> Int -> IO Bool
existeCadastro conn tabela ident =
    (> 0) <$> contar conn ("SELECT COUNT(*) FROM " ++ tabela ++ " WHERE id = ?") (Only ident)

-- O MySQL compara sem diferenciar maiúsculas e acentos ("limao" = "Limão").
nomeRepetido :: Connection -> String -> Int -> Text -> IO Bool
nomeRepetido conn tabela ident novoNome =
    (> 0) <$> contar conn ("SELECT COUNT(*) FROM " ++ tabela ++ " WHERE nome = ? AND id <> ?") (novoNome, ident)

-- Devolve o id criado (auto incremento).
criarCadastro :: Connection -> String -> Text -> IO Int
criarCadastro conn tabela novoNome = do
    _ <- execute conn (fromString ("INSERT INTO " ++ tabela ++ " (nome) VALUES (?)")) (Only novoNome)
    fromIntegral <$> insertID conn

editarCadastro :: Connection -> String -> Int -> Text -> IO Int64
editarCadastro conn tabela ident novoNome =
    execute conn (fromString ("UPDATE " ++ tabela ++ " SET nome = ? WHERE id = ?")) (novoNome, ident)

-- coluna = "sabor_id" ou "linha_id"
cadastroEmUso :: Connection -> String -> Int -> IO Bool
cadastroEmUso conn coluna ident =
    (> 0) <$> contar conn ("SELECT COUNT(*) FROM lote WHERE " ++ coluna ++ " = ?") (Only ident)

-- Devolve quantas linhas foram apagadas (1 = deu certo).
excluirCadastro :: Connection -> String -> Int -> IO Int64
excluirCadastro conn tabela ident =
    execute conn (fromString ("DELETE FROM " ++ tabela ++ " WHERE id = ?")) (Only ident)

------------------------------------------------------------------
-- Lotes
------------------------------------------------------------------

listarLotes :: Connection -> IO [Lote]
listarLotes conn = map paraLote <$> query_ conn
    "SELECT id, sabor_id, categoria_id, linha_id, quantidade, validade FROM lote ORDER BY validade, id"

buscarLote :: Connection -> Int -> IO (Maybe Lote)
buscarLote conn ident = listToMaybe . map paraLote <$> query conn
    "SELECT id, sabor_id, categoria_id, linha_id, quantidade, validade FROM lote WHERE id = ?"
    (Only ident)

-- Confere se o sabor, a categoria e a linha do lote existem.
referenciasValidas :: Connection -> Lote -> IO Bool
referenciasValidas conn lote = do
    s <- contar conn "SELECT COUNT(*) FROM sabores WHERE id = ?" (Only (sabor_id lote))
    c <- contar conn "SELECT COUNT(*) FROM categoria WHERE id = ?" (Only (categoria_id lote))
    l <- contar conn "SELECT COUNT(*) FROM linha WHERE id = ?" (Only (linha_id lote))
    return (s > 0 && c > 0 && l > 0)

-- Devolve o id criado (auto incremento).
criarLote :: Connection -> Lote -> IO Int
criarLote conn lote = do
    _ <- execute conn
        "INSERT INTO lote (sabor_id, categoria_id, linha_id, quantidade, validade) VALUES (?, ?, ?, ?, ?)"
        (sabor_id lote, categoria_id lote, linha_id lote, quantidade lote, validade lote)
    fromIntegral <$> insertID conn

editarLote :: Connection -> Int -> Lote -> IO Int64
editarLote conn ident lote = execute conn
    "UPDATE lote SET sabor_id = ?, categoria_id = ?, linha_id = ?, quantidade = ?, validade = ? WHERE id = ?"
    (sabor_id lote, categoria_id lote, linha_id lote, quantidade lote, validade lote, ident)

-- Devolve quantas linhas foram apagadas (1 = deu certo).
excluirLote :: Connection -> Int -> IO Int64
excluirLote conn ident = execute conn "DELETE FROM lote WHERE id = ?" (Only ident)

-- Só atualiza se houver saldo; devolve 1 se a saída foi registrada.
darSaida :: Connection -> Int -> Int -> IO Int64
darSaida conn ident qtd = execute conn
    "UPDATE lote SET quantidade = quantidade - ? WHERE id = ? AND quantidade >= ?"
    (qtd, ident, qtd)
