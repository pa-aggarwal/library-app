/**
 * Create an MVC controller to link a library's model and view.
 * @param {Library} model - The object representing the library model.
 * @param {View} view - The view which displays the library.
 */
function Controller(model, view) {
    this.model = model;
    this.view = view;
    this.model.bindBooksChanged(this.onLibraryChanged.bind(this));
    this.view.bindAddBook(this.handleAdd.bind(this));
    this.view.bindUpdateBook({
        handleGet: this.handleGet.bind(this),
        handleUpdate: this.handleUpdate.bind(this),
    });
    this.view.bindRemoveBook(this.handleRemove.bind(this));
    this.view.bindStatusChange(this.handleStatusChange.bind(this));
    this.onLibraryChanged(this.model.books);
}

Controller.prototype.onLibraryChanged = function onLibraryChanged(books) {
    this.view.displayLibrary(books);
};

Controller.prototype.handleAdd = function handleAdd(bookProps) {
    const book = this.model.createBook(bookProps);
    this.model.addBook(book);
};

Controller.prototype.handleGet = function handleGet(index) {
    const { title, author, pageCount, isRead } = this.model.getBook(index);
    return { title, author, pageCount, isRead };
};

Controller.prototype.handleUpdate = function handleUpdate(index, bookProps) {
    this.model.updateBook(index, bookProps);
};

Controller.prototype.handleRemove = function handleRemove(index) {
    this.model.removeBook(index);
};

Controller.prototype.handleStatusChange = function handleStatusChange(index) {
    this.model.updateBookStatus(index);
};

export default Controller;
