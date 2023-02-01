const { 
    encryptString,
    decryptString
 } = require('./encryption')

 describe('encryptString and decryptString', async function() {
    test('encrypts and decrypts successfully', function() {
        const obj = {
            test1: "one",
            test2: "two"
        }

        const {
            encryptedStr,
            iv,
            tag
         } = encryptString(JSON.stringify(obj))

        const decryptedString = decryptString(
            encryptedStr,
            iv,
            tag
        )

        const parsedDecryptedStr = JSON.parse(decryptedString)

        expect(parsedDecryptedStr).toEqual(obj)
    })
})