import { parseQueryString } from './url'

describe('parseQueryString', () => {
    it('returns all requested params', () => {
        const searchString = '?test=atest&this=that'

        const res = parseQueryString(searchString, [
            'test', 'this'
        ])

        expect(res).toEqual({
            test: 'atest',
            this: 'that'
        })
    })

    it('returns some requested params', () => {
        const searchString = '?test=atest&this=that'

        const res = parseQueryString(searchString, [
            'test', 'this', 'other'
        ])

        expect(res).toEqual({
            test: 'atest',
            this: 'that'
        })
    })    

    it('returns null when search string does not contain all params and allOrNothing is true', () => {
        const searchString = '?test=atest&this=that'

        const res = parseQueryString(searchString, [
            'test', 'this', 'other'
        ], {
            allOrNothing: true
        })

        expect(res).toBe(null)
    })     
})
