/**
 * Create an MVC controller to link a library's model and view.
 * @param {Library} model - The object representing the library model.
 * @param {View} view - The view which displays the library.
 * @param {AppStorage} appStorage - The object managing local storage.
 */
function Controller(model, view, appStorage) {
    this.model = model;
    this.view = view;
    this.appStorage = appStorage;
    this.model.bindBooksChanged(this.onLibraryChanged.bind(this));
    this.view.bindAddBook(this.handleAdd.bind(this));
    this.view.bindUpdateBook({
        handleGet: this.handleGet.bind(this),
        handleUpdate: this.handleUpdate.bind(this),
    });
    this.view.bindRemoveBook(this.handleRemove.bind(this));
    this.view.bindStatusChange(this.handleStatusChange.bind(this));
    this.setupStorage();
}

/**
 * Notify the View to render the given books.
 * @param {Array<Book>} books - An array of books to render.
 */
Controller.prototype.onLibraryChanged = function onLibraryChanged(books) {
    this.view.displayLibrary(books);
};

/** Add initial data to local storage if it's empty, otherwise replace
 * the model's data with what's inside local storage. */
Controller.prototype.setupStorage = function setupStorage() {
    if (!this.appStorage.hasInitialData()) {
        this.appStorage.addInitialData(this.model);
        this.onLibraryChanged(this.model.books);
    } else {
        this.model.books = [];
        const booksProps = this.appStorage.getLocalData();
        booksProps.forEach((bookProps) => {
            const book = this.model.createBook(bookProps);
            this.model.addBook(book);
        });
    }
};

/**
 * Notify the model to create and add a new book.
 * @param {object} bookProps - Book properties for the new book.
 */
Controller.prototype.handleAdd = function handleAdd(bookProps) {
    const book = this.model.createBook(bookProps);
    this.model.addBook(book);
    this.appStorage.updateData(this.model.getBooks());
};

/**
 * Retrieve a book from the model and return its properties.
 * @param {number} index - The index of the book to get.
 * @returns {object} Object with book properties.
 */
Controller.prototype.handleGet = function handleGet(index) {
    const { title, author, pageCount, isRead } = this.model.getBook(index);
    return { title, author, pageCount, isRead };
};

/**
 * Notify the model to update the given book.
 * @param {number} index - The index of the book to update.
 * @param {object} bookProps - A book's updated property values.
 */
Controller.prototype.handleUpdate = function handleUpdate(index, bookProps) {
    this.model.updateBook(index, bookProps);
    this.appStorage.updateData(this.model.getBooks());
};

/**
 * Notify the model to remove a book.
 * @param {number} index - The index of the book to remove.
 */
Controller.prototype.handleRemove = function handleRemove(index) {
    this.model.removeBook(index);
    this.appStorage.updateData(this.model.getBooks());
};

/**
 * Notify the model to update a book's read status.
 * @param {number} index - The index of the book whose status has changed.
 */
Controller.prototype.handleStatusChange = function handleStatusChange(index) {
    this.model.updateBookStatus(index);
    this.appStorage.updateData(this.model.getBooks());
};

export default Controller;
