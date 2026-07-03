// =============================
// English Mock Test
// =============================

const questionContainer = document.getElementById("questionsContainer");
const timerElement = document.getElementById("timer");
const submitBtn = document.getElementById("submitBtn");
const themeBtn = document.getElementById("themeBtn");

const resultBox = document.getElementById("resultBox");
const scoreText = document.getElementById("scoreText");
const timeText = document.getElementById("timeText");
const errorMessage = document.getElementById("errorMessage");

let questions = [];

let seconds = 0;
let timer = null;

// -------------------------------
// Load Questions
// -------------------------------

async function loadQuestions() {

    try {

        const response = await fetch("questions.json");

        if (!response.ok) {
            throw new Error("questions.json not found.");
        }

        questions = await response.json();

        if (!Array.isArray(questions) || questions.length === 0) {
            throw new Error("Invalid JSON format.");
        }

        createQuestions();

        startTimer();

    }

    catch (error) {

        errorMessage.classList.remove("hidden");

        errorMessage.innerHTML = `
            <strong>Unable to load questions.</strong><br><br>
            Make sure:
            <ul>
                <li>questions.json exists</li>
                <li>The JSON is valid</li>
                <li>You are using a local server (Live Server, XAMPP etc.)</li>
            </ul>
        `;

        console.error(error);

    }

}

// -------------------------------
// Create Questions
// -------------------------------

function createQuestions() {

    questionContainer.innerHTML = "";

    questions.forEach((q, index) => {

        const card = document.createElement("div");

        card.className = "question";

        let html = `
            <h3>Q${index + 1}. ${q.question}</h3>
        `;

        q.options.forEach((option, i) => {

            html += `
                <label class="option">

                    <input
                        type="radio"
                        name="q${index}"
                        value="${i}"
                    >

                    ${option}

                </label>
            `;

        });

        card.innerHTML = html;

        questionContainer.appendChild(card);

    });

}

// -------------------------------
// Timer
// -------------------------------

function startTimer() {

    timer = setInterval(() => {

        seconds++;

        const min = String(Math.floor(seconds / 60)).padStart(2, "0");

        const sec = String(seconds % 60).padStart(2, "0");

        timerElement.textContent = `${min}:${sec}`;

    }, 1000);

}

// -------------------------------
// Dark Mode
// -------------------------------

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        themeBtn.innerHTML = "☀️ Light Mode";

    } else {

        themeBtn.innerHTML = "🌙 Dark Mode";

    }

});

// -------------------------------
// Submit
// -------------------------------

submitBtn.addEventListener("click", evaluateQuiz);

// -------------------------------
// Evaluation
// -------------------------------

function evaluateQuiz() {

    clearInterval(timer);

    let score = 0;

    questions.forEach((q, index) => {

        const radios = document.getElementsByName(`q${index}`);

        let selected = null;

        radios.forEach(radio => {

            if (radio.checked) {

                selected = Number(radio.value);

            }

        });

        radios.forEach(radio => {

            radio.disabled = true;

            const label = radio.parentElement;

            const value = Number(radio.value);

            // Correct answer

            if (value === q.answer) {

                label.classList.add("correct");

            }

            // Wrong selected answer

            if (radio.checked && value !== q.answer) {

                label.classList.add("wrong");

            }

        });

        if (selected === q.answer) {

            score++;

        }

    });

    submitBtn.disabled = true;

    const min = Math.floor(seconds / 60);

    const sec = seconds % 60;

    scoreText.innerHTML =
        `<strong>Score :</strong> ${score} / ${questions.length}`;

    timeText.innerHTML =
        `<strong>Time Taken :</strong> ${min} min ${sec} sec`;

    resultBox.classList.remove("hidden");

    resultBox.scrollIntoView({

        behavior: "smooth"

    });

}

// -------------------------------
// Start
// -------------------------------

loadQuestions();