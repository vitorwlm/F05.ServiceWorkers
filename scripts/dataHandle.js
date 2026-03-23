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
    const task = localStorage.getItem("TaskSaved");
    if (!task) return;
    const title = document.createElement("h1");
    title.textContent = task;
    document.body.prepend(title);
    document.title= task
});

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("sw.js").catch((error) => {
            console.error("[Service Worker] Registration failed:", error);
        });
    });
}