# TechCell

Site estático multipáginas em português, inspirado na referência fornecida. HTML, CSS e JavaScript, sem dependências de execução e sem banco de dados.

## Páginas

- `index.html`: laboratório interativo, carrossel de serviços, análise demonstrativa e acesso às etapas.
- `servicos.html`: catálogo com busca, filtros e detalhes de cada serviço.
- `processo.html`: quatro etapas interativas, com navegação por teclado e links diretos.
- `diferenciais.html`: apresentação dos cuidados e compromissos do atendimento.
- `sobre.html`: apresentação da TechCell.
- `avaliacoes.html`: indicadores da referência e prévia local de comentário.
- `faq.html`: busca e categorias de perguntas frequentes.
- `contato.html`: formulário, mensagem copiável e localização regional.

## Executar

```sh
python3 -m http.server 3000
```

Abra `http://localhost:3000`. Todos os arquivos podem ser hospedados diretamente na raiz em Vercel, GitHub Pages ou outro servidor estático, sem build.

## Animações

A arte `assets/laboratorio.png` foi recriada a partir da referência. Camadas de Canvas 2D adicionam corrente e queda de água, respingos, reflexos, partículas holográficas e fluxo de energia no tubo. CSS anima o núcleo do reator, o scan, os ícones, os painéis e a iluminação dos controles.

As camadas acompanham o recorte da imagem em cada viewport. O renderizador limita a densidade de pixels e os quadros por segundo, e pausa quando a aba fica oculta. Há controle para pausar os efeitos e respeito a `prefers-reduced-motion`.

## Configurar a empresa

Em `app.js`, preencha `CONFIG.whatsapp` com o número oficial, incluindo país e DDD, somente dígitos. O botão para enviar a mensagem ao WhatsApp aparece quando esse número está configurado. Sem o número, o visitante pode preparar e copiar a mensagem. O site não envia, armazena ou acompanha solicitações.

A localização Piúma/ES, horário 08h–19h, métricas e depoimento reproduzem a referência visual. Confirme os dados comerciais, substitua os indicadores pelos números reais e informe o endereço completo antes de divulgar. O formulário de avaliação gera uma prévia; não publica comentários. O painel de diagnóstico é uma demonstração visual, não uma consulta a reparos reais.

`build_pages.py` gera as oito páginas a partir de modelos compartilhados. Execute `python3 build_pages.py` após alterar esses modelos. O CSS e o JavaScript são compartilhados entre as páginas. A fonte Orbitron está incluída localmente; sua licença está em `assets/OFL.txt`.
