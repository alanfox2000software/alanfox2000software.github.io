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
    try {
        bookData = await loadBookData(bookFile);
        currentBook = Object.keys(bookData)[0];
        currentChapter = Object.keys(bookData[currentBook])[0];
        
        document.getElementById('navigation').style.display = 'flex';
        updateChapterNavigation();
        loadChapter(currentChapter);
    } catch (error) {
        console.error("Failed to load book:", error);
    }
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

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        sidebar.style.left = '0';
    } else {
        sidebar.style.left = '-100%';
    }
});

// Load Genesis by default
window.addEventListener('DOMContentLoaded', async () => {
    // Find Genesis in book manifest
    const genesisBook = bookManifest.find(b => b.name === "Genesis");
    
    if (genesisBook) {
        await loadBook(genesisBook.file);
        
        // Close mobile sidebar after loading
        if (window.innerWidth < 768) {
            document.getElementById('sidebar').style.left = '-100%';
        }
    }
});

// Initialize books and load Genesis
function initApp() {
    initBooks();
    
    // Load Genesis after slight delay to ensure DOM is ready
    setTimeout(async () => {
        const genesis = bookManifest.find(b => b.name === "Genesis");
        if (genesis) await loadBook(genesis.file);
    }, 100);
}

// Start the app
initApp();