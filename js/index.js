let allFlashcards = [...flashcards];
let flashcardsSubset = [];
let current = 0;

const cardElement = document.querySelector('.card');
const frontEl = document.getElementById('card-front');
const backEl = document.getElementById('card-back');
const progressEl = document.getElementById('progress');
const starBtn = document.getElementById('star-btn');
const STORAGE_KEY = 'flashcard-progress';
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

function loadProgress() {
    const dataStr = localStorage.getItem(STORAGE_KEY);
    if (!dataStr) return false;
    try {
        const data = JSON.parse(dataStr);
        if (!data.subsetWords || typeof data.current !== "number") return false;
        const subset = [];
        for (const w of data.subsetWords) {
            const card = allFlashcards.find(c => c.word === w);
            if (card) subset.push(card);
        }
        if (subset.length === 0) return false;
        flashcardsSubset = subset;
        current = data.current >= 0 && data.current < flashcardsSubset.length ? data.current : 0;
        return true;
    } catch {
        return false;
    }
}

function saveProgress() {
    const data = {
        current,
        subsetWords: flashcardsSubset.map(c => c.word)
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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

function renderCard(index) {
    if (index < 0 || index >= flashcardsSubset.length) {
        frontEl.innerText = "🎉 Completed!";
        backEl.innerText = "All vocabulary words reviewed!";
        progressEl.innerText = `${flashcardsSubset.length} / ${flashcardsSubset.length}`;
        starBtn.style.display = 'none';
        saveProgress();
        return;
    }
    const card = flashcardsSubset[index];
    frontEl.innerText = card.word;
    backEl.innerText = card.definition;
    progressEl.innerText = `${index + 1} / ${flashcardsSubset.length}`;
    updateStarBtn();
    saveProgress();
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

function startQuiz() {
    flashcardsSubset = [...allFlashcards];
    current = 0;
    cardElement.classList.remove('flipped');
    renderCard(current);
}

function applyStartIndex() {
    const input = document.getElementById('start-index');
    let index = parseInt(input.value, 10) - 1;
    if (isNaN(index) || index < 0 || index >= flashcardsSubset.length) {
        alert("Input must be a valid positive integer(1-6480).");
        return;
    }
    current = index;
    cardElement.classList.remove('flipped');
    renderCard(current);
}

window.onload = () => {
    loadStars();
    if (!loadProgress()) {
        startQuiz();
    } else {
        renderCard(current);
    }
};

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