/* ==========================================================
   ONG Mãos que Ajudam — minificação do HTML de saída
   O Vite minifica JS (esbuild) e CSS sozinho durante `vite build`, mas
   não mexe no HTML além de injetar as tags <script>/<link> com os
   nomes finais (com hash) dos arquivos gerados. Este script roda logo
   depois (ver "build" em package.json) e minifica esse HTML já
   processado: remove comentários, colapsa espaços em branco e
   atributos redundantes — sem tocar no <script> clássico embutido no
   <head> (a leitura do tema salvo), que precisa continuar executável.
   ========================================================== */

import { readFile, writeFile } from "node:fs/promises";
import { minify } from "html-minifier-terser";

const CAMINHO = "dist/index.html";

const original = await readFile(CAMINHO, "utf-8");

const minificado = await minify(original, {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeEmptyAttributes: true,
  minifyCSS: true,
  minifyJS: true, // minifica o CONTEÚDO do <script> inline (leitura do tema)
  conservativeCollapse: false,
});

await writeFile(CAMINHO, minificado, "utf-8");

const antes = Buffer.byteLength(original, "utf-8");
const depois = Buffer.byteLength(minificado, "utf-8");
const reducao = (100 - (depois / antes) * 100).toFixed(1);

console.log(`HTML minificado: ${antes} -> ${depois} bytes (-${reducao}%)`);
