<<<<<<< HEAD
FROM haskell:9.10

# Bibliotecas que o mysql-simple precisa
# (Debian 11 saiu do espelho de segurança; usa o snapshot já previsto na imagem)
RUN sed -i -e 's|^deb |#deb |' -e 's|^# deb http://snapshot|deb [check-valid-until=no] http://snapshot|' /etc/apt/sources.list && \
    apt-get update && \
=======
FROM haskell:9.10-bookworm

# Bibliotecas que o mysql-simple precisa
RUN apt-get update && \
>>>>>>> 360d4dc (refactor: Organização das pastas e arquivos)
    apt-get install -y default-libmysqlclient-dev libpcre3-dev pkg-config && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Baixa e compila as dependências primeiro (fica em cache)
COPY stockeasy.cabal ./
RUN cabal update && cabal build --only-dependencies

# Compila o projeto
COPY . .
RUN cabal build && cp $(cabal list-bin stockeasy) /usr/local/bin/stockeasy

EXPOSE 8080
CMD ["stockeasy"]
