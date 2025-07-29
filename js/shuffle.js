let allFlashcards = [...flashcards];
let flashcardsSubset = [];
let current = 0;

const cardElement = document.querySelector('.card');
const frontEl = document.getElementById('card-front');
const backEl = document.getElementById('card-back');
const progressEl = document.getElementById('progress');
const countInput = document.getElementById('count-input');
const setCountBtn = document.getElementById('set-count');
const starBtn = document.getElementById('star-btn');

const STORAGE_STAR = 'flashcard-stars';
let stars = {};

function loadStars() {
    const starData = localStorage.getItem(STORAGE_STAR);
    if (starData) {
        try {
            stars = JSON.parse(starData);
        } catch {
            stars = {};
        }
    }
}

function saveStars() {
    localStorage.setItem(STORAGE_STAR, JSON.stringify(stars));
}

function updateStarBtn() {
    if (flashcardsSubset.length === 0) {
        starBtn.style.display = 'none';
        return;
    }
    starBtn.style.display = 'block';
    const currentWord = flashcardsSubset[current].word;
    if (stars[currentWord]) {
        starBtn.classList.add('active');
        starBtn.textContent = '★';
    } else {
        starBtn.classList.remove('active');
        starBtn.textContent = '☆';
    }
}

starBtn.onclick = function (e) {
    e.stopPropagation();
    if (flashcardsSubset.length === 0) return;
    const currentWord = flashcardsSubset[current].word;
    if (stars[currentWord]) {
        delete stars[currentWord];
    } else {
        stars[currentWord] = true;
    }
    saveStars();
    updateStarBtn();
};

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function renderCard(index) {
    if (index < 0 || index >= flashcardsSubset.length) {
        frontEl.innerText = "🎉 Completed!";
        backEl.innerText = "All vocabulary words reviewed!";
        progressEl.innerText = `${flashcardsSubset.length} / ${flashcardsSubset.length}`;
        starBtn.style.display = 'none';
        return;
    }
    const card = flashcardsSubset[index];
    frontEl.innerText = card.word;
    backEl.innerText = card.definition;
    progressEl.innerText = `${index + 1} / ${flashcardsSubset.length}`;
    updateStarBtn();
}

function showNext() {
    if (current < flashcardsSubset.length - 1) {
        current++;
        cardElement.classList.remove('flipped');
        renderCard(current);
    } else {
        current = flashcardsSubset.length;
        renderCard(current);
    }
}

function showPrevious() {
    if (current > 0) {
        current--;
        cardElement.classList.remove('flipped');
        renderCard(current);
    }
}

function toggleCard() {
    cardElement.classList.toggle('flipped');
}

function startQuiz(count) {
    count = Math.min(count, allFlashcards.length);
    flashcardsSubset = [...allFlashcards];
    shuffle(flashcardsSubset);
    flashcardsSubset = flashcardsSubset.slice(0, count);
    current = 0;
    cardElement.classList.remove('flipped');
    renderCard(current);
}

setCountBtn.onclick = () => {
    const val = parseInt(countInput.value);
    if (isNaN(val) || val < 1 || val > 6480) {
        alert("Input must be a valid positive integer(1-6480).");
        return;
    }
    startQuiz(val);
};

window.onload = () => {
    loadStars();
    progressEl.innerText = `0 / 0`;
    starBtn.style.display = 'none';
};
