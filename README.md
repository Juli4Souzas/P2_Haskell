# 🍦 StockEasy

**Qual sorvete vender primeiro?** O StockEasy ajuda a equipe da **Sorveteria Pinpinela** a responder essa pergunta antes de abrir o freezer.

O sistema foi desenvolvido como projeto acadêmico de **Haskell** para organizar o estoque de picolés e potes de sorvete. Cada lote tem sua própria quantidade e data de validade, então dá para acompanhar entregas diferentes do mesmo sabor.

> 🚧 **Status do projeto:** Em desenvolvimento

---

<img align="left" src="https://github.com/user-attachments/assets/318e9628-a6f2-44cb-9080-ceff2a41f7fc" width="200" height="125" alt="Dois gatos tomando sorvete">
<img align="left" src="https://upload.wikimedia.org/wikipedia/commons/d/d0/Clear.gif" width="20" height="125" alt="">

### Gerenciamento Inteligente de Estoque

Chega de dúvidas na hora de abrir o freezer! O StockEasy automatiza o controle de lotes, datas de validade e prioridades de saída para a Sorveteria Pinpinela, ajudando a organizar o estoque com precisão e eficiência.


<br clear="all">

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
