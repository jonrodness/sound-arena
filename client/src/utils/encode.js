const htmlAttributeEncode = str => {
    const encoding = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;'
    }
    const regex = /[&<>"'/]/ig
    return str.replace(regex, matchedChar => encoding[matchedChar])
}

module.exports = {
    htmlAttributeEncode
}