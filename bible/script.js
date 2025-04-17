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

// Start
initBooks();