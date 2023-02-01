export const getErrorMessage = (code, expressions) => {
    const getExpression = key => {
        return expressions[key] || ''
    }

    const errorMapping = {
        1: 'There was an error with your request.',
        2: 'The entered link already exists. You may only add 1 link per platform.',
        3: 'There are currently no tracks available to listen to for this genre, however your track has been entered into the competition. Tracks will be available once other users enter the competition. Check back soon to continue!',
        4: 'Unauthorized for this action.',
        5: `Sorry, the duration of one of your uploaded tracks exceeds maximum length of ${ getExpression('maxTrackLength') }. Try uploading a shorter track.`,
        6: 'Link exceeds maximum number of characters.',
        7: 'There was a problem with this competition and it needed to be reset. Sorry for the inconvenience.',
        8: `You may only upload a maximum of ${ getExpression('maxNumTracks') } tracks to your account.`,
        9: 'Unsupported file type. Try using a different file format.',
        10: `One of you files has exceeded the maximum file size of ${ getExpression('maxFileSize') } MB. Please upload a smaller file`,
        11: `Sorry, the duration of one of your uploaded tracks does not meet the required length of ${ getExpression('minTrackLength') }. Try uploading a longer track.`,
    }

    return errorMapping[code]
}

export const ERROR_CODE_MAP = {
    COMPETITION_RESET: 7
}