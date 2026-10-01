/* ==========================================================
   ONG Mãos que Ajudam — cópia de estáticos não rastreáveis pelo Vite
   O Vite só enxerga (e processa/copia) referências a arquivos que
   consegue analisar estaticamente dentro do HTML de entrada. Dois
   casos do projeto escapam disso, e o build quebraria sem este script:

   1) js/vendor/imask.min.js é carregado por uma tag <script> CLÁSSICA
      (sem type="module"), de propósito — é um UMD que expõe `IMask`
      como global, não um módulo ES6 (ver comentário em html/index.html
      e js/mascaras.js). O próprio `vite build` avisa no terminal que
      não consegue empacotar esse tipo de tag e a deixa inalterada no
      HTML de saída ("../js/vendor/imask.min.js") — então o ARQUIVO
      precisa existir nesse mesmo caminho relativo dentro de dist/,
      ou o site publicado quebra (máscaras de CPF/telefone/CEP fora do
      ar, o <script type="module"> seguinte nem chega a rodar se isso
      lançar um erro não tratado).

   2) imagens/voluntarios.png só aparece como uma STRING dentro de
      js/templates.js (o <img src="../imagens/voluntarios.png"> é
      montado em tempo de execução, dentro de um template literal) —
      o Vite não enxerga strings assim, só <img src="..."> que já
      existem no próprio HTML (por isso o logo.png, referenciado direto
      no index.html, É reaproveitado automaticamente pelo Vite).

   Em vez de reescrever templates.js para usar import.meta.url (o que
   mudaria a arquitetura só por causa do bundler), este script copia
   imagens/ e js/vendor/ para dentro de dist/ preservando a MESMA
   estrutura de pastas do projeto-fonte — assim as referências
   relativas (de dist/html/index.html, uma pasta abaixo) continuam
   batendo exatamente como no ambiente sem build. ========================================================== */

import { cp } from "node:fs/promises";

await cp("imagens", "dist/imagens", { recursive: true });
await cp("js/vendor", "dist/js/vendor", { recursive: true });

console.log("Estáticos copiados: dist/imagens/ e dist/js/vendor/");
