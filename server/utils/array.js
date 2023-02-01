module.exports = {
    /**
     * Shuffle elements of an array.
     * @param {Array} An array to be shuffled.
     */
    shuffleArray: (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            currentEl = array[i];
            array[i] = array[randomIndex];
            array[randomIndex] = currentEl;
        }
        return array;
    }
}