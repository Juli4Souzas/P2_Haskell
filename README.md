# 🍦 StockEasy

**Qual sorvete vender primeiro?** O StockEasy ajuda a equipe da **Sorveteria Pinpinela** a responder essa pergunta antes de abrir o freezer.

O sistema foi desenvolvido como projeto acadêmico de **Haskell** para organizar o estoque de picolés e potes de sorvete. Cada lote tem sua própria quantidade e data de validade, então dá para acompanhar entregas diferentes do mesmo sabor.

> 🚧 **Status do projeto:** Em desenvolvimento

---

<p align="center">
  <img src="https://media.giphy.com/media/wbp3YSoF7FhT3XyjeE/giphy.gif" width="350" alt="GIF animado de apresentação do StockEasy" />
</p>

---

## 🎯 Objetivo

Ajudar a sorveteria a acompanhar o estoque e reduzir desperdícios. Se dois lotes de picolé de morango têm validades diferentes, a **Vitrine do Dia** destaca o que vence primeiro. Se um lote já passou da validade, ele aparece no filtro de **Vencidos**.

## 🍨 O que tem no StockEasy?

- **Vitrine do Dia** — mostra o lote que deve sair primeiro e os próximos vencimentos.
- **Estoque** — reúne os lotes com suas quantidades e validades. Na demonstração, é possível registrar entradas e saídas, filtrar os vencidos e consultar produtos com saldo baixo.
- **Cardápio** — organiza os sabores e as linhas, como Fruta e Leite. No cadastro de cada lote, a equipe combina essas opções com a categoria Picolé ou Pote.

## 🛠️ Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Interface | React, Vite e CSS |
| API | Haskell e Servant |
| Banco de dados | MySQL |
