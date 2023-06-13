function AppStorage() {
    this.isAvailable = this.checkIsAvailable("localStorage");
}

/**
 * Return true if the specified type of storage is supported, else false.
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#testing_for_availability
 * @param {("localStorage"|"sessionStorage")} type - The type of storage.
 * @returns {boolean}
 */
AppStorage.prototype.checkIsAvailable = function storageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        const x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return (
            e instanceof DOMException &&
            // everything except Firefox
            (e.code === 22 ||
                // Firefox
                e.code === 1014 ||
                // test name field too, because code might not be present
                // everything except Firefox
                e.name === "QuotaExceededError" ||
                // Firefox
                e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage &&
            storage.length !== 0
        );
    }
};

/**
 * Return true if local storage is available and has data stored.
 * @returns {boolean}
 */
AppStorage.prototype.hasInitialData = function hasInitialData() {
    return this.isAvailable && localStorage.length > 0;
};

/**
 * Add some initial data to local storage if it's available.
 * @param {Library} library - Object with properties to store.
 */
AppStorage.prototype.addInitialData = function addInitialData(library) {
    if (!this.isAvailable) return;
    const books = library.getBooks();
    localStorage.setItem("libraryBooks", JSON.stringify(books));
};

/**
 * Return books stored in local storage if it's available.
 * @returns {Array<object>} objects with book properties.
 */
AppStorage.prototype.getLocalData = function getLocalData() {
    if (!this.isAvailable) return;
    return JSON.parse(localStorage.getItem("libraryBooks"));
};

/**
 * Update the books in local storage if it's available.
 * @param {Array<Book>} books - The updated array of books.
 */
AppStorage.prototype.updateData = function updateData(books) {
    if (!this.isAvailable) return;
    localStorage.setItem("libraryBooks", JSON.stringify(books));
};

export default AppStorage;
