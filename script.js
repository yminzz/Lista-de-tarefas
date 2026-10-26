// Seleciona os elementos da página que vamos usar.
const formulario = document.querySelector("#form-tarefa");
const campoTarefa = document.querySelector("#campo-tarefa");
const listaTarefas = document.querySelector("#lista-tarefas");
const contador = document.querySelector("#contador");
const botaoLimpar = document.querySelector("#limpar-concluidas");

// Carrega as tarefas salvas no navegador.
// Se ainda não houver tarefas salvas, começa com uma lista vazia.
let tarefas = JSON.parse(localStorage.getItem("minhas-tarefas")) || [];

// Salva a lista atual no navegador.
function salvarTarefas() {
  localStorage.setItem("minhas-tarefas", JSON.stringify(tarefas));
}

// Atualiza o texto que informa quantas tarefas estão pendentes.
function atualizarContador() {
  const pendentes = tarefas.filter(function (tarefa) {
    return !tarefa.concluida;
  }).length;

  if (tarefas.length === 0) {
    contador.textContent = "Você ainda não tem tarefas.";
  } else if (pendentes === 0) {
    contador.textContent = "Parabéns! Você concluiu todas as tarefas.";
  } else {
    contador.textContent = `Você tem ${pendentes} tarefa(s) pendente(s).`;
  }
}

// Mostra as tarefas na tela.
function mostrarTarefas() {
  listaTarefas.replaceChildren();

  tarefas.forEach(function (tarefa) {
    const item = document.createElement("li");
    item.className = "item-tarefa";

    if (tarefa.concluida) {
      item.classList.add("concluida");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = tarefa.concluida;
    checkbox.setAttribute("aria-label", `Concluir ${tarefa.texto}`);

    checkbox.addEventListener("change", function () {
      tarefa.concluida = checkbox.checked;
      salvarTarefas();
      mostrarTarefas();
    });

    const texto = document.createElement("span");
    texto.textContent = tarefa.texto;

    const botaoExcluir = document.createElement("button");
    botaoExcluir.type = "button";
    botaoExcluir.className = "botao-excluir";
    botaoExcluir.textContent = "Excluir";
    botaoExcluir.setAttribute("aria-label", `Excluir ${tarefa.texto}`);

    botaoExcluir.addEventListener("click", function () {
      tarefas = tarefas.filter(function (itemAtual) {
        return itemAtual.id !== tarefa.id;
      });

      salvarTarefas();
      mostrarTarefas();
    });

    item.append(checkbox, texto, botaoExcluir);
    listaTarefas.appendChild(item);
  });

  atualizarContador();
}

// Quando o formulário for enviado, adiciona uma nova tarefa.
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const texto = campoTarefa.value.trim();

  if (texto === "") {
    return;
  }

  const novaTarefa = {
    id: Date.now(),
    texto: texto,
    concluida: false
  };

  tarefas.push(novaTarefa);
  salvarTarefas();
  mostrarTarefas();

  campoTarefa.value = "";
  campoTarefa.focus();
});

// Remove todas as tarefas que já foram concluídas.
botaoLimpar.addEventListener("click", function () {
  tarefas = tarefas.filter(function (tarefa) {
    return !tarefa.concluida;
  });

  salvarTarefas();
  mostrarTarefas();
});

// Mostra as tarefas salvas quando a página abre.
mostrarTarefas();
