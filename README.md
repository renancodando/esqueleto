# CellFix

Site da assistência técnica CellFix (Piúma – ES). Uma página só, em HTML, CSS e JavaScript puros:
sem dependências, sem build, cerca de 120 KB no total.

A ideia do site: ele **testa o celular do visitante**. A abertura é uma grade de teste de toque que
pinta de verde onde o dedo passa, e a seção "Teste" roda cinco verificações em tela cheia — toque,
pixels, som, vibração e bateria — e monta um laudo para enviar à loja.

## Rodar

```sh
python3 -m http.server 3000
```

Abra `http://localhost:3000`. Para publicar, basta hospedar a pasta (Vercel, Netlify, GitHub Pages).

## Arquivos

- `index.html` — conteúdo: textos, serviços, dúvidas, contato
- `styles.css` — identidade visual
- `app.js` — grade de toque, os cinco testes e o laudo
- `assets/` — fonte Bricolage Grotesque (licença OFL) e favicon

## Antes de divulgar

- **WhatsApp:** em `app.js`, preencha `CONFIG.whatsapp` com país + DDD + número, só dígitos.
  Com o número, o botão do laudo abre a conversa já com o resultado; sem ele, o botão copia o texto.
- **Endereço:** o site mostra só "Piúma – Espírito Santo". Inclua rua e número em `index.html`,
  na seção `#contato`, e ajuste o link do mapa.
- **Textos de serviço e garantia:** são descrições genéricas; preços e prazo de garantia não foram
  informados e não aparecem no site.

## Limites dos testes

- Vibração só funciona em navegadores Android; no iPhone o site pede a resposta ao visitante.
- A carga da bateria só aparece onde o navegador a informa (Chrome no Android); nos demais o teste
  vira uma pergunta.
- Nada é enviado nem salvo: o resultado fica na aba até o visitante copiar ou enviar o laudo.
