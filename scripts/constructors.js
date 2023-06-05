// eslint-disable-next-line import/extensions
import helpers from "./helpers.js";

const constructors = (function constructors() {
    const { checkInnerLengths, makeTableBody, makeTableHeader } = helpers;

    /**
     * Create a new table object.
     * @param {Array<string>} headerColumns
     * @param {Array<Array>} rows
     */
    function Table(headerColumns, rows) {
        if (!checkInnerLengths(rows, headerColumns.length)) {
            throw new Error("Length of each row must equal length of headers.");
        }
        this.headerColumns = headerColumns;
        this.rows = rows;
    }

    Table.prototype.getElement = function display() {
        const myContainer = document.createElement("table");
        const header = makeTableHeader(this.headerColumns);
        const body = makeTableBody(this.rows);
        myContainer.append(header, body);
        return myContainer;
    };

    /**
     * Initialize a new library object.
     * @param {Array<Book>} books - Book instances in this library.
     * @param {Element} container - The DOM element representing this library.
     */
    function Library(books, container) {
        this.books = books;
        this.container = container;
    }

    Library.prototype.addBook = function addBook(book) {
        this.books.push(book);
    };

    Library.prototype.displayBooks = function displayBooks() {
        while (this.container.firstChild) {
            this.container.removeChild(this.container.lastChild);
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

        const table = new Table(headerColumns, rows);
        this.container.appendChild(table.getElement());
    };

    /**
     * Create a new Book object.
     * @param {string} title - The title of this book.
     * @param {string} author - The author of this book.
     * @param {number} numPages - The number of pages in this book.
     * @param {boolean} isRead - True if this book has been read, else false.
     */
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

    return { Library, Book };
})();

export default constructors;
