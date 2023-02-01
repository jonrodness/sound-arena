import UrlParse from 'url-parse'

export const isValidInput = (input, constraints) => {
    let isValid = true
    let minLength
    let maxLength

    if (minLength = constraints.minLength) {
        if (input.length < minLength) {
            isValid = false
        }
    }

    if (maxLength = constraints.maxLength) {
        if (input.length > maxLength) {
            isValid = false
        }
    }

    return isValid
}

export const isUrlSafe = url => {
    const parsedUrl = UrlParse(url)
    if (parsedUrl.protocol === 'http:') return true
    if (parsedUrl.protocol === 'https:') return true
    return false
}