const startbtn = document.getElementById("start-btn")
startbtn.addEventListener("click",() => {
    const userTask= document.getElementById("task-input").value
    // Salva na "memória" do navegador
    localStorage.setItem("tarefaSalva", userTask);
    document.getElementById("task-input").value=null
    window.location.href="pomodoro.html"
});