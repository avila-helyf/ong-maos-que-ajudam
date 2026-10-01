/* ==========================================================
   ONG Mãos que Ajudam — Roteador da SPA
   Módulo ES6. Implementa navegação de página única via hash
   (#/rota). Como mudar o hash na MESMA página nunca dispara um
   carregamento completo do documento, o navegador já "intercepta"
   a navegação para nós: o ponto em que entramos em ação é o evento
   "hashchange", disparado sempre que o usuário clica num link
   #/... ou edita a URL manualmente. É nesse momento que lemos a
   rota atual e trocamos, de forma programática, o conteúdo de
   #conteudo-spa via innerHTML — sem nenhuma requisição ao servidor
   e sem recarregar header/footer/scripts.

   Depende de templates.js (a tabela de rotas ROTAS, o "catálogo" do
   que cada URL deve mostrar) e de menu.js (só para fechar o menu
   mobile após navegar) — duas importações de sentido único, sem
   nada vindo de volta destes módulos na direção do roteador.
   ========================================================== */

import { ROTAS } from "./templates.js";
import { fecharMenuMobile } from "./menu.js";

function normalizarRota(hash) {
  const rota = hash.replace(/^#\/?/, "").replace(/\/$/, "");
  return rota === "" ? "inicio" : rota;
}

function atualizarLinkAtivo(rota) {
  document.querySelectorAll('nav a[href^="#/"]').forEach(function (link) {
    const rotaDoLink = normalizarRota(link.getAttribute("href"));
    if (rotaDoLink === rota) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function renderizarRota(conteudo, ehCargaInicial) {
  const rota = normalizarRota(location.hash);
  const view = ROTAS[rota] || ROTAS.inicio;

  /* Injeção programática do conteúdo no DOM: é aqui que a view
     anterior é descartada e a nova é desenhada. */
  conteudo.innerHTML = view.template();

  document.title = view.titulo;
  atualizarLinkAtivo(rota);

  /* Anuncia a navegação para quem usa leitor de tela (ver #anuncio-rota
     no index.html) — só em navegações reais dentro da SPA, não na carga
     inicial (nada "aconteceu" ainda nesse momento, e o leitor de tela já
     anuncia o título da página normalmente ao carregá-la). Como é uma
     região aria-live="polite", a mudança de texto é lida automaticamente,
     sem roubar o foco do usuário. */
  if (!ehCargaInicial) {
    const anuncioRota = document.getElementById("anuncio-rota");
    if (anuncioRota) {
      anuncioRota.textContent = "Navegou para: " + view.titulo;
    }
  }

  /* Views com formulário/JS próprio (ex.: cadastro) reanexam seus
     listeners aqui, já que os elementos acabaram de ser recriados
     no DOM e quaisquer listeners antigos foram perdidos junto com
     o HTML substituído. */
  if (typeof view.init === "function") {
    view.init();
  }

  /* Acessibilidade: move o foco para o novo conteúdo e volta o
     scroll ao topo, simulando a navegação de uma página "de
     verdade" para quem usa teclado ou leitor de tela — mas só em
     navegações DENTRO da SPA, não na carga inicial da página. Focar
     #conteudo-spa automaticamente já na primeira renderização faria
     o foco do teclado "pular" o skip-link (que é o primeiro elemento
     focável do documento) antes mesmo do usuário apertar Tab uma vez,
     inutilizando-o. Na carga inicial, o foco é deixado no início do
     documento, como em qualquer página comum. */
  if (!ehCargaInicial) {
    conteudo.focus();
  }
  window.scrollTo(0, 0);

  fecharMenuMobile();
}

export function iniciarRoteador() {
  const conteudo = document.getElementById("conteudo-spa");
  if (!conteudo) return;

  window.addEventListener("hashchange", function () {
    renderizarRota(conteudo, false);
  });

  renderizarRota(conteudo, true);
}
