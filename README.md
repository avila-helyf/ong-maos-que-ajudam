# Mãos que Ajudam

Site institucional da ONG fictícia "Mãos que Ajudam", evoluído ao longo do
curso para uma Single Page Application (SPA) em JavaScript puro (módulos
ES6), com formulário de cadastro validado, máscaras de campo (IMask.js),
persistência local (localStorage) e design system próprio em CSS.

## Estrutura

- `html/index.html` — shell único da SPA
- `css/style.css` — design system e estilos
- `js/` — módulos ES6 (main.js é o ponto de entrada) + biblioteca vendorizada em `js/vendor/`
- `imagens/` — assets visuais

## Como rodar localmente

Como a aplicação usa módulos ES6 (`<script type="module">`), não pode ser
aberta direto como arquivo local (`file://`) — é preciso servir por HTTP:

    python3 -m http.server 8000

E acessar `http://localhost:8000/html/index.html`.
