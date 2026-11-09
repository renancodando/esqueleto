# CellFix

Site multipáginas estático em HTML, CSS e JavaScript. O visual foi substituído pela nova referência CellFix, com fonte de água, celular, iluminação ciano e detalhes em cobre.

## Páginas

Início, Serviços, Sobre, Garantia, Contato, Processo de Reparo, Diferenciais, Avaliações e FAQ. Todas usam a mesma identidade e navegação. A fonte e o celular têm uma área própria no celular, mantendo o conteúdo legível e os serviços em um carrossel lateral.

## Fonte interativa

- Uma superfície WebGL aplica refração animada à água da imagem, queda contínua, ondulações na bacia e resposta ao cursor.
- Canvas 2D complementa a cena com filetes de água, jato curvo, corrente, ondulações e respingos.
- Passar o mouse perturba a corrente; clicar ou tocar cria ondas e gotas. O botão “Interagir com a fonte” e o teclado também permitem acionar a interação.
- A imagem de fundo e o Canvas 2D continuam funcionando sem WebGL.
- Há limite de resolução e quadros por segundo, pausa em abas ocultas ou com a fonte fora de vista no celular, controle de pausa e respeito a `prefers-reduced-motion`.

## Executar

```sh
python3 -m http.server 3000
```

Abra `http://localhost:3000`. Não precisa instalar dependências, compilar ou configurar banco de dados. Pode publicar a pasta diretamente em hospedagem estática.

## Personalizar

- `build_pages.py` contém os modelos das nove páginas. Após editá-lo, execute `python3 build_pages.py`.
- `styles.css` contém a identidade visual e as adaptações para desktop, tablet e celular.
- `app.js` contém a interação da fonte, buscas, filtros, carrossel, modais e formulários.
- `assets/cellfix-fonte.png` é a composição de fundo recriada a partir da imagem fornecida.
- Em `app.js`, preencha `CONFIG.whatsapp` com o número oficial, incluindo país e DDD, apenas dígitos. Sem esse número, o formulário prepara uma mensagem copiável; com ele, também permite abrir a conversa no WhatsApp.

Os formulários não armazenam dados. O formulário de avaliação exibe uma prévia e não publica comentários. Os dados comerciais e os indicadores das páginas internas são conteúdo demonstrativo das referências anteriores e devem ser confirmados antes da divulgação. A nova referência não contém telefone nem endereço completo; esses dados não foram inventados.
