// Book manifest - Add all books here
const bookManifest = [
    { name: "Genesis", file: "genesis.json" },
    { name: "1 Enoch", file: "enoch.json" }
];

let currentBook = null;
let currentChapter = null;
let bookData = null;
const bookCache = {};

// Mobile menu functionality
const mobileMenu = document.getElementById('mobile-menu');
const sidebar = document.getElementById('sidebar');

function toggleSidebar() {
    sidebar.style.left = sidebar.style.left === '0px' ? '-100%' : '0';
}

mobileMenu.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleSidebar();
});

document.addEventListener('click', (e) => {
    if (window.innerWidth < 768 && !sidebar.contains(e.target)) {
        sidebar.style.left = '-100%';
    }
});

// Navigation controls
document.getElementById('prevChapter').addEventListener('click', () => {
    const prev = String(parseInt(currentChapter) - 1);
    if (bookData[currentBook][prev]) loadChapter(prev);
});

document.getElementById('nextChapter').addEventListener('click', () => {
    const next = String(parseInt(currentChapter) + 1);
    if (bookData[currentBook][next]) loadChapter(next);
});

// Fetch book data with error handling
async function loadBookData(bookFile) {
    try {
        if (!bookCache[bookFile]) {
            const response = await fetch(`data/books/${bookFile}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            bookCache[bookFile] = await response.json();
        }
        return bookCache[bookFile];
    } catch (error) {
        console.error(`Failed to load ${bookFile}:`, error);
        return null;
    }
}

// Load book and initialize first chapter
async function loadBook(bookFile) {
    try {
        bookData = await loadBookData(bookFile);
        if (!bookData) throw new Error('No book data received');
        
        currentBook = Object.keys(bookData)[0];
        currentChapter = '1'; // Force first chapter
        
        if (!bookData[currentBook][currentChapter]) {
            currentChapter = Object.keys(bookData[currentBook])[0];
        }

        updateChapterNavigation();
        loadChapter(currentChapter);
        document.getElementById('navigation').style.display = 'flex';

    } catch (error) {
        console.error("Book load failed:", error);
        document.getElementById('verses').innerHTML = 
            `<p class="error">Error loading book. Please try again.</p>`;
    }
}

// Update chapter navigation buttons
function updateChapterNavigation() {
    if (!bookData || !currentBook) return;
    
    const chapters = Object.keys(bookData[currentBook]);
    const chapterNumbers = document.getElementById('chapter-numbers');
    
    chapterNumbers.innerHTML = chapters.map(chapter => `
        <button class="chapter-btn ${chapter === currentChapter ? 'active' : ''}" 
                onclick="loadChapter('${chapter}')">
            ${chapter}
        </button>
    `).join('');
}

// Load specific chapter
function loadChapter(chapter) {
    if (!bookData || !currentBook || !bookData[currentBook][chapter]) return;
    
    currentChapter = chapter;
    const chapterContent = bookData[currentBook][chapter];
    
    const versesHtml = Object.entries(chapterContent)
        .map(([verse, text]) => `<p><b>${verse}:</b> ${text}</p>`)
        .join('');

    document.getElementById('verses').innerHTML = `
        <h2>${currentBook} ${currentChapter}</h2>
        ${versesHtml}
    `;

    updateChapterNavigation();
}

// Initialize book list
function initBooks() {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = bookManifest
        .map(book => `<button onclick="loadBook('${book.file}')">${book.name}</button>`)
        .join('');
}

// Start the application
document.addEventListener('DOMContentLoaded', async () => {
    initBooks();
    
    // Load Genesis by default
    const genesisBook = bookManifest.find(b => b.name === "Genesis");
    if (genesisBook) {
        await loadBook(genesisBook.file);
        
        // Close sidebar on mobile after initial load
        if (window.innerWidth < 768) {
            sidebar.style.left = '-100%';
        }
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        sidebar.style.left = '0';
    } else {
        sidebar.style.left = '-100%';
    }
});