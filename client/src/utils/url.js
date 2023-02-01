import queryString from 'query-string'

// Returns null if allOrNothing is requested and not all params are in query
export const parseQueryString = (locationSearch, searchKeys, options) => {
    const allOrNothing = options && options.allOrNothing
    const searchParams = queryString.parse(locationSearch)
    if (allOrNothing) {
        const searchContainsAllKeys = searchKeys.reduce((acc, key) => {
            return acc && key in searchParams
        }, true)

        if (!searchContainsAllKeys) {
            return null
        }
    }

    return searchParams
}