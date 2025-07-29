# flashcards
## 📁 Project Structure

flashcards/
├── index.html        # Main page for sequential word review
├── shuffle.html      # Shuffle mode for randomized testing
├── star.html         # Favorites view (starred flashcards only)
├── css/
│   └── style.css
├── js/
│   ├── flashcards.js
│   ├── index.js
│   ├── shuffle.js
│   ├── star.js
└── README.md


## 🚀 How to Use

1. Open index.html in a browser to get started.
2. On the main page, select the starting word index and click "Confirm."
3. Click the flashcard to flip it and see the explanation.
4. Click the star icon (☆) to add the word to favorites. Click again to remove it.
5. Go to 🔀 Shuffle to start a randomized quiz (you can set the number of questions).
6. Go to ⭐ Favorites to review your starred vocabulary.

## 📦 Development Notes

- All data is stored in localStorage, with no backend required.
- The file flashcards.js should contain a global array called flashcards with the following format:

```js
const flashcards = [
  { word: "above", definition: "(adj.) 上文的, 前述的" },
  { word: "adult", definition: "(adj.) 成年的; 成熟的; 色情的" },
  // ... up to 6480
];

Tip: If you have a large dataset, consider loading it asynchronously from a separate .json file.
