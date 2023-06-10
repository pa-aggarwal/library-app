/* eslint-disable import/extensions */
import helpers from "./helpers.js";
import config from "./config.js";

const constructors = (function constructors() {
    const { checkInnerLengths, updateRowIndices, clearNode } = helpers;
    const { classes: styles } = config.CSS;
    const { application } = config;

    const deleteBtnHTML = `<button class="${styles.btn} ${styles.deleteBtn} ${styles.actionBtn}">
        <i class="fa-solid fa-trash"></i>
        <span>Delete</span>
        </button>`;

    const editBtnHTML = `<button class="${styles.btn} ${styles.editBtn} ${styles.actionBtn}">
        <i class="fa-regular fa-pen-to-square"></i>
        <span>Edit</span>
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

    Table.prototype.rowSubset = function rowSubset(startIndex, endIndex) {
        const end = endIndex || this.tbody.children.length;
        return Array.from(this.tbody.children).slice(startIndex, end);
    };

    Table.prototype.getRowFragment = function getRowFragment(rows) {
        const fragment = new DocumentFragment();
        rows.forEach((row) => {
            const rowElement = document.createElement("tr");
            row.forEach((valueInHtml) => {
                const cellInHtml = `\n<td>${valueInHtml}</td>`;
                rowElement.insertAdjacentHTML("beforeend", cellInHtml);
            });
            fragment.appendChild(rowElement);
        });
        return fragment;
    };

    Table.prototype.addRows = function addRows(rows) {
        if (!checkInnerLengths(rows, this.headLength())) {
            throw new Error("Length of each row must equal length of headers.");
        }
        const startIndex = this.tbody.children.length;
        const fragment = this.getRowFragment(rows);
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

    Table.prototype.editRow = function editRow(rowIndex, newRow) {
        const oldRow = this.tbody.children[rowIndex];
        this.tbody.replaceChild(this.getRowFragment([newRow]), oldRow);
        const nextRows = this.rowSubset(rowIndex, rowIndex + 1);
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
        const actionsColumnData = deleteBtnHTML + editBtnHTML;
        this.table.addColumn(application.actionsColumn, actionsColumnData);
    };

    Library.prototype.getBook = function getBook(bookIndex) {
        return this.books[bookIndex];
    };

    Library.prototype.addBook = function addBook(book) {
        const bookProps = application.tableColumns;
        const row = bookProps.map((prop) => book.displayProp(prop));
        row.push(deleteBtnHTML + editBtnHTML);
        this.table.addRows([row]);
        this.books.push(book);
    };

    Library.prototype.deleteBook = function deleteBook(bookIndex) {
        this.table.removeRow(bookIndex);
    };

    Library.prototype.editBook = function editBook(bookIndex, newBook) {
        const bookProps = application.tableColumns;
        const row = bookProps.map((prop) => newBook.displayProp(prop));
        row.push(deleteBtnHTML + editBtnHTML);
        this.table.editRow(bookIndex, row);
        this.books[bookIndex] = newBook;
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

    /**
     * Create a new Modal window to display.
     * @param {Element} container - The DOM element representing this modal.
     * @param {HTMLElement} form - The form element to show in this modal.
     * @param {HTMLElement} submitBtn - The submit button element for the form.
     */
    function Modal(container, form, submitBtn) {
        this.container = container;
        this.form = form;
        this.submitBtn = submitBtn;
        this.heading = this.container.querySelector("h2");
    }

    Modal.prototype.show = function show() {
        this.container.classList.remove(styles.hide);
    };

    Modal.prototype.hide = function hide() {
        this.container.classList.add(styles.hide);
    };

    Modal.prototype.resetForm = function resetForm() {
        this.form.reset();
    };

    Modal.prototype.showWithEmptyForm = function showWithEmptyForm() {
        this.heading.textContent = "Add Book to Library";
        this.submitBtn.innerHTML = `<i class="fa-light fa-plus"></i>Add Book`;
        this.submitBtn.removeAttribute("data-submit-edit");
        this.submitBtn.removeAttribute("data-book-index");
        this.show();
    };

    Modal.prototype.showWithFilledForm = function showWithFilledForm(
        book,
        bookIndex
    ) {
        this.form.elements["book-title"].value = book.title;
        this.form.elements["book-author"].value = book.author;
        this.form.elements["book-pages"].value = book.numPages;
        this.form.elements["book-completion"].checked = book.isRead;
        this.heading.textContent = "Edit Book";
        this.submitBtn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i>Save`;
        this.submitBtn.setAttribute("data-submit-edit", "");
        this.submitBtn.setAttribute("data-book-index", `${bookIndex}`);
        this.show();
    };

    return { Library, Book, Modal };
})();

export default constructors;
