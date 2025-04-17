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

// Rest of the script remains the same until the init function
// (Previous loadBookData and initBooks functions stay unchanged)
