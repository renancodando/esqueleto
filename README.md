# CellFix

Site da assistência técnica CellFix (Piúma – ES). Uma página só, em HTML, CSS e JavaScript puros:
sem dependências, sem build, cerca de 135 KB no total.

## O que tem na página

- **Loja:** serviços, sobre a CellFix, como funciona, garantia, dúvidas e contato.
- **Orçamento:** o visitante escolhe a marca, escreve o modelo e marca os defeitos. O site monta a
  mensagem, mostra como ela vai ficar e abre o WhatsApp com tudo pronto. Não precisa fazer teste nenhum.
- **Teste do aparelho (opcional):** toque, pixels, som, vibração e bateria, em tela cheia. O que
  falhar já marca o defeito no orçamento e entra na mensagem.
- **Abertura:** a grade ao fundo é o próprio teste de toque — pinta de verde onde o dedo passa.

## Rodar

```sh
python3 -m http.server 3000
```

Abra `http://localhost:3000`. Para publicar, basta hospedar a pasta (Vercel, Netlify, GitHub Pages).

## Arquivos

- `index.html` — conteúdo: textos, serviços, opções de defeito, dúvidas, contato
- `styles.css` — identidade visual
- `app.js` — grade de toque, os cinco testes e a mensagem de orçamento
- `assets/` — fonte Bricolage Grotesque (licença OFL) e favicon

## Antes de divulgar

- **WhatsApp:** em `app.js`, preencha `CONFIG.whatsapp` com país + DDD + número, só dígitos
  (ex.: `5528999990000`). Sem o número, o WhatsApp abre com a mensagem pronta, mas pede para o
  visitante escolher o contato — ou seja, a mensagem não chega à loja.
- **Endereço:** o site mostra só "Piúma – Espírito Santo". Inclua rua e número em `index.html`,
  na seção `#contato`, e ajuste o link do mapa.
- **Textos:** os de serviços, sobre e garantia vêm do site anterior, reescritos. Preços e prazo de
  garantia não foram informados e não aparecem. Confira se as condições descritas são as da loja.

## Limites dos testes

- **Vibração:** só navegadores Android deixam um site vibrar o aparelho, e mesmo neles o sistema
  ignora o pedido com modo silencioso, Não Perturbe, economia de bateria ou vibração ao toque
  desligada. Navegadores embutidos (Instagram, WhatsApp) também costumam bloquear. No iPhone não
  existe vibração para sites; o teste tenta um toque háptico leve e, na dúvida, pergunta ao visitante.
- **Bateria:** a carga só aparece onde o navegador a informa (Chrome no Android); nos demais o teste
  vira uma pergunta.
- Nada é enviado nem salvo: tudo fica na aba até o visitante enviar ou copiar a mensagem.
