const bookManifest = [
    { name: "Genesis", file: "genesis.json" },
    { name: "1 Enoch", file: "enoch.json" }
];

let currentBook = null;
const bookCache = {};

// Fetch book data
async function loadBookData(bookFile) {
    if (!bookCache[bookFile]) {
        const response = await fetch(`data/books/${bookFile}`);
        const data = await response.json();
        bookCache[bookFile] = data;
    }
    return bookCache[bookFile];
}

// Load chapter 1 of a book automatically
async function loadBook(bookFile) {
    const bookData = await loadBookData(bookFile);
    currentBook = Object.keys(bookData)[0]; // e.g., "1 Enoch"
    const firstChapter = Object.keys(bookData[currentBook])[0]; // Chapter 1
    
    // Display verses
    const versesDiv = document.getElementById('verses');
    versesDiv.innerHTML = `
        <h2>${currentBook}</h2>
        ${Object.entries(bookData[currentBook][firstChapter])
          .map(([verse, text]) => `
            <p class="verse"><b>${verse}:</b> ${text}</p>
          `).join('')}
    `;
}

// Initialize book list
function initBooks() {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = bookManifest
        .map(book => `
            <button onclick="loadBook('${book.file}')">
                ${book.name}
            </button>
        `)
        .join('');
}

let currentBook = null;
let currentChapter = null;
let bookData = null;
const bookCache = {};

// Navigation controls
document.getElementById('prevChapter').addEventListener('click', () => {
    const prev = parseInt(currentChapter) - 1;
    if (prev >= 1) loadChapter(prev.toString());
});

document.getElementById('nextChapter').addEventListener('click', () => {
    const next = parseInt(currentChapter) + 1;
    if (bookData[currentBook][next]) loadChapter(next.toString());
});

async function loadBook(bookFile) {
    bookData = await loadBookData(bookFile);
    currentBook = Object.keys(bookData)[0];
    currentChapter = Object.keys(bookData[currentBook])[0];
    
    document.getElementById('navigation').style.display = 'flex';
    updateChapterNavigation();
    loadChapter(currentChapter);
}

function updateChapterNavigation() {
    const chapters = Object.keys(bookData[currentBook]);
    const chapterNumbers = document.getElementById('chapter-numbers');
    
    chapterNumbers.innerHTML = chapters.map(chapter => `
        <button class="chapter-btn ${chapter === currentChapter ? 'active' : ''}" 
                onclick="loadChapter('${chapter}')">
            ${chapter}
        </button>
    `).join('');
}

function loadChapter(chapter) {
    currentChapter = chapter;
    const chapterContent = bookData[currentBook][chapter];
    
    // Update verses display
    document.getElementById('verses').innerHTML = `
        <h2>${currentBook} ${currentChapter}</h2>
        ${Object.entries(chapterContent).map(([verse, text]) => `
            <p><b>${verse}:</b> ${text}</p>
        `).join('')}
    `;

    // Update chapter navigation
    updateChapterNavigation();
}


// Start
initBooks();