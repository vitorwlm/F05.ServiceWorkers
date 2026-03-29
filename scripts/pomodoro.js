document.addEventListener('DOMContentLoaded', () => {
    // Declaração de constantes usando 'const' para elementos do DOM.
    // 'document.getElementById()' é usado para selecionar elementos pelo seu ID.
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const pomodoroDurationInput = document.getElementById('pomodoro-duration');
    const breakDurationInput = document.getElementById('break-duration');
    const statusMessage = document.getElementById('status-message');
    const sessionList = document.getElementById('session-list');

    // Declaração de variáveis usando 'let' para valores que mudarão.
    let pomodoroDuration = 25 * 60;
    let breakDuration = 5 * 60;
    let currentTimer = pomodoroDuration;
    let isPaused = true;
    let isWorking = true;
    let intervalId = null;
    // Um array vazio '[]' para armazenar objetos.
    let sessionHistory = [];

    // Criação de um novo objeto 'Audio' usando o construtor 'new'.
    const notificationSound = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-01.mp3'); 

    // Declaração de uma função.
    function updateDisplay() {
        // 'Math.floor()' arredonda um número para baixo.
        const minutes = Math.floor(currentTimer / 60);
        const seconds = currentTimer % 60;
        // '.textContent' define o conteúdo de texto de um elemento.
        // 'String()' converte um número para string.
        // '.padStart(2, '0')' adiciona '0' à esquerda até ter 2 dígitos.
        minutesDisplay.textContent = String(minutes).padStart(2, '0');
        secondsDisplay.textContent = String(seconds).padStart(2, '0');
    }

    function startTimer() {
        // '!' é o operador lógico NOT. '&&' é o operador lógico AND.
        if (!isPaused && intervalId) { // Verifica se NÃO está pausado E se já existe um intervalo.
            return; // 'return' sai da função.
        }

        isPaused = false; // Atribuição de valor booleano.
        // '.disabled' é uma propriedade booleana de elementos de formulário.
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        resetBtn.disabled = false;

        // 'setInterval()' executa uma função repetidamente a cada X milissegundos.
        // '() => { ... }' é a sintaxe de uma função de seta (arrow function).
        intervalId = setInterval(() => { // A função de seta é a callback.
            currentTimer--; // Operador de decremento.
            updateDisplay();

            if (currentTimer <= 0) { // Condição para verificar se o tempo acabou.
                // 'clearInterval()' para a execução de um 'setInterval'.
                clearInterval(intervalId);
                // '.play()' é um método para reproduzir áudio.
                notificationSound.play();

                if (isWorking) {
                    addSessionToHistory();
                    switchMode(false);
                } else {
                    switchMode(true);
                }
                startTimer();
            }
        }, 1000); // 1000 milissegundos = 1 segundo.
    }

    function pauseTimer() {
        clearInterval(intervalId);
        isPaused = true;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }

    function resetTimer() {
        clearInterval(intervalId);
        isPaused = true;
        // O operador ternário 'condição ? valorSeVerdadeiro : valorSeFalso'.
        currentTimer = isWorking ? pomodoroDuration : breakDuration;
        updateDisplay();
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }

    function switchMode(toWork) {
        isWorking = toWork;
        statusMessage.textContent = isWorking ? 'Sessão de Trabalho' : 'Sessão de Descanso';
        currentTimer = isWorking ? pomodoroDuration : breakDuration;
        updateDisplay();
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        resetBtn.disabled = false;
    }

    function loadSettings() {
        // 'localStorage.getItem()' recupera um valor armazenado.
        const savedPomodoro = localStorage.getItem('pomodoroDuration');
        const savedBreak = localStorage.getItem('breakDuration');

        if (savedPomodoro) {
            // 'parseInt(string, radix)' converte uma string para um número inteiro.
            // '10' é a base decimal.
            pomodoroDuration = parseInt(savedPomodoro, 10) * 60;
            pomodoroDurationInput.value = parseInt(savedPomodoro, 10);
        }
        if (savedBreak) {
            breakDuration = parseInt(savedBreak, 10) * 60;
            breakDurationInput.value = parseInt(savedBreak, 10);
        }
        currentTimer = pomodoroDuration;
    }

    function saveSettings() {
        // 'localStorage.setItem()' armazena um par chave-valor.
        localStorage.setItem('pomodoroDuration', pomodoroDurationInput.value);
        localStorage.setItem('breakDuration', breakDurationInput.value);
    }

    function addSessionToHistory() {
        // 'new Date()' cria um novo objeto de data e hora.
        const now = new Date();
        // Criação de um objeto literal { chave: valor }.
        const session = {
            // '.toLocaleDateString()' e '.toLocaleTimeString()' formatam datas e horas.
            date: now.toLocaleDateString('pt-PT'),
            time: now.toLocaleTimeString('pt-PT'),
            duration: pomodoroDuration / 60
        };
        // '.push()' adiciona um elemento ao final de um array.
        sessionHistory.push(session);
        // 'JSON.stringify()' converte um objeto JavaScript para uma string JSON.
        localStorage.setItem('pomodoroHistory', JSON.stringify(sessionHistory));
        displayHistory();
    }

    function loadHistory() {
        const savedHistory = localStorage.getItem('pomodoroHistory');
        if (savedHistory) {
            // 'JSON.parse()' converte uma string JSON de volta para um objeto JavaScript.
            sessionHistory = JSON.parse(savedHistory);
        }
        displayHistory();
    }

    function displayHistory() {
        // '.innerHTML' define o conteúdo HTML de um elemento.
        if (sessionHistory.length === 0) {
            // 'document.createElement()' cria um novo elemento HTML.
            const li = document.createElement('li');
            li.textContent = 'Nenhuma sessão concluída ainda.';
            // '.appendChild()' adiciona um nó como último filho de um elemento.
            sessionList.appendChild(li);
            return;
        }
        // '.forEach()' itera sobre cada elemento de um array.
        // 'session' e 'index' são parâmetros da função de seta.
        sessionHistory.forEach((session, index) => {
            const li = document.createElement('li');
            // Template literals (strings com crase ``) permitem incorporar expressões com '${}'.
            li.innerHTML = `<span>${index + 1}.</span> ${session.date} às ${session.time} (${session.duration} min)`;
            sessionList.appendChild(li);
        });
    }

    // '.addEventListener()' anexa uma função a ser chamada quando um evento ocorre.
    // 'startTimer' é passado como referência de função (sem parênteses).
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);

    // Uma função de seta é usada como callback para o evento 'change'.
    pomodoroDurationInput.addEventListener('change', () => {
        const newDuration = parseInt(pomodoroDurationInput.value, 10);
        if (newDuration > 0) {
            pomodoroDuration = newDuration * 60;
            saveSettings();
            if (isWorking && isPaused) {
                currentTimer = pomodoroDuration;
                updateDisplay();
            } else if (isWorking && !isPaused) {
                resetTimer();
                startTimer();
            }
        } else {
            pomodoroDurationInput.value = pomodoroDuration / 60; // Reverte para o valor válido anterior
        }
    });

    breakDurationInput.addEventListener('change', () => {
        const newDuration = parseInt(breakDurationInput.value, 10);
        if (newDuration > 0) {
            breakDuration = newDuration * 60;
            saveSettings();
            if (!isWorking && isPaused) {
                currentTimer = breakDuration;
                updateDisplay();
            } else if (!isWorking && !isPaused) {
                resetTimer();
                startTimer();
            }
        } else {
            breakDurationInput.value = breakDuration / 60; // Reverte para o valor válido anterior
        }
    });

    loadSettings();
    loadHistory();
    updateDisplay();
});