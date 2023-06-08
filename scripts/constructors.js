/* eslint-disable import/extensions */
import helpers from "./helpers.js";
import config from "./config.js";

const constructors = (function constructors() {
    const { checkInnerLengths, updateRowIndices, clearNode } = helpers;
    const { classes: styles } = config.CSS;
    const { application } = config;

    const deleteBtnHTML = `<button class="${styles.btn} ${styles.deleteBtn}">
        <i class="fa-solid fa-trash"></i>
        <span>Delete</span>
        </button>`;

    /**
     * Object representation of a Table with titled columns and rows.
     * @param {Array<string>} columnHeaders - Names or titles of the columns.
     * @param {Array<Array>} rows - Rows with data that corresponds to columns.
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

    Table.prototype.rowSubset = function rowSubset(startIndex) {
        return Array.from(this.tbody.children).slice(startIndex);
    };

    Table.prototype.addRows = function addRows(rows) {
        if (!checkInnerLengths(rows, this.headLength())) {
            throw new Error("Length of each row must equal length of headers.");
        }
        const startIndex = this.tbody.children.length;
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
        const insertedRows = this.rowSubset(startIndex);
        updateRowIndices(insertedRows, startIndex);
    };

    Table.prototype.removeRow = function removeRow(rowIndex) {
        const row = this.tbody.children[rowIndex];
        const nextRows = this.rowSubset(rowIndex + 1);
        this.tbody.removeChild(row);
        updateRowIndices(nextRows, rowIndex);
    };

    Table.prototype.updateCell = function updateCell(rIndex, cIndex, value) {
        const row = this.tbody.children[rIndex];
        const column = row.children[cIndex];
        clearNode(column);
        column.insertAdjacentHTML("beforeend", value);
    };

    Table.prototype.display = function display() {
        this.thead.classList.add(styles.titleText);
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
        this.createTable();
    }

    Library.prototype.createTable = function createTable() {
        const bookProps = application.tableColumns;
        const rows = this.books.map((book) =>
            bookProps.map((prop) => book.displayProp(prop))
        );
        this.table = new Table(bookProps, rows);
        this.table.addColumn(application.actionsColumn, deleteBtnHTML);
    };

    Library.prototype.addBook = function addBook(book) {
        const bookProps = application.tableColumns;
        const row = bookProps.map((prop) => book.displayProp(prop));
        row.push(deleteBtnHTML);
        this.table.addRows([row]);
        this.books.push(book);
    };

    Library.prototype.deleteBook = function deleteBook(bookIndex) {
        this.table.removeRow(bookIndex);
    };

    Library.prototype.editBookStatus = function editBookStatus(bookIndex) {
        const book = this.books[bookIndex];
        book.updateStatus();
        this.table.updateCell(bookIndex, 3, book.displayStatus());
    };

    Library.prototype.display = function display() {
        if (this.container.contains(this.table.container)) {
            this.container.removeChild(this.table.container);
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

    Book.prototype.updateStatus = function updateReadStatus() {
        this.isRead = !this.isRead;
    };

    Book.prototype.displayStatus = function displayStatus() {
        const checkedAttr = this.isRead ? "checked" : "";
        const checkboxText = this.isRead ? "Read" : "Not Read";
        return `<label class="${styles.readStatus}">
                <input type="checkbox" class="${styles.readToggle}" ${checkedAttr}>
                <span class="${styles.btn} ${styles.readToggleText}">${checkboxText}</span>
                </label>`;
    };

    Book.prototype.displayProp = function displayProp(property) {
        return {
            [application.tableColumns[0]]: this.title,
            [application.tableColumns[1]]: this.author,
            [application.tableColumns[2]]: this.numPages,
            [application.tableColumns[3]]: this.displayStatus(),
        }[property];
    };

    return { Library, Book };
})();

export default constructors;
