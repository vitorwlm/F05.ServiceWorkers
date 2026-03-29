const startBtn = document.getElementById("start-btn");
const taskInput = document.getElementById("task-input");

if (startBtn && taskInput) {
    startBtn.addEventListener("click", () => {
        const userTask = taskInput.value.trim();
        localStorage.setItem("TaskSaved", userTask);
        window.location.href = "pomodoro.html";
    });
}

window.addEventListener("load", () => {
    // Verifica se a página atual é 'pomodoro.html' antes de tentar exibir a tarefa.
    // Isso impede que o título da tarefa apareça na página 'index.html'.
    if (window.location.pathname.includes('pomodoro.html')) {
        const task = localStorage.getItem("TaskSaved");
        if (!task) return;

        // Encontra o H1 existente dentro do container principal em pomodoro.html
        // e atualiza o seu conteúdo de texto com o nome da tarefa.
        const pomodoroTitleElement = document.querySelector('.container h1');
        if (pomodoroTitleElement) {
            pomodoroTitleElement.textContent = task;
        }
        document.title = task; // Atualiza o título do documento para a página pomodoro
    }
});

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("sw.js").catch((error) => {
            console.error("[Service Worker] Registration failed:", error);
        });
    });
}