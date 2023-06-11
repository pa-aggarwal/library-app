/**
 * Create a new book object.
 * @param {string} title - The title of this book.
 * @param {string} author - The author of this book.
 * @param {number} pageCount - The number of pages this book has.
 * @param {boolean} isRead - True if this book has been read, else false.
 */
function Book(title, author, pageCount, isRead) {
    this.title = title;
    this.author = author;
    this.pageCount = pageCount;
    this.isRead = isRead;
}

Book.prototype.toggleStatus = function toggleStatus() {
    this.isRead = !this.isRead;
};

/**
 * Create a new Library object.
 * @param {string} name - The name of this library
 */
function Library(name) {
    this.name = name;
    this.books = [
        new Book("The Hobbit", "J.R.R. Tolkien", 295, false),
        new Book("Pride and Prejudice", "Jane Austen", 279, false),
        new Book("The Fault in Our Stars", "John Green", 313, true),
    ];
}

/**
 * Save a function reference to call when this library updates.
 * @param {Function} callback - Function to call after this library changes.
 */
Library.prototype.bindBooksChanged = function bindBooksChanged(callback) {
    this.onBooksChanged = callback;
};

/**
 * Add a Book object to this library.
 * @param {Book} book - A book instance to add.
 */
Library.prototype.addBook = function addBook(book) {
    this.books.push(book);
    this.onBooksChanged(this.books);
};

/**
 * Return the book at the given index in this library.
 * @param {number} index - The index number of the book.
 * @returns {Book}
 */
Library.prototype.getBook = function getBook(index) {
    return this.books[index];
};

/**
 * Update the given properties of a book in this library.
 * @param {number} index - The index number of the book to change.
 * @param {object} bookProps - Updated property values.
 */
Library.prototype.updateBook = function updateBook(index, bookProps) {
    const { title, author, pages, isRead } = bookProps;
    const book = this.books[index];
    book.title = title;
    book.author = author;
    book.pageCount = pages;
    book.isRead = isRead;
    this.onBooksChanged(this.books);
};

/**
 * Remove a book at the given index from this library.
 * @param {number} index - The index number of the book to change.
 */
Library.prototype.removeBook = function removeBook(index) {
    this.books.splice(index, 1);
    this.onBooksChanged(this.books);
};

/**
 * Change the read status of a book in this library.
 * @param {number} index - The index number of the book to change.
 */
Library.prototype.updateBookStatus = function updateBookStatus(index) {
    this.books[index].toggleStatus();
    this.onBooksChanged(this.books);
};

/**
 * Return a new Book instance with the given properties.
 * @param {object} bookProps - Property values for the new book.
 * @returns {Book}
 */
Library.prototype.createBook = function createBook(bookProps) {
    const { title, author, pages, isRead } = bookProps;
    return new Book(title, author, pages, isRead);
};

export { Book, Library };
