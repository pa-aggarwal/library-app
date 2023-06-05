// eslint-disable-next-line import/extensions
import helpers from "./helpers.js";


const constructors = function constructors() {

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

        const table = new helpers.Table(headerColumns, rows);
        this.container.appendChild(table.getElement());
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

    return { Library, Book };
}();

export default constructors;
