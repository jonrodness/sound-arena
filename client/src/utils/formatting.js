const formatting = {
    /**
     * @typedef {Object} Time
     * @property {string} seconds The number of excess seconds (ie: 05)
     * @property {string} minutes The number of minutes (ie: 12)
     */

    /**
    * Gets a representation of time in the clock format of 00:00
    * @param {number} numSeconds - The duration in seconds
    * @returns {Time} The time
    */  
    getClockTime: (numSeconds) => {
        let seconds = Math.floor(numSeconds % 60)
        let minutes = Math.floor(numSeconds / 60)

        seconds = seconds < 10 ? "0" + seconds : seconds
        minutes = minutes < 10 ? "0" + minutes : minutes

        return {
            seconds: seconds,
            minutes: minutes
        }
    }
}

export default formatting