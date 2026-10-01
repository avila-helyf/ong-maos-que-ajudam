/* ==========================================================
   ONG Mãos que Ajudam — Ponto de entrada da aplicação
   Único módulo referenciado diretamente pelo index.html
   (<script type="module" src="../js/main.js">). Todo o resto do
   JavaScript próprio do projeto chega até a página através da
   cadeia de import/export a partir daqui — não há mais nenhuma
   função "solta" no escopo global.
   ========================================================== */

import { inicializarMenu } from "./menu.js";
import { iniciarRoteador } from "./router.js";

document.addEventListener("DOMContentLoaded", function () {
  inicializarMenu();
  iniciarRoteador();
});
