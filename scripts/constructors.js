// eslint-disable-next-line import/extensions
import helpers from "./helpers.js";

const constructors = (function constructors() {
    const { checkInnerLengths } = helpers;

    /**
     * Create a new table object.
     * @param {Array<string>} headerColumns
     * @param {Array<Array>} rows
     */
    function Table(columnHeaders, rows) {
        this.container = document.createElement("table");
        this.thead = document.createElement("thead");
        this.thead.appendChild(document.createElement("tr"));
        this.tbody = document.createElement("tbody");
        this.addColumnTitles(columnHeaders);
        this.addRows(rows);
    }

    Table.prototype.addColumnTitle = function addColumnTitle(title) {
        const theadRow = this.thead.children[0];
        const columnHTML = `\n<th scope="col">${title}</th>`;
        theadRow.insertAdjacentHTML("beforeend", columnHTML);
    };

    Table.prototype.addColumnTitles = function addColumnTitles(titles) {
        titles.forEach((title) => this.addColumnTitle(title));
    };

    Table.prototype.headLength = function headLength() {
        return this.thead.children[0].children.length;
    };

    Table.prototype.addColumn = function addColumn(title, valueInHtml) {
        this.addColumnTitle(title);
        const tbodyRows = Array.from(this.tbody.children);
        const cellHTML = `\n<td>${valueInHtml}</td>`;
        tbodyRows.forEach((row) => {
            row.insertAdjacentHTML("beforeend", cellHTML);
        });
    };

    Table.prototype.addRows = function addRows(rows) {
        if (!checkInnerLengths(rows, this.headLength())) {
            throw new Error("Length of each row must equal length of headers.");
        }
        const fragment = new DocumentFragment();
        rows.forEach((row) => {
            const rowElement = document.createElement("tr");
            row.forEach((valueInHtml) => {
                const cellInHtml = `\n<td>${valueInHtml}</td>`;
                rowElement.insertAdjacentHTML("beforeend", cellInHtml);
            });
            fragment.appendChild(rowElement);
        });
        this.tbody.appendChild(fragment);
    };

    Table.prototype.display = function display() {
        this.container.appendChild(this.thead);
        this.container.appendChild(this.tbody);
        return this.container;
    };

    /**
     * Initialize a new library object.
     * @param {Array<Book>} books - Book instances in this library.
     * @param {Element} container - The DOM element representing this library.
     */
    function Library(books, container) {
        this.books = books;
        this.container = container;
        this.table = this.createTable();
    }

    Library.prototype.bookInfoToDisplay = function propsToDisplay() {
        return ["Title", "Author", "Number of Pages", "Read Status"];
    };

    Library.prototype.createTable = function createTable() {
        const bookProps = this.bookInfoToDisplay();
        const rows = this.books.map((book) =>
            bookProps.map((prop) => book.displayProp(prop))
        );
        return new Table(bookProps, rows);
    };

    Library.prototype.addBook = function addBook(book) {
        const bookProps = this.bookInfoToDisplay();
        const row = bookProps.map((prop) => book.displayProp(prop));
        this.table.addRows([row]);
        this.books.push(book);
    };

    Library.prototype.display = function display() {
        while (this.container.lastChild) {
            this.container.removeChild(this.container.lastChild);
        }
        this.container.appendChild(this.table.display());
        return this.container;
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
        return {
            Title: this.title,
            Author: this.author,
            "Number of Pages": this.numPages,
            "Read Status": this.isRead ? "Finished" : "Not Read",
        }[property];
    };

    return { Library, Book };
})();

export default constructors;
