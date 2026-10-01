/* ==========================================================
   ONG Mãos que Ajudam — Máscaras de entrada
   Módulo ES6 sem importações de outros módulos do projeto: só
   depende de IMask, exposto como variável GLOBAL por um <script>
   clássico (js/vendor/imask.min.js), carregado antes deste no
   index.html. Essa biblioteca de terceiros é um build UMD, não um
   módulo ES6 — por isso continua carregada à parte, fora do grafo
   de import/export, e é referenciada aqui só pelo nome global
   IMask (com verificação de que existe, antes de usá-la).

   A validação REAL dos dados continua sendo feita pelo atributo
   `pattern` no HTML (que recebe exatamente o mesmo formato que a
   máscara produz) e, de forma obrigatória, no lado do servidor.

   Exposta como export function inicializarMascaras() em vez de
   rodar automaticamente — na SPA, o formulário só existe no DOM
   depois que a rota #/cadastro é renderizada pelo roteador, então
   é ele quem chama esta função no momento certo (indiretamente,
   através de templates.js) — e volta a chamá-la toda vez que o
   usuário navega de volta para o cadastro.
   ========================================================== */

export function inicializarMascaras() {

  if (typeof IMask === "undefined") {
    /* Se o script da biblioteca não carregar por algum motivo, o
       formulário continua funcional (os campos aceitam digitação
       normal) — só perde a formatação automática. */
    console.warn("IMask.js não foi carregado: máscaras de entrada desativadas nesta sessão.");
  } else {
    const campoCPF = document.getElementById("cpf");
    if (campoCPF) {
      IMask(campoCPF, { mask: "000.000.000-00" });
    }

    const campoTelefone = document.getElementById("telefone");
    if (campoTelefone) {
      /* Máscara dinâmica: alterna entre 8 e 9 dígitos conforme a
         quantidade de números já digitados, para cobrir tanto
         telefones fixos quanto celulares. */
      IMask(campoTelefone, {
        mask: [
          { mask: "(00) 0000-0000" },
          { mask: "(00) 00000-0000" },
        ],
        dispatch: function (digitoDigitado, mascaraDinamica) {
          const numeros = (mascaraDinamica.value + digitoDigitado).replace(/\D/g, "");
          return numeros.length > 10
            ? mascaraDinamica.compiledMasks[1]
            : mascaraDinamica.compiledMasks[0];
        },
      });
    }

    const campoCEP = document.getElementById("cep");
    if (campoCEP) {
      IMask(campoCEP, { mask: "00000-000" });
    }
  }

  /* Marca cada campo como "tocado" ao perder o foco pela primeira
     vez. O feedback visual de sucesso/erro (:valid/:invalid) só é
     aplicado a campos com essa classe — isso evita usar o truque
     :not(:placeholder-shown), que não funciona de forma confiável
     em <select> nem em <input type="date">. Assim, nenhum campo
     aparece em vermelho antes do usuário interagir com ele. */
  document.querySelectorAll(".campo input, .campo select").forEach(function (campo) {
    campo.addEventListener("blur", function () {
      campo.classList.add("tocado");
    });
  });

  /* Busca automática de endereço pelo CEP usando a API pública ViaCEP.
     É apenas uma conveniência de preenchimento: o usuário continua
     podendo editar manualmente os campos preenchidos. */
  const campoCEPBusca = document.getElementById("cep");
  if (campoCEPBusca) {
    campoCEPBusca.addEventListener("blur", function () {
      const cepLimpo = campoCEPBusca.value.replace(/\D/g, "");
      if (cepLimpo.length !== 8) return;

      fetch("https://viacep.com.br/ws/" + cepLimpo + "/json/")
        .then(function (resposta) { return resposta.json(); })
        .then(function (dados) {
          if (dados.erro) return;
          const campoEndereco = document.getElementById("endereco");
          const campoCidade = document.getElementById("cidade");
          const campoEstado = document.getElementById("estado");

          if (campoEndereco && dados.logradouro) {
            campoEndereco.value = dados.logradouro;
          }
          if (campoCidade && dados.localidade) {
            campoCidade.value = dados.localidade;
          }
          if (campoEstado && dados.uf) {
            campoEstado.value = dados.uf;
          }
        })
        .catch(function () {
          /* Falha na consulta não deve bloquear o preenchimento manual. */
        });
    });
  }
}
