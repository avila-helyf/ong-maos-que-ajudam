/* ==========================================================
   ONG Mãos que Ajudam — Componentes de feedback do formulário
   Módulo ES6. Controla o alerta dinâmico (sucesso/erro) e o toast
   exibidos após a tentativa de envio do cadastro, e persiste o
   cadastro bem-sucedido via armazenamento.js.

   Este módulo DELIBERADAMENTE não importa nada de templates.js,
   mesmo precisando "avisar" aquele módulo para atualizar a lista
   de histórico na tela depois de um envio: um import direto criaria
   uma dependência circular (templates.js já importa
   inicializarFeedback() daqui, para plugar no init() da rota de
   cadastro). Em vez disso, dispara um evento customizado no DOM
   (CustomEvent "cadastro:salvo") — quem quiser reagir a isso escuta
   o evento, sem precisar ser importado nem importar este arquivo.
   Esse desacoplamento é o que permite os dois módulos se
   comunicarem sem gerar uma dependência problemática entre eles.

   Exposta como export function inicializarFeedback(), chamada
   indiretamente pelo roteador (via templates.js) logo após a view
   #/cadastro ser desenhada no DOM — o formulário só existe a partir
   desse momento.
   ========================================================== */

import { salvarCadastro } from "./armazenamento.js";

export function inicializarFeedback() {
  const form = document.getElementById("form-cadastro");
  const areaFeedback = document.getElementById("area-feedback");
  const toast = document.getElementById("toast");

  if (!form || !areaFeedback || !toast) return;

  let toastTimeout = null;

  function mostrarToast(mensagem, variante) {
    toast.textContent = mensagem;
    toast.className = "toast toast-visivel" + (variante === "erro" ? " toast-erro" : "");

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(function () {
      toast.classList.remove("toast-visivel");
    }, 4000);
  }

  function mostrarAlerta(tipo, titulo, mensagem) {
    const icones = { sucesso: "&#10003;", erro: "&#9888;" };
    areaFeedback.innerHTML =
      '<div class="alerta alerta-' + tipo + '" role="alert">' +
      '<span class="alerta-icone" aria-hidden="true">' + icones[tipo] + "</span>" +
      "<span><strong>" + titulo + "</strong> " + mensagem + "</span>" +
      "</div>";
  }

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    /* Marca todos os campos como "tocados" na tentativa de envio,
       para que o feedback visual de erro apareça imediatamente em
       todos os campos inválidos, não só no primeiro focado pelo
       reportValidity(). */
    form.querySelectorAll(".campo input, .campo select").forEach(function (campo) {
      campo.classList.add("tocado");
    });

    if (form.checkValidity()) {
      /* Monta um objeto simples com os dados a persistir, lendo os
         campos ANTES do form.reset() (que limparia os valores). */
      const dadosCadastro = {
        nome: document.getElementById("nome").value,
        cidade: document.getElementById("cidade").value,
        estado: document.getElementById("estado").value,
        interesses: Array.from(form.querySelectorAll('input[name="interesse"]:checked')).map(function (campo) {
          return campo.value;
        }),
        enviadoEm: new Date().toLocaleDateString("pt-BR"),
      };

      salvarCadastro(dadosCadastro);

      /* Avisa quem estiver interessado (templates.js) de que um novo
         cadastro foi salvo, sem precisar importar aquele módulo. */
      document.dispatchEvent(new CustomEvent("cadastro:salvo"));

      mostrarAlerta(
        "sucesso",
        "Cadastro enviado com sucesso!",
        "Obrigado por se juntar à ONG Mãos que Ajudam. Entraremos em contato em breve."
      );
      mostrarToast("Cadastro enviado com sucesso!", "sucesso");
      form.reset();
      /* Remove a marcação de "tocado" após o reset, para que o
         formulário volte a um estado neutro (sem bordas coloridas)
         pronto para um novo cadastro. */
      form.querySelectorAll(".campo input, .campo select").forEach(function (campo) {
        campo.classList.remove("tocado");
      });
    } else {
      mostrarAlerta(
        "erro",
        "Não foi possível enviar o formulário.",
        "Verifique os campos destacados em vermelho e tente novamente."
      );
      mostrarToast("Corrija os campos destacados antes de enviar.", "erro");
      form.reportValidity();
    }
  });
}
