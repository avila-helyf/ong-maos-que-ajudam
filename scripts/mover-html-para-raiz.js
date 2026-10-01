/* ==========================================================
   ONG Mãos que Ajudam — mover o HTML de saída para a raiz de dist/
   O Vite espelha o caminho do arquivo de entrada: como ele vive em
   html/index.html no código-fonte, a saída normal seria
   dist/html/index.html. Isso é um problema para hospedagem estática
   (GitHub Pages, Vercel, Netlify): todas elas procuram um index.html
   na RAIZ da pasta publicada para servir a URL base do site. Em vez de
   reestruturar o projeto-fonte (o que mudaria os caminhos relativos
   usados em todo o resto do código), este script roda só no build de
   produção e move o arquivo já gerado para dist/index.html.

   Isso é seguro para todo caminho que o próprio Vite processa (CSS,
   módulos JS, favicons, <picture>/<source> do index.html) porque esses
   já saem como caminho ABSOLUTO, prefixado pelo "base" do
   vite.config.js — mover o HTML de pasta não muda para onde apontam.

   Duas exceções, deliberadamente FORA do grafo do Vite (ver comentário
   em scripts/copiar-estaticos.js), continuam como caminho relativo
   "../..." no código-fonte e por isso quebrariam ao mudar a pasta do
   HTML de uma pasta abaixo (html/) para a raiz (dist/): a tag clássica
   do IMask em html/index.html, e o <picture> da ilustração de
   voluntários, montado em tempo de execução dentro de uma string em
   js/templates.js (sobrevive literal dentro do bundle minificado,
   então o replace abaixo ainda encontra o texto). As duas são
   reescritas aqui para o mesmo caminho absoluto com base que o Vite já
   usa nos outros caminhos. ========================================================== */

import { readFile, writeFile, rm, readdir } from "node:fs/promises";

const BASE = process.env.VITE_BASE || "/";

const SUBSTITUICOES = [
  ["../js/vendor/imask.min.js", `${BASE}js/vendor/imask.min.js`],
  ["../imagens/voluntarios.svg", `${BASE}imagens/voluntarios.svg`],
  ["../imagens/voluntarios-otimizado.webp", `${BASE}imagens/voluntarios-otimizado.webp`],
  ["../imagens/voluntarios.png", `${BASE}imagens/voluntarios.png`],
];

function aplicarSubstituicoes(texto) {
  let resultado = texto;
  for (const [de, para] of SUBSTITUICOES) {
    resultado = resultado.split(de).join(para);
  }
  return resultado;
}

// 1) Move dist/html/index.html -> dist/index.html, corrigindo a tag do IMask.
const html = await readFile("dist/html/index.html", "utf-8");
await writeFile("dist/index.html", aplicarSubstituicoes(html), "utf-8");
await rm("dist/html", { recursive: true, force: true });

// 2) Corrige, no bundle JS já minificado, a string com o <picture> da
//    ilustração de voluntários (vem de js/templates.js).
const arquivosJs = await readdir("dist/assets");
for (const nome of arquivosJs) {
  if (!nome.endsWith(".js")) continue;
  const caminho = `dist/assets/${nome}`;
  const conteudo = await readFile(caminho, "utf-8");
  if (!conteudo.includes("../imagens/voluntarios")) continue;
  await writeFile(caminho, aplicarSubstituicoes(conteudo), "utf-8");
  console.log(`Caminhos de imagens corrigidos em ${caminho}`);
}

console.log(`HTML movido: dist/html/index.html -> dist/index.html (base "${BASE}")`);
