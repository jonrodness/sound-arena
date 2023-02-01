const crypto = require('crypto');
const INPUT_ENCODING = 'utf-8';
const OUTPUT_ENCODING = 'hex';
const AES_ALGORITHM = 'aes-128-gcm';
const IV_LENGTH = 12;
const PW = process.env.AES_PW;
const HASH_ALGO = 'MD5';

const key = crypto.createHash(HASH_ALGO).update(PW).digest();

module.exports = {
    /**
     * @typedef {Object} EncryptionResult
     * @property {String} iv - The initializtion vector used to encrypt the string
     * @property {String} encryptedStr - The encrypted string in base 16 hexidecimal encoding
     */ 

    /**
     * Gets the competition scores for tracks within the specified number of days
     *
     * @param {String} str The string to encrypt
     * @return {EncryptionResult} The object conataining the encrypted string and IV
     */
    encryptString: str => {
        const iv =  crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(AES_ALGORITHM, key, iv);
        let encryptedStr = cipher.update(str, INPUT_ENCODING, OUTPUT_ENCODING);
        encryptedStr += cipher.final(OUTPUT_ENCODING);
        const authTag = cipher.getAuthTag();
        return {
            iv: iv.toString(OUTPUT_ENCODING),
            encryptedStr,
            tag: authTag.toString(OUTPUT_ENCODING)
        };
    },

    decryptString: (encryptedStr, iv, authTag) => {
        const tagBuf = Buffer.from(authTag, OUTPUT_ENCODING);
        const ivBuf = Buffer.from(iv, OUTPUT_ENCODING);
        const decipher = crypto.createDecipheriv(AES_ALGORITHM, key, ivBuf);
        decipher.setAuthTag(tagBuf);

        const encryptedStrBuffer = Buffer.from(encryptedStr, OUTPUT_ENCODING);
        let decryptedStr = decipher.update(encryptedStrBuffer, OUTPUT_ENCODING, INPUT_ENCODING);
        decryptedStr += decipher.final(INPUT_ENCODING);
        return decryptedStr;
    }
};