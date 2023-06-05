const helpers = (function helpers() {
    function checkInnerLengths(array, length) {
        return array.every((innerArray) => innerArray.length === length);
    }

    function stringToProperCase(string) {
        // Removes apostrophe from word boundaries
        const pattern = /\b(?<!('))\w+/g;
        return string.replace(
            pattern,
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        );
    }

    return {
        checkInnerLengths,
        stringToProperCase,
    };
})();

export default helpers;
