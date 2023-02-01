
class TrackScoreDoesNotExistError extends Error {
    constructor(msg) {
        super(msg)
    }
}

module.exports = {
    TrackScoreDoesNotExistError
}