# Dívida em Jogo


Jogo educativo que ensina jovens a reconhecer as armadilhas do crédito. O jogador controla o Thaw, de 22 anos, em 10 fases (meses), e decide sobre cartão de crédito, rotativo, parcelamento, cheque especial, empréstimos e golpes do Pix. Quem termina com bom desempenho ganha uma planilha de controle de gastos.

Projeto Integrador do curso de Análise e Desenvolvimento de Sistemas da Universidade Santo Amaro (UNISA), 2026.

**Jogar:** [link do jogo publicado]

## Objetivo

Avaliar se um jogo digital melhora a compreensão de conceitos de crédito (juros, parcelamento, rotativo e cheque especial), por meio de pré-teste e pós-teste com jovens.

## Como funciona

- 10 fases, cada uma com um evento de crédito ou de consumo e 2 ou 3 opções.
- O jogo mostra na hora o efeito de cada escolha no saldo, nas dívidas e nos juros.
- Pontos de experiência, níveis, sequência de boas escolhas e um vilão, o Dr. Juros.
- Prêmio: planilha de controle de gastos (lançamentos, resumo mensal, regra 50/30/20 e mapa de dívidas).

As taxas usadas no jogo são ilustrativas (rotativo 14%, empréstimo 9% e cheque especial 8% ao mês). O jogo tem fins educativos e não é consultoria financeira.

## Como executar

Não precisa instalar nada. Baixe o repositório e abra o arquivo `index.html` no navegador.

## Estrutura

| Arquivo | Conteúdo |
|---|---|
| `index.html` | Estrutura da página |
| `style.css` | Visual do jogo |
| `jogo.js` | Regras, fases e lógica |
| `planilha.js` | Planilha-prêmio codificada em base64 |
| `planilha-thaw-controle-de-gastos.xlsx` | Planilha-prêmio em formato Excel |

## Tecnologias

HTML, CSS e JavaScript, sem bibliotecas e sem banco de dados.

## Autoria

Thawan Henrique Coelho Gimenes

Curso de Análise e Desenvolvimento de Sistemas, Universidade Santo Amaro
