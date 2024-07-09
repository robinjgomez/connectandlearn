let words = [];
let currentWords = [];
let currentWordIndex = 0;
let score = 0;
// Ajustar esta constante para definir las rondas por caja juego
const questionsPerRound = 10;

document.getElementById('start-button').addEventListener('click', startGame);
document.getElementById('check-button').addEventListener('click', checkAnswer);
document.getElementById('next-button').addEventListener('click', nextWord);
document.getElementById('play-again-button').addEventListener('click', () => location.reload());

/**
 * Inicia el juego, oculta la pantalla de inicio, carga las palabras y selecciona las palabras aleatoriamente para la ronda.
 */
function startGame() {
    score = 0;
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    loadWords().then(() => {
        selectRandomWords();
        loadWord();
    });
}

/**
 * Carga las palabras desde un archivo JSON.
 */
async function loadWords() {
    const response = await fetch('words.json');
    words = await response.json();
}

/**
 * Selecciona palabras aleatoriamente para la ronda actual.
 */
function selectRandomWords() {
    currentWords = [];
    const usedIndices = new Set();
    while (currentWords.length < questionsPerRound) {
        const randomIndex = Math.floor(Math.random() * words.length);
        if (!usedIndices.has(randomIndex)) {
            usedIndices.add(randomIndex);
            currentWords.push(words[randomIndex]);
        }
    }
    currentWordIndex = 0;
}

/**
 * Baraja las opciones de respuesta para una palabra.
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * Carga la palabra actual y sus opciones de respuesta en la interfaz.
 */
function loadWord() {
    document.getElementById('feedback').classList.add('hidden');
    document.getElementById('next-button').classList.add('hidden');
    document.getElementById('example-sentence').classList.add('hidden');
    document.getElementById('explanation').classList.add('hidden');
    const wordData = currentWords[currentWordIndex];
    document.getElementById('word').textContent = wordData.word;
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';

    // Baraja las opciones antes de mostrarlas
    const shuffledOptions = [...wordData.options];
    shuffleArray(shuffledOptions);

    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.addEventListener('click', () => selectOption(button));
        optionsDiv.appendChild(button);
    });
    document.getElementById('check-button').classList.remove('hidden');
}

/**
 * Marca una opción como seleccionada.
 */
function selectOption(selectedButton) {
    document.querySelectorAll('#options button').forEach(button => {
        button.classList.remove('selected');
    });
    selectedButton.classList.add('selected');
}

/**
 * Verifica la respuesta seleccionada y muestra la retroalimentación, la oración de ejemplo y la explicación.
 */
function checkAnswer() {
    const selectedButton = document.querySelector('#options button.selected');
    if (!selectedButton) return;
    const selectedOption = selectedButton.textContent;
    const wordData = currentWords[currentWordIndex];
    if (selectedOption === wordData.answer) {
        selectedButton.classList.add('correct');
        document.getElementById('feedback').textContent = "Correct!";
        score++;
    } else {
        selectedButton.classList.add('incorrect');
        document.getElementById('feedback').textContent = `Wrong! The correct answer is "${wordData.answer}".`;
    }

    // Muestra la oración de ejemplo y la explicación
    document.getElementById('example-sentence').textContent = `Example sentence: ${wordData.example_sentence}`;
    document.getElementById('explanation').textContent = `Explanation: ${wordData.explanation}`;

    document.getElementById('feedback').classList.remove('hidden');
    document.getElementById('example-sentence').classList.remove('hidden');
    document.getElementById('explanation').classList.remove('hidden');
    document.getElementById('check-button').classList.add('hidden');

    if (currentWordIndex >= currentWords.length - 1) {
        document.getElementById('next-button').textContent = 'Finish';
    }
    document.getElementById('next-button').classList.remove('hidden');
}

/**
 * Carga la siguiente palabra o termina el juego si no hay más palabras.
 */
function nextWord() {
    if (currentWordIndex < currentWords.length - 1) {
        currentWordIndex++;
        loadWord();
    } else {
        endGame();
    }
}


/**
 * Termina el juego y muestra la pantalla de resultados con la puntuación obtenida.
 */
function endGame() {
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');
    document.getElementById('score').textContent = `You got ${score} out of ${currentWords.length} correct!`;
}
