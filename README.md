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
- **Vite** — bundler/build de produção: empacota os módulos ES6 em um único arquivo minificado, extrai e minifica o CSS, e (via `scripts/minificar-html.js`) minifica o HTML final.
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
├── imagens/               # assets visuais (logo, ilustrações)
├── scripts/
│   ├── copiar-estaticos.js # copia imagens/ e js/vendor/ para dist/ no build
│   └── minificar-html.js   # minifica o HTML de saída do Vite
├── package.json
└── vite.config.js
```

## Pré-requisitos

- Um navegador atual (Chrome, Firefox, Edge ou Safari recentes).
- Para rodar **sem build** (como o projeto sempre funcionou): Python 3 (ou qualquer outro servidor HTTP estático) — necessário porque a aplicação usa módulos ES6, que não funcionam abrindo o `index.html` direto como arquivo (`file://`).
- Para rodar o **build de produção** (opcional, adicionado na etapa de empacotamento/minificação): Node.js 18+ e npm. A única dependência de terceiros em tempo de execução (IMask.js) continua vendorizada em `js/vendor/`; o Node/npm só entram como ferramenta de build, não como runtime da aplicação.

## Instalação

```bash
git clone <url-do-repositorio>
cd projeto-ong
```

Para rodar direto (sem build), não é preciso mais nada. Para usar o Vite (build/minificação ou servidor de desenvolvimento), instale as dependências de build:

```bash
npm install
```

## Como executar

**Sem build** (como o projeto sempre funcionou — é só servir os arquivos estáticos):

```bash
python3 -m http.server 8000
```

E acessar `http://localhost:8000/html/index.html` no navegador.

**Com Vite** (após `npm install`):

```bash
npm run dev       # servidor de desenvolvimento com recarregamento automático
npm run build     # gera o build de produção (bundling + minificação) em dist/
npm run preview   # serve o conteúdo de dist/ para conferir o build final
```

O `npm run build` deixa o resultado em `dist/html/index.html`, pronto para publicar — ver "Minificação" abaixo para os números reais de redução de tamanho.

## Minificação

O build de produção (`npm run build`) usa o **Vite** como bundler: empacota os 8 módulos ES6 próprios (antes servidos como 8 arquivos `<script type="module">` separados) em um único arquivo JS minificado via esbuild, extrai e minifica o CSS, e um script próprio (`scripts/minificar-html.js`, com `html-minifier-terser`) minifica o HTML final. Medindo os arquivos-fonte contra a saída de um build real:

| Arquivo | Fonte | Minificado | Redução |
|---|---|---|---|
| JS (8 módulos próprios) | 38.611 bytes | 17.935 bytes | 53,5% |
| CSS | 26.994 bytes | 12.748 bytes | 52,8% |
| HTML | 5.331 bytes | 2.121 bytes | 60,2% |
| **Total** | **70.936 bytes** | **32.804 bytes** | **53,8%** |

(`js/vendor/imask.min.js`, por já vir minificado de fábrica pela própria biblioteca, foi copiado como está — ver comentário em `scripts/copiar-estaticos.js` sobre por que esse arquivo e as imagens referenciadas só em tempo de execução precisam ser copiados à parte, já que o Vite não os descobre sozinho.)

## Testes

O projeto não possui uma suíte de testes automatizados (unitários) configurada — é um projeto front-end estático, sem framework de testes integrado. A validação foi feita de duas formas ao longo do desenvolvimento:

- **Validação nativa do navegador**: atributos `required`/`pattern`/`type` no formulário, checados via `checkValidity()`/`reportValidity()`.
- **Testes manuais end-to-end com Playwright** (headless Chromium), rodados durante o desenvolvimento para confirmar visualmente o comportamento de cada tela, o roteamento por hash, as máscaras, a persistência em localStorage e a ausência de erros no console — não fazem parte do repositório como uma suíte permanente, mas guiaram as correções de bugs.
- Depois de cada `npm run build`, a mesma bateria de testes Playwright foi reaplicada servindo o conteúdo de `dist/` (o build minificado real, não o código-fonte), para garantir que o bundling/minificação não quebrou nenhum comportamento — ver "Minificação" acima.

## Publicação e deploy

O site é publicado no **GitHub Pages**, com entrega contínua via **GitHub Actions** (`.github/workflows/deploy.yml`). A escolha recaiu sobre o GitHub Pages por três motivos técnicos: (1) o projeto já é um site 100% estático após o build (HTML/CSS/JS/imagens, sem backend) — exatamente o que o Pages serve, sem custo e sem servidor para administrar; (2) o hospedeiro já é o mesmo GitHub onde o código está versionado, então não é preciso conectar uma conta externa nem gerenciar credenciais adicionais; (3) o deploy fica automaticamente auditável pelo histórico de Actions do próprio repositório.

Fluxo de configuração:

1. O repositório foi criado no GitHub e o histórico local (já no padrão GitFlow, com `main`/`develop`/`feature/*`) foi enviado via `git push`.
2. Em Settings → Pages, a opção "Source" foi definida como **GitHub Actions** (em vez de servir direto de uma branch), para que o workflow controle o build.
3. O workflow `deploy.yml` dispara a cada push em `main`: instala as dependências (`npm ci`), roda `npm run build` (o mesmo pipeline Vite descrito em "Minificação" acima, com a variável `VITE_BASE=/ong-maos-que-ajudam/` — necessária porque um repositório de projeto no GitHub Pages serve o site dentro desse subcaminho, não na raiz do domínio) e publica o conteúdo de `dist/` com as actions oficiais `upload-pages-artifact`/`deploy-pages`.
4. Esse mesmo mecanismo é a integração contínua: qualquer novo merge em `main` reconstrói e republica o site automaticamente, sem passo manual.

URL publicada: `https://avila-helyf.github.io/ong-maos-que-ajudam/`
Repositório: `https://github.com/avila-helyf/ong-maos-que-ajudam`

## Funcionalidades principais

- Navegação SPA entre Início / Projetos / Cadastro, sem recarregar a página (`#/inicio`, `#/projetos`, `#/cadastro`).
- Formulário de cadastro com máscaras de CPF/telefone/CEP, autopreenchimento de endereço via ViaCEP e validação visual (`:valid`/`:invalid`) só após interação do usuário.
- Histórico de cadastros enviados, persistido em localStorage e restaurado automaticamente ao recarregar a página.
- Design responsivo (mobile-first) com menu hambúrguer e grid de 12 colunas.

## Versionamento

O projeto segue [Versionamento Semântico (SemVer)](https://semver.org/lang/pt-BR/) e o fluxo **GitFlow** (`main`/`develop`/`feature/*`/`release/*`). A versão atual é a `v1.1.0` (tag anotada na branch `main`) — incremento *minor* sobre a `v1.0.0` por adicionar funcionalidades novas e retrocompatíveis: tema escuro/alto contraste, build de produção com Vite, otimização de imagens e publicação contínua no GitHub Pages.

## Licença

Projeto acadêmico, sem licença de distribuição definida. A biblioteca externa IMask.js é distribuída sob licença MIT.
