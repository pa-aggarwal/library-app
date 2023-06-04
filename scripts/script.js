// eslint-disable-next-line import/extensions
import helpers from "./helpers.js";

/**
 * Initialize a new library object.
 * @param {Array<Book>} books - Book instances in this library.
 */
function Library(books) {
    this.books = books;
}

Library.prototype.addBook = function addBook(book) {
    this.books.push(book);
};

Library.prototype.displayBooks = function displayBooks() {
    const container = document.querySelector("#library");
    while (container.firstChild) {
        container.removeChild(container.lastChild);
    }

    const bookPropDisplayNames = {
        title: "Title",
        author: "Author",
        numPages: "Number of Pages",
        isRead: "Read Status",
    };

    const headerColumns = Object.values(bookPropDisplayNames);
    const bookProps = Object.keys(bookPropDisplayNames);
    const rows = this.books.map((book) =>
        bookProps.map((prop) => book.displayProp(prop))
    );

    const table = new helpers.Table(headerColumns, rows);
    container.appendChild(table.getElement());
    return container;
};

function Book(title, author, numPages, isRead) {
    this.title = title;
    this.author = author;
    this.numPages = numPages;
    this.isRead = isRead;
}

Book.prototype.displayProp = function displayProp(property) {
    if (!this.hasOwnProperty(property)) {
        throw new Error("Invalid property on Book object.");
    }
    return {
        title: this.title,
        author: this.author,
        numPages: this.numPages,
        isRead: this.isRead ? "Finished" : "Not Read",
    }[property];
};

// Manually add some books to view the display
const book1 = new Book("The Hobbit", "J.R.R. Tolkien", 295, false);
const book2 = new Book("Pride and Prejudice", "Jane Austen", 279, false);
const book3 = new Book("The Fault in Our Stars", "John Green", 313, true);

const myLibrary = new Library([book1, book2]);
myLibrary.addBook(book3);

myLibrary.displayBooks();
