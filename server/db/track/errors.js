class TrackDoesNotExistError extends Error {
    constructor(message) {
        super(message);
    }
}

module.exports = {
    TrackDoesNotExistError
}