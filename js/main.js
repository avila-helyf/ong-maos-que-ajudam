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

  /* O link de bypass ("Pular para o conteúdo principal") NÃO pode usar
     href="#conteudo-spa" normalmente: como router.js escuta TODO evento
     hashchange, mudar o hash acionaria o roteador, que não reconhece
     "conteudo-spa" como rota e cairia de volta na home — o oposto do
     que o link deveria fazer. Por isso interceptamos o clique e movemos
     o foco diretamente, sem tocar em location.hash. */
  const linkPular = document.querySelector(".skip-link");
  const conteudo = document.getElementById("conteudo-spa");
  if (linkPular && conteudo) {
    linkPular.addEventListener("click", function (evento) {
      evento.preventDefault();
      conteudo.focus();
    });
  }
});
