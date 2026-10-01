# Mãos que Ajudam

Site institucional da ONG fictícia **Mãos que Ajudam**, desenvolvido como
projeto de curso e evoluído progressivamente até se tornar uma **Single
Page Application (SPA)** em JavaScript puro (módulos ES6), com formulário
de cadastro validado, máscaras de campo (biblioteca externa IMask.js),
persistência local de dados (localStorage) e um design system próprio
em CSS.

## Tecnologias utilizadas

- **HTML5 semântico** — header/nav/main/section/article/footer, formulário acessível com fieldset/legend e validação nativa (pattern, required, type).
- **CSS3** — variáveis customizadas (design system de cor/tipografia/espaçamento), Grid de 12 colunas, Flexbox, 5 breakpoints responsivos mobile-first.
- **JavaScript (ES6+)** — módulos nativos (`import`/`export`), template literals, arrow/callback functions, `fetch`, `CustomEvent`, manipulação de DOM.
- **IMask.js v7.6.1** (MIT) — biblioteca externa para máscaras de CPF/telefone/CEP, vendorizada localmente em `js/vendor/`.
- **API ViaCEP** — autopreenchimento de endereço a partir do CEP.
- **localStorage** — persistência do histórico de cadastros enviados.
- **Git / GitFlow** — `main`, `develop` e branches `feature/*`, com releases via tag (`v1.0.0`).

## Estrutura de pastas

```
projeto-ong/
├── html/
│   └── index.html        # shell único da SPA
├── css/
│   └── style.css         # design system e estilos
├── js/
│   ├── main.js            # ponto de entrada (único <script type="module">)
│   ├── router.js          # roteamento por hash
│   ├── templates.js       # templates de cada view
│   ├── armazenamento.js   # persistência em localStorage
│   ├── mascaras.js        # máscaras de campo (IMask) + ViaCEP
│   ├── feedback.js        # validação e feedback do formulário
│   ├── menu.js             # menu hambúrguer responsivo
│   └── vendor/
│       └── imask.min.js   # biblioteca externa vendorizada
└── imagens/               # assets visuais (logo, ilustrações)
```

## Pré-requisitos

- Um navegador atual (Chrome, Firefox, Edge ou Safari recentes).
- Python 3 (ou qualquer outro servidor HTTP estático) — necessário porque a aplicação usa módulos ES6, que não funcionam abrindo o `index.html` direto como arquivo (`file://`).
- Não há dependências via npm para instalar: o projeto é 100% estático, e a única biblioteca externa (IMask.js) já vem pronta dentro de `js/vendor/`.

## Instalação

```bash
git clone <url-do-repositorio>
cd projeto-ong
```

Não há passo de build nem `npm install` — é só clonar e servir os arquivos.

## Como executar

```bash
python3 -m http.server 8000
```

E acessar `http://localhost:8000/html/index.html` no navegador.

## Testes

O projeto não possui uma suíte de testes automatizados (unitários) configurada — é um projeto front-end estático, sem framework de testes integrado. A validação foi feita de duas formas ao longo do desenvolvimento:

- **Validação nativa do navegador**: atributos `required`/`pattern`/`type` no formulário, checados via `checkValidity()`/`reportValidity()`.
- **Testes manuais end-to-end com Playwright** (headless Chromium), rodados durante o desenvolvimento para confirmar visualmente o comportamento de cada tela, o roteamento por hash, as máscaras, a persistência em localStorage e a ausência de erros no console — não fazem parte do repositório como uma suíte permanente, mas guiaram as correções de bugs.

## Funcionalidades principais

- Navegação SPA entre Início / Projetos / Cadastro, sem recarregar a página (`#/inicio`, `#/projetos`, `#/cadastro`).
- Formulário de cadastro com máscaras de CPF/telefone/CEP, autopreenchimento de endereço via ViaCEP e validação visual (`:valid`/`:invalid`) só após interação do usuário.
- Histórico de cadastros enviados, persistido em localStorage e restaurado automaticamente ao recarregar a página.
- Design responsivo (mobile-first) com menu hambúrguer e grid de 12 colunas.

## Versionamento

O projeto segue [Versionamento Semântico (SemVer)](https://semver.org/lang/pt-BR/) e o fluxo **GitFlow** (`main`/`develop`/`feature/*`/`release/*`). A versão atual é a `v1.0.0` (tag anotada na branch `main`).

## Licença

Projeto acadêmico, sem licença de distribuição definida. A biblioteca externa IMask.js é distribuída sob licença MIT.
