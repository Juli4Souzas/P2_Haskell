# 🍦 StockEasy

**Qual sorvete vender primeiro?** O StockEasy ajuda a equipe da **Sorveteria Pinpinela** a responder essa pergunta antes de abrir o freezer.

O sistema foi desenvolvido como projeto acadêmico de **Haskell** para organizar o estoque de picolés e potes de sorvete. Cada lote tem sua própria quantidade e data de validade, então dá para acompanhar entregas diferentes do mesmo sabor.

---
<p align="center">
  <img width="800" alt="Ice Cream Cat GIF" src="https://github.com/user-attachments/assets/318e9628-a6f2-44cb-9080-ceff2a41f7fc" />
<!--<img width="960"  alt="The Simpsons Eating GIF by AniDom" src="https://github.com/user-attachments/assets/3f601a2b-f9f1-4438-9e70-e4024e10a28b" />-->

</p> 

---

## Objetivo

Ajudar a sorveteria a acompanhar o estoque e reduzir desperdícios. Se dois lotes de picolé de morango têm validades diferentes, a **Vitrine do Dia** destaca o que vence primeiro. Se um lote já passou da validade, ele aparece no filtro de **Vencidos**.

## O que tem no StockEasy?

- **Vitrine do Dia** - mostra o lote que deve sair primeiro e os próximos vencimentos.
- **Estoque** - reúne os lotes com suas quantidades e validades. Na demonstração, é possível registrar entradas e saídas, filtrar os vencidos e consultar produtos com saldo baixo.
- **Cardápio** - organiza os sabores e as linhas, como Fruta e Leite. No cadastro de cada lote, a equipe combina essas opções com a categoria Picolé ou Pote.

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Interface | React, Vite e CSS |
| API | Haskell e Servant |
| Banco de dados | MySQL |
