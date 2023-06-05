const helpers = function helpers() {

    function checkInnerLengths(array, length) {
        return array.every(innerArray => innerArray.length === length);
    }

    function makeTableHeader(columns) {
        const header = document.createElement("thead");
        const row = document.createElement("tr");
        columns.forEach(column => {
            const columnHTML = `<th scope="col">${column}</th>`;
            row.insertAdjacentHTML("beforeend", columnHTML);
        });
        header.appendChild(row);
        return header;
    }

    function makeTableBody(dataRows) {
        const tbody = document.createElement("tbody");
        const fragment = new DocumentFragment();
        dataRows.forEach((row) => {
            const trow = document.createElement("tr");
            row.forEach(cell => {
                trow.insertAdjacentHTML("beforeend", `<td>${cell}</td>`);
            });
            fragment.appendChild(trow);
        });
        tbody.appendChild(fragment);
        return tbody;
    }

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

    function stringToProperCase(string) {
        const pattern = /\b\w+/g;
        return string.replace(pattern, (word) =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        );
    }

    return {Table, stringToProperCase};
}();

export default helpers;
