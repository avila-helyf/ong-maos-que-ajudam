/* ==========================================================
   ONG Mãos que Ajudam — Templates das views da SPA
   Cada função retorna, como string, o fragmento HTML de uma
   "página" da aplicação (o que antes era o <main> de um arquivo
   .html separado). O roteador (router.js) injeta esse HTML dentro
   de #conteudo-spa com innerHTML, de acordo com a rota atual.
   Mantemos os templates como funções (não apenas strings fixas)
   para permitir, no futuro, montar o HTML a partir de dados
   dinâmicos (ex.: viria de um array de projetos).

   Este módulo depende de armazenamento.js (ler/limpar o histórico),
   mascaras.js e feedback.js (comportamento da view de cadastro) —
   uma dependência de "montagem": templates.js sabe o que cada view
   precisa, mas nenhum desses três módulos sabe nada sobre
   templates.js. feedback.js, em particular, NÃO é importado aqui de
   volta; a comunicação de feedback.js para cá acontece por um
   CustomEvent ("cadastro:salvo"), especificamente para não fechar
   um ciclo de importação entre os dois arquivos. */

import { obterCadastrosSalvos, limparCadastrosSalvos } from "./armazenamento.js";
import { inicializarMascaras } from "./mascaras.js";
import { inicializarFeedback } from "./feedback.js";

function templateInicio() {
  return `
    <section id="apresentacao" class="secao-destaque">
      <h1>ONG Mãos que Ajudam</h1>
      <p>Há mais de 10 anos, transformamos vidas por meio de projetos sociais voltados à educação, alimentação e capacitação profissional de comunidades em situação de vulnerabilidade.</p>
      <picture>
        <source srcset="../imagens/voluntarios.svg" type="image/svg+xml">
        <source srcset="../imagens/voluntarios-otimizado.webp" type="image/webp">
        <img src="../imagens/voluntarios.png" alt="Ilustração de um grupo de voluntários da ONG distribuindo cestas básicas em uma comunidade" class="imagem-apresentacao" width="480" height="300">
      </picture>
      <a href="#/cadastro" class="botao-cta">Quero ajudar</a>
    </section>

    <section id="missao">
      <h2>Nossa Missão</h2>
      <p>Promover dignidade, autonomia e oportunidades reais de transformação social para crianças, jovens e famílias em situação de risco, por meio de ações contínuas de educação, saúde e assistência comunitária.</p>
    </section>

    <section id="valores">
      <h2>Nossos Valores</h2>
      <ul>
        <li>Transparência na gestão de recursos e doações</li>
        <li>Respeito à dignidade de cada pessoa atendida</li>
        <li>Compromisso com impacto social mensurável</li>
        <li>Valorização do trabalho voluntário</li>
      </ul>
    </section>

    <section id="contato">
      <h2>Fale Conosco</h2>
      <address>
        <p>E-mail: <a href="mailto:contato@maosqueajudam.org.br">contato@maosqueajudam.org.br</a></p>
        <p>Telefone: <a href="tel:+551199999999">(11) 99999-9999</a></p>
        <p>Endereço: Rua da Solidariedade, 123 — São Paulo, SP</p>
      </address>
    </section>
  `;
}

/* Dados de origem dos cartões de projeto. Em vez de marcação HTML
   repetida à mão, cada frente de atuação é um objeto de dados; os
   cartões são gerados dinamicamente a partir deles (ver
   renderizarCartaoProjeto/renderizarGradeProjetos), então incluir,
   remover ou reordenar uma frente é só editar este array — nenhuma
   marcação precisa ser tocada. */
const DADOS_VOLUNTARIADO = [
  {
    badge: "primaria",
    rotulo: "Vagas abertas",
    titulo: "Apoio Educacional",
    descricao: "Auxílio em reforço escolar e alfabetização para crianças e adolescentes atendidos pela ONG, duas vezes por semana.",
    itens: [
      "Disponibilidade mínima de 2 horas semanais",
      "Maior de 18 anos",
      "Não é necessária formação em educação",
    ],
  },
  {
    badge: "secundaria",
    rotulo: "Aos sábados",
    titulo: "Distribuição de Alimentos",
    descricao: "Organização e entrega de cestas básicas às famílias cadastradas em comunidades atendidas pela ONG.",
    itens: [
      "Atividade realizada aos sábados",
      "Trabalho em equipe",
      "Treinamento oferecido pela ONG",
    ],
  },
  {
    badge: "neutro",
    rotulo: "Pontual",
    titulo: "Eventos e Campanhas",
    descricao: "Apoio na organização de eventos beneficentes e campanhas de arrecadação ao longo do ano.",
    itens: [
      "Participação pontual ou recorrente",
      "Ideal para quem tem pouca disponibilidade fixa",
    ],
  },
];

const DADOS_DOACAO = [
  {
    badge: "primaria",
    rotulo: "Flexível",
    titulo: "Doação Única",
    descricao: "Contribua uma única vez com o valor que puder. Cada real arrecadado é revertido diretamente em ações sociais.",
    itens: [],
  },
  {
    badge: "secundaria",
    rotulo: "Mensal",
    titulo: "Doação Recorrente",
    descricao: "Torne-se um doador mensal e ajude a garantir a continuidade dos projetos ao longo de todo o ano.",
    itens: [],
  },
  {
    badge: "neutro",
    rotulo: "Sazonal",
    titulo: "Campanhas Específicas",
    descricao: "Apoie campanhas sazonais, como a arrecadação de agasalhos no inverno ou material escolar no início do ano letivo.",
    itens: [],
  },
];

/* Converte UM objeto de dados em uma string HTML (um cartão). */
function renderizarCartaoProjeto(dados, textoCta) {
  const itensHtml = dados.itens.length
    ? "<ul>" + dados.itens.map(function (item) {
        return "<li>" + item + "</li>";
      }).join("") + "</ul>"
    : "";

  return `
        <article class="col-4">
          <span class="badge badge-${dados.badge}">${dados.rotulo}</span>
          <h3>${dados.titulo}</h3>
          <p>${dados.descricao}</p>
          ${itensHtml}
          <a href="#/cadastro" class="botao-cta">${textoCta}</a>
        </article>`;
}

/* Itera (map) sobre a lista de dados e concatena (join) o HTML de
   cada cartão gerado, produzindo a grade completa de uma seção. */
function renderizarGradeProjetos(lista, textoCta) {
  return lista.map(function (dados) {
    return renderizarCartaoProjeto(dados, textoCta);
  }).join("");
}

function templateProjetos() {
  return `
    <section id="apresentacao" class="secao-destaque">
      <h1>Nossas Frentes de Atuação</h1>
      <p>Você pode transformar vidas de duas formas: dedicando seu tempo como voluntário ou contribuindo financeiramente com nossas campanhas. Conheça abaixo como cada uma funciona.</p>
    </section>

    <section id="voluntariado">
      <h2>Seja Voluntário</h2>

      <div class="grid grid-cards">
        ${renderizarGradeProjetos(DADOS_VOLUNTARIADO, "Quero ser voluntário")}
      </div>
    </section>

    <section id="doacao">
      <h2>Como Doar</h2>

      <div class="grid grid-cards">
        ${renderizarGradeProjetos(DADOS_DOACAO, "Quero doar")}
      </div>
    </section>
  `;
}

/* Converte o histórico salvo (obterCadastrosSalvos(), em
   armazenamento.js) no HTML da lista + botão de limpar. Fica fora
   de templateCadastro() para poder ser chamada de novo, sozinha,
   quando só a lista precisa ser atualizada (ver
   atualizarHistoricoNaTela, chamada após cada envio). */
function renderizarSecaoHistorico() {
  const historico = obterCadastrosSalvos();

  if (!historico.length) {
    return `<p class="historico-vazio">Nenhum cadastro salvo neste navegador ainda.</p>`;
  }

  const itensHtml = historico.map(function (cadastro) {
    const interesses = cadastro.interesses && cadastro.interesses.length
      ? cadastro.interesses.join(", ")
      : "não informado";
    return `
      <li>
        <strong>${cadastro.nome}</strong> — ${cadastro.cidade}/${cadastro.estado}
        <br><span class="historico-data">Interesse: ${interesses} · enviado em ${cadastro.enviadoEm}</span>
      </li>`;
  }).join("");

  return `
    <ul class="historico-lista">${itensHtml}</ul>
    <button type="button" id="limpar-historico" class="botao-cta botao-secundario">Limpar histórico</button>`;
}

/* Religa o clique do botão "Limpar histórico" — precisa ser chamada
   de novo toda vez que o HTML do botão é recriado (innerHTML
   descarta qualquer listener anexado ao nó antigo). */
function vincularBotaoLimparHistorico() {
  const botao = document.getElementById("limpar-historico");
  if (!botao) return;
  botao.addEventListener("click", function () {
    limparCadastrosSalvos();
    atualizarHistoricoNaTela();
  });
}

/* Regera só o conteúdo de #historico-cadastros (sem tocar no resto
   do formulário) e religa o botão. Usada tanto na inicialização da
   view de cadastro quanto logo após um envio bem-sucedido. */
function atualizarHistoricoNaTela() {
  const container = document.getElementById("historico-cadastros");
  if (!container) return;
  container.innerHTML = renderizarSecaoHistorico();
  vincularBotaoLimparHistorico();
}

function templateCadastro() {
  return `
    <section id="formulario-cadastro" class="secao-destaque">
      <h1>Cadastre-se como Voluntário</h1>

      <div class="alerta alerta-info" role="note">
        <span class="alerta-icone" aria-hidden="true">&#9432;</span>
        <span>Preencha o formulário abaixo com seus dados. Campos marcados com <strong>*</strong> são obrigatórios.</span>
      </div>

      <div id="area-feedback" aria-live="polite"></div>

      <form id="form-cadastro" action="/processar-cadastro" method="post" novalidate>

        <fieldset>
          <legend>Dados Pessoais</legend>

          <div class="campo">
            <label for="nome">Nome completo *</label>
            <input
              type="text"
              id="nome"
              name="nome"
              pattern="[A-Za-zÀ-ÿ\\s]{3,100}"
              minlength="3"
              maxlength="100"
              placeholder="Digite seu nome completo"
              required>
            <small>Apenas letras e espaços, mínimo de 3 caracteres.</small>
          </div>

          <div class="campo">
            <label for="email">E-mail *</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="seuemail@exemplo.com"
              required>
          </div>

          <div class="campo">
            <label for="data-nascimento">Data de nascimento *</label>
            <input
              type="date"
              id="data-nascimento"
              name="data-nascimento"
              max="2025-12-31"
              required>
          </div>

          <div class="campo">
            <label for="cpf">CPF *</label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              inputmode="numeric"
              pattern="\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}"
              maxlength="14"
              placeholder="000.000.000-00"
              required>
            <small>Formato: 000.000.000-00</small>
          </div>

          <div class="campo">
            <label for="telefone">Telefone *</label>
            <input
              type="tel"
              id="telefone"
              name="telefone"
              inputmode="numeric"
              pattern="\\(\\d{2}\\)\\s\\d{4,5}-\\d{4}"
              maxlength="15"
              placeholder="(00) 00000-0000"
              required>
            <small>Formato: (00) 00000-0000</small>
          </div>
        </fieldset>

        <fieldset>
          <legend>Endereço</legend>

          <div class="grid campo-grid">
            <div class="campo col-4">
              <label for="cep">CEP *</label>
              <input
                type="text"
                id="cep"
                name="cep"
                inputmode="numeric"
                pattern="\\d{5}-\\d{3}"
                maxlength="9"
                placeholder="00000-000"
                required>
              <small>Formato: 00000-000</small>
            </div>

            <div class="campo col-8">
              <label for="endereco">Endereço *</label>
              <input
                type="text"
                id="endereco"
                name="endereco"
                maxlength="150"
                placeholder="Rua, número, complemento"
                required>
            </div>
          </div>

          <div class="grid campo-grid">
            <div class="campo col-6">
              <label for="cidade">Cidade *</label>
              <input
                type="text"
                id="cidade"
                name="cidade"
                maxlength="80"
                placeholder="Sua cidade"
                required>
            </div>

            <div class="campo col-6">
              <label for="estado">Estado *</label>
              <select id="estado" name="estado" required>
              <option value="" selected disabled>Selecione...</option>
              <option value="AC">Acre</option>
              <option value="AL">Alagoas</option>
              <option value="AP">Amapá</option>
              <option value="AM">Amazonas</option>
              <option value="BA">Bahia</option>
              <option value="CE">Ceará</option>
              <option value="DF">Distrito Federal</option>
              <option value="ES">Espírito Santo</option>
              <option value="GO">Goiás</option>
              <option value="MA">Maranhão</option>
              <option value="MT">Mato Grosso</option>
              <option value="MS">Mato Grosso do Sul</option>
              <option value="MG">Minas Gerais</option>
              <option value="PA">Pará</option>
              <option value="PB">Paraíba</option>
              <option value="PR">Paraná</option>
              <option value="PE">Pernambuco</option>
              <option value="PI">Piauí</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="RN">Rio Grande do Norte</option>
              <option value="RS">Rio Grande do Sul</option>
              <option value="RO">Rondônia</option>
              <option value="RR">Roraima</option>
              <option value="SC">Santa Catarina</option>
              <option value="SP">São Paulo</option>
              <option value="SE">Sergipe</option>
              <option value="TO">Tocantins</option>
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Interesse</legend>

          <div class="campo campo-checkbox">
            <input type="checkbox" id="interesse-voluntario" name="interesse" value="voluntario">
            <label for="interesse-voluntario">Quero ser voluntário</label>
          </div>

          <div class="campo campo-checkbox">
            <input type="checkbox" id="interesse-doador" name="interesse" value="doador">
            <label for="interesse-doador">Quero ser doador recorrente</label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Confirmação</legend>

          <div class="campo campo-checkbox">
            <input type="checkbox" id="termos" name="termos" required>
            <label for="termos">Li e aceito os termos de uso e a política de privacidade *</label>
          </div>

          <button type="submit">Enviar cadastro</button>
        </fieldset>

      </form>
    </section>

    <section id="historico-wrapper" class="secao-destaque">
      <h2>Cadastros salvos neste navegador</h2>
      <p class="texto-auxiliar">Estes dados ficam salvos apenas no localStorage deste navegador (não são enviados a nenhum servidor) e são restaurados automaticamente sempre que esta página é carregada.</p>
      <div id="historico-cadastros" aria-live="polite">${renderizarSecaoHistorico()}</div>
    </section>
  `;
}

/* Escuta o evento disparado por feedback.js após um envio bem-sucedido
   e atualiza só a lista de histórico na tela — este é o lado "de
   escuta" do desacoplamento entre os dois módulos: templates.js não
   precisa ser importado por feedback.js para reagir a ele. Registrado
   uma única vez, quando este módulo é carregado (módulos ES6 são
   avaliados uma única vez e reaproveitados, mesmo que "importados"
   por mais de um arquivo). */
document.addEventListener("cadastro:salvo", atualizarHistoricoNaTela);

/* Tabela de rotas: cada entrada mapeia um segmento de hash (#/<chave>)
   para o título de página, a função de template e, quando a view tem
   comportamento interativo próprio, uma função init() chamada pelo
   roteador logo após o HTML ser injetado no DOM. */
export const ROTAS = {
  inicio: {
    titulo: "Mãos que Ajudam | Início",
    template: templateInicio,
  },
  projetos: {
    titulo: "Mãos que Ajudam | Projetos",
    template: templateProjetos,
  },
  cadastro: {
    titulo: "Mãos que Ajudam | Cadastre-se",
    template: templateCadastro,
    init: function () {
      inicializarMascaras();
      inicializarFeedback();
      /* A lista do histórico já vem pronta no HTML retornado por
         templateCadastro() (chama renderizarSecaoHistorico() na
         primeira renderização); aqui só religamos o botão "Limpar
         histórico", já que innerHTML não preserva listeners. */
      vincularBotaoLimparHistorico();
    },
  },
};
