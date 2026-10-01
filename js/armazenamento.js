/* ==========================================================
   ONG Mãos que Ajudam — Persistência local (localStorage)
   Módulo ES6 sem nenhuma dependência de outro arquivo do projeto
   (é uma "folha" na árvore de importações): só sabe ler e escrever
   no localStorage. Guarda, no navegador do próprio usuário, um
   histórico dos cadastros enviados com sucesso pelo formulário.
   ========================================================== */

const CHAVE_CADASTROS = "maosQueAjudam.cadastros";

/* Lê a string salva, faz JSON.parse() e devolve um array (nunca
   deixa a aplicação quebrar se o valor estiver corrompido ou se o
   localStorage estiver indisponível, como em modo privado). */
export function obterCadastrosSalvos() {
  try {
    const bruto = localStorage.getItem(CHAVE_CADASTROS);
    const lista = bruto ? JSON.parse(bruto) : [];
    return Array.isArray(lista) ? lista : [];
  } catch (erro) {
    return [];
  }
}

/* Lê a lista atual, adiciona o novo cadastro (objeto) e regrava
   tudo com JSON.stringify() — o localStorage só aceita strings,
   por isso o array precisa ser serializado antes do setItem(). */
export function salvarCadastro(dados) {
  try {
    const lista = obterCadastrosSalvos();
    lista.push(dados);
    localStorage.setItem(CHAVE_CADASTROS, JSON.stringify(lista));
  } catch (erro) {
    /* Armazenamento indisponível (quota excedida, modo privado etc.):
       a aplicação segue funcionando normalmente, apenas sem persistir. */
  }
}

export function limparCadastrosSalvos() {
  try {
    localStorage.removeItem(CHAVE_CADASTROS);
  } catch (erro) {
    /* idem */
  }
}
