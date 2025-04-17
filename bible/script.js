const bookManifest = [
    { name: "Genesis", file: "genesis.json" },
    { name: "1 Enoch", file: "enoch.json" }
];

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

async function loadBookData(bookFile) {
    if (!bookCache[bookFile]) {
        const response = await fetch(`data/books/${bookFile}`);
        const data = await response.json();
        bookCache[bookFile] = data;
    }
    return bookCache[bookFile];
}

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
    
    document.getElementById('verses').innerHTML = `
        <h2>${currentBook} ${currentChapter}</h2>
        ${Object.entries(chapterContent).map(([verse, text]) => `
            <p><b>${verse}:</b> ${text}</p>
        `).join('')}
    `;
    updateChapterNavigation();
}

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

// Mobile sidebar toggle
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (event) => {
    const sidebar = document.getElementById('sidebar');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (window.innerWidth < 768 && 
        !event.target.closest('.sidebar') && 
        !event.target.closest('#mobile-menu')) {
        sidebar.classList.remove('active');
    }
});

// Initialize the app
initBooks(); // Critical missing line added
