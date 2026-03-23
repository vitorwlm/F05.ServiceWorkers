// scripts/dataHandle.js

// Lógica para a página index.html (captura do clique)
const startbtn = document.getElementById("start-btn");
if (startbtn) {
    startbtn.addEventListener("click", () => {
        const userTask = document.getElementById("task-input").value;
        // Salva na "memória" do navegador
        localStorage.setItem("tarefaSalva", userTask);
        window.location.href = "pomodoro.html";
    });
}

// Lógica para a página pomodoro.html (exibição do título)
window.addEventListener("load", () => {
    const tituloTarefa = document.getElementById("titulo-tarefa");
    if (tituloTarefa) {
        const tarefa = localStorage.getItem("tarefaSalva");
        if (tarefa) {
            tituloTarefa.innerText = "Tarefa atual: " + tarefa;
            const title=document.getElementById("titulo")
            title=tarefa.innerText
        } else {
            tituloTarefa.innerText = "Nenhuma tarefa definida";
        }
    }
});