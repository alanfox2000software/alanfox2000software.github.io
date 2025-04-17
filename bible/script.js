const bookManifest = [
  { name: "Genesis", file: "genesis.json" },
  { name: "1 Enoch", file: "enoch.json" }
];

let currentBookData = null; // To store the loaded book data

// Fetch book data
async function loadBookData(bookFile) {
  try {
    const response = await fetch(`data/books/${bookFile}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading book:", error);
  }
}

// Display book list
function showBooks() {
  const bookList = document.getElementById('book-list');
  bookList.innerHTML = bookManifest.map(book => `
    <button onclick="handleBookClick('${book.file}')">
      ${book.name}
    </button>
  `).join('');
}

// Handle book click
async function handleBookClick(bookFile) {
  currentBookData = await loadBookData(bookFile);
  if (!currentBookData) return;

  const bookName = Object.keys(currentBookData)[0]; // e.g., "1 Enoch"
  const chapters = Object.keys(currentBookData[bookName]);

  // Show chapters
  document.getElementById('chapters-section').style.display = 'block';
  document.getElementById('verses-section').style.display = 'none';
  
  const chaptersDiv = document.getElementById('chapters');
  chaptersDiv.innerHTML = chapters.map(chapter => `
    <button class="chapter-btn" onclick="handleChapterClick('${chapter}')">
      Chapter ${chapter}
    </button>
  `).join('');
}

// Handle chapter click
function handleChapterClick(chapter) {
  const bookName = Object.keys(currentBookData)[0];
  const verses = currentBookData[bookName][chapter];

  document.getElementById('verses-section').style.display = 'block';
  const versesDiv = document.getElementById('verses');
  versesDiv.innerHTML = Object.entries(verses).map(([verse, text]) => `
    <p><b>${verse}:</b> ${text}</p>
  `).join('');
}

// Back buttons
function showChapters() {
  document.getElementById('verses-section').style.display = 'none';
}

// Initialize
showBooks();