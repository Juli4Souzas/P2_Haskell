# 🍦 StockEasy

**Qual sorvete vender primeiro?** O StockEasy ajuda a equipe da **Sorveteria Pinpinela** a responder essa pergunta antes de abrir o freezer.

O sistema foi desenvolvido como projeto acadêmico de **Haskell** para organizar o estoque de picolés e potes de sorvete. Cada lote tem sua própria quantidade e data de validade, então dá para acompanhar entregas diferentes do mesmo sabor.

> 🚧 **Status do projeto:** Em desenvolvimento

---


<img align="left" width="230" alt="Gato tomando sorvete, GIF de UGCPazar" src="https://github.com/user-attachments/assets/c73e8fa8-c64d-4679-9693-87fb79e0f78c">

### &emsp;Gerenciamento Inteligente de Estoque

&emsp;Chega de dúvidas na hora de abrir o freezer! O StockEasy automatiza o controle<br>
&emsp;de lotes, datas de validade e prioridades de saída para a Sorveteria Pinpinela,<br>
&emsp;ajudando a organizar o estoque com precisão e eficiência.

<br clear="all">


## Objetivo

Ajudar a sorveteria a acompanhar o estoque e reduzir desperdícios. Se dois lotes de picolé de morango têm validades diferentes, a **Vitrine do Dia** destaca o que vence primeiro. Se um lote já passou da validade, ele aparece no filtro de **Vencidos**.

## O que tem no StockEasy?

- **Vitrine do Dia** - mostra o lote que deve sair primeiro e os próximos vencimentos.
- **Estoque** - reúne os lotes com suas quantidades e validades. Na demonstração, é possível registrar entradas e saídas, filtrar os vencidos e consultar produtos com saldo baixo.
- **Cardápio** - organiza os sabores e as linhas, como Fruta e Leite. No cadastro de cada lote, a equipe combina essas opções com a categoria Picolé ou Pote.

## 🛠️ Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Interface | React, Vite e CSS |
| API | Haskell e Servant |
| Banco de dados | MySQL |
