const cardElement = document.querySelector('.card');
const frontEl = document.getElementById('card-front');
const backEl = document.getElementById('card-back');
const progressEl = document.getElementById('progress');
const starBtn = document.getElementById('star-btn');
const controls = document.querySelector('.controls');
const noStarsMsg = document.getElementById('no-stars-msg');

const STORAGE_STAR = 'flashcard-stars';

let allFlashcards = [...flashcards];
let starredWords = {};
let starredCards = [];
let current = 0;

function loadStars() {
    const starData = localStorage.getItem(STORAGE_STAR);
    if (starData) {
        try {
            starredWords = JSON.parse(starData);
        } catch {
            starredWords = {};
        }
    }
}

function saveStars() {
    localStorage.setItem(STORAGE_STAR, JSON.stringify(starredWords));
}

function updateStarBtn() {
    if (starredCards.length === 0) {
        starBtn.style.display = 'none';
        return;
    }
    starBtn.style.display = 'block';
    const currentWord = starredCards[current].word;
    if (starredWords[currentWord]) {
        starBtn.classList.add('active');
        starBtn.textContent = '★';
    } else {
        starBtn.classList.remove('active');
        starBtn.textContent = '☆';
    }
}

function renderCard(index) {
    if (index < 0 || index >= starredCards.length) {
        frontEl.innerText = "🎉 Completed!";
        backEl.innerText = "All vocabulary words reviewed!";
        progressEl.innerText = `${starredCards.length} / ${starredCards.length}`;
        starBtn.style.display = 'none';
        return;
    }
    const card = starredCards[index];
    frontEl.innerText = card.word;
    backEl.innerText = card.definition;
    progressEl.innerText = `${index + 1} / ${starredCards.length}`;
    updateStarBtn();
}

function showNext() {
    if (current < starredCards.length - 1) {
        current++;
        cardElement.classList.remove('flipped');
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

starBtn.onclick = function (e) {
    e.stopPropagation();
    const currentWord = starredCards[current].word;
    if (starredWords[currentWord]) {
        delete starredWords[currentWord];
    } else {
        starredWords[currentWord] = true;
    }
    saveStars();

    updateStarCards();

    if (starredCards.length === 0) {
        cardElement.style.display = 'none';
        controls.style.display = 'none';
        noStarsMsg.style.display = 'block';
    } else {
        if (current >= starredCards.length) current = starredCards.length - 1;
        renderCard(current);
        cardElement.style.display = 'block';
        controls.style.display = 'flex';
        noStarsMsg.style.display = 'none';
    }
};

function updateStarCards() {
    starredCards = allFlashcards.filter(c => starredWords[c.word]);
}

window.onload = () => {
    loadStars();
    updateStarCards();

    if (starredCards.length === 0) {
        noStarsMsg.style.display = 'block';
        cardElement.style.display = 'none';
        controls.style.display = 'none';
    } else {
        noStarsMsg.style.display = 'none';
        cardElement.style.display = 'block';
        controls.style.display = 'flex';
        current = 0;
        renderCard(current);
    }
};
