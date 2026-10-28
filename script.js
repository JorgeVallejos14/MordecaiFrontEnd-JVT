const themeToggle = document.querySelector("#theme-toggle");
const quoteButton = document.querySelector("#quote-button");
const quoteMessage = document.querySelector("#quote-message");
const selectedCharacter = document.querySelector("#selected-character");
const characterButtons = document.querySelectorAll(".character-button");
const galleryItems = document.querySelectorAll(".gallery-item");
const galleryModal = document.querySelector("#gallery-modal");
const modalClose = document.querySelector("#modal-close");
const modalIcon = document.querySelector("#modal-icon");
const modalTitle = document.querySelector("#modal-title");
const modalDescription = document.querySelector("#modal-description");
const parkTime = document.querySelector("#park-time");
const parkDate = document.querySelector("#park-date");
const parkMessage = document.querySelector("#park-message");
const chileTimeZone = "America/Santiago";

const quotes = [
    "¡Esto se salió de control!",
    "Solamente terminemos el trabajo y podremos relajarnos.",
    "A veces, una tarea sencilla necesita un poco de trabajo en equipo.",
    "¡No podemos rendirnos ahora!"
];

const characters = {
    mordecai: {
        name: "Mordecai",
        description: "Un arrendajo azul creativo que siempre intenta hacer lo correcto."
    },
    rigby: {
        name: "Rigby",
        description: "El mejor amigo de Mordecai: impulsivo, divertido y experto en meterse en problemas."
    },
    benson: {
        name: "Benson",
        description: "El jefe del parque, estricto pero siempre pendiente de que el equipo cumpla su trabajo."
    }
};

const quizQuestions = [
    {
        question: "¿Cuál es el trabajo de Mordecai?",
        options: ["Cuidar el parque", "Ser músico profesional", "Vender videojuegos"],
        answer: "Cuidar el parque"
    },
    {
        question: "¿Quién es el mejor amigo de Mordecai?",
        options: ["Benson", "Rigby", "Skips"],
        answer: "Rigby"
    },
    {
        question: "¿Qué suele convertir un día normal en una aventura?",
        options: ["Una tarea sencilla", "Una clase de cocina", "Una visita al museo"],
        answer: "Una tarea sencilla"
    }
];

let currentQuestion = 0;
let score = 0;

function updateParkClock() {
    const now = new Date();
    const timeFormatter = new Intl.DateTimeFormat("es-CL", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: chileTimeZone
    });
    const dateFormatter = new Intl.DateTimeFormat("es-CL", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: chileTimeZone
    });
    const hourFormatter = new Intl.DateTimeFormat("es-CL", {
        hour: "numeric",
        hour12: false,
        timeZone: chileTimeZone
    });

    parkTime.textContent = timeFormatter.format(now);
    parkDate.textContent = dateFormatter.format(now);

    const hour = Number(hourFormatter.format(now));
    if (hour >= 6 && hour < 12) {
        parkMessage.textContent = "Buenos días. Es hora de comenzar las tareas del parque.";
    } else if (hour >= 12 && hour < 18) {
        parkMessage.textContent = "Buenas tardes. Perfecto momento para una nueva aventura.";
    } else if (hour >= 18 && hour < 22) {
        parkMessage.textContent = "Buenas noches. La jornada termina con música y amigos.";
    } else {
        parkMessage.textContent = "El parque está tranquilo. Mejor no despertar a Benson.";
    }
}

themeToggle.addEventListener("click", () => {
    const isNight = document.body.classList.toggle("night-mode");
    themeToggle.textContent = isNight ? "Modo día" : "Modo noche";
    themeToggle.setAttribute("aria-label", isNight ? "Activar modo día" : "Activar modo nocturno");
});

quoteButton.addEventListener("click", () => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteMessage.textContent = `"${randomQuote}"`;
});

characterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const character = characters[button.dataset.character];
        characterButtons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        selectedCharacter.innerHTML = `<h3>${character.name}</h3><p>${character.description}</p>`;
    });
});

galleryItems.forEach((item) => {
    item.tabIndex = 0;
    item.addEventListener("click", () => openGalleryModal(item));
    item.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openGalleryModal(item);
        }
    });
});

function openGalleryModal(item) {
    const caption = item.querySelector("figcaption").textContent;
    const image = item.querySelector("img");
    modalIcon.innerHTML = "";
    const modalImage = document.createElement("img");
    modalImage.src = image.src;
    modalImage.alt = image.alt;
    modalIcon.appendChild(modalImage);
    modalTitle.textContent = caption;
    modalDescription.textContent = image.alt + ". Un recuerdo especial de las aventuras de Mordecai en el parque.";
    galleryModal.hidden = false;
    modalClose.focus();
}

function closeGalleryModal() {
    galleryModal.hidden = true;
}

modalClose.addEventListener("click", closeGalleryModal);
galleryModal.addEventListener("click", (event) => {
    if (event.target === galleryModal) {
        closeGalleryModal();
    }
});
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !galleryModal.hidden) {
        closeGalleryModal();
    }
});

function renderQuestion() {
    const question = quizQuestions[currentQuestion];
    document.querySelector("#quiz-progress").textContent =
        `Pregunta ${currentQuestion + 1} de ${quizQuestions.length}`;
    document.querySelector("#quiz-question").textContent = question.question;
    document.querySelector("#quiz-feedback").textContent = "";
    document.querySelector("#next-question").disabled = true;

    const optionsContainer = document.querySelector("#quiz-options");
    optionsContainer.innerHTML = "";
    question.options.forEach((option) => {
        const optionButton = document.createElement("button");
        optionButton.className = "quiz-option";
        optionButton.textContent = option;
        optionButton.type = "button";
        optionButton.addEventListener("click", () => selectAnswer(optionButton, option));
        optionsContainer.appendChild(optionButton);
    });
}

function selectAnswer(selectedButton, selectedAnswer) {
    const question = quizQuestions[currentQuestion];
    const options = document.querySelectorAll(".quiz-option");
    options.forEach((option) => {
        option.disabled = true;
        if (option.textContent === question.answer) {
            option.classList.add("correct");
        }
    });

    const feedback = document.querySelector("#quiz-feedback");
    if (selectedAnswer === question.answer) {
        score += 1;
        selectedButton.classList.add("correct");
        feedback.textContent = "¡Correcto! Mordecai estaría orgulloso.";
    } else {
        selectedButton.classList.add("incorrect");
        feedback.textContent = `No era esa. La respuesta era: ${question.answer}.`;
    }
    document.querySelector("#next-question").disabled = false;
}

document.querySelector("#next-question").addEventListener("click", () => {
    currentQuestion += 1;
    if (currentQuestion < quizQuestions.length) {
        renderQuestion();
        return;
    }

    document.querySelector("#quiz-progress").textContent = "Trivia completada";
    document.querySelector("#quiz-question").textContent =
        `Obtuviste ${score} de ${quizQuestions.length} respuestas correctas.`;
    document.querySelector("#quiz-options").innerHTML = "";
    document.querySelector("#quiz-feedback").textContent =
        score === quizQuestions.length ? "¡Eres un experto del parque!" : "¡Buen trabajo! Puedes intentarlo otra vez.";
    const nextButton = document.querySelector("#next-question");
    nextButton.textContent = "Jugar de nuevo";
    nextButton.disabled = false;
    nextButton.onclick = () => {
        currentQuestion = 0;
        score = 0;
        nextButton.textContent = "Siguiente pregunta";
        nextButton.onclick = null;
        renderQuestion();
    };
});

renderQuestion();
updateParkClock();
setInterval(updateParkClock, 1000);