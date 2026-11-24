<<<<<<< HEAD
-- StockEasy | Pinpinela | MySQL 8.0.16+
=======
SET NAMES utf8mb4;

>>>>>>> 360d4dc (refactor: Organização das pastas e arquivos)
CREATE DATABASE IF NOT EXISTS pimpinella
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE pimpinella;

CREATE TABLE IF NOT EXISTS sabores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
<<<<<<< HEAD
) ENGINE = InnoDB;
=======
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
>>>>>>> 360d4dc (refactor: Organização das pastas e arquivos)

CREATE TABLE IF NOT EXISTS categoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
<<<<<<< HEAD
) ENGINE = InnoDB;
=======
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
>>>>>>> 360d4dc (refactor: Organização das pastas e arquivos)

CREATE TABLE IF NOT EXISTS linha (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
<<<<<<< HEAD
) ENGINE = InnoDB;
=======
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
>>>>>>> 360d4dc (refactor: Organização das pastas e arquivos)

CREATE TABLE IF NOT EXISTS lote (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sabor_id INT NOT NULL,
    categoria_id INT NOT NULL,
    linha_id INT NOT NULL,
    quantidade INT NOT NULL,
    validade DATE NOT NULL,
    FOREIGN KEY (sabor_id) REFERENCES sabores (id) ON DELETE RESTRICT,
    FOREIGN KEY (categoria_id) REFERENCES categoria (id) ON DELETE RESTRICT,
    FOREIGN KEY (linha_id) REFERENCES linha (id) ON DELETE RESTRICT
<<<<<<< HEAD
) ENGINE = InnoDB;
=======
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
>>>>>>> 360d4dc (refactor: Organização das pastas e arquivos)

INSERT INTO categoria (nome) VALUES ('Picolé'), ('Pote');
INSERT INTO linha (nome) VALUES ('Fruta'), ('Leite');