const responseUtils = require('../utils/response');
const Joi = require('joi');

class ValidationError extends Error {
    constructor(message) {
        super(message);
    }
}

const validateInput = (res, schema, input) => {
    const validateResult = schema.validate(input);
    let validationMessage = 'Invalid request';
  
    if (validateResult.error) {
        if (validateResult.error.details
            && validateResult.error.details.length
            && validateResult.error.details[0].message) {
            validationMessage = validateResult.error.details[0].message;
        } else if (validateResult.error.message) {
            validationMessage = validateResult.error.message;
        }
        throw new ValidationError(validationMessage);
    }

    return validateResult.value;
}

module.exports = {
    ValidationError,
    validateInput,

    // Throws error if failure
    validateLinkUrl: (res, url, conf) => {
        const urlRegex = conf.regex
        const urlMax = conf.maxLength

        // Validate URL
        // perform after knowing that type is valid
        const urlSchema = Joi.object({
            url: Joi.string()
                .error(new Error('Invalid URL'))
                .uri({
                    allowRelative: false,
                    scheme : [
                        'https'
                    ]
                })
                .required()
                .regex(urlRegex)
                .max(urlMax)
        });
        const input = { url };
        validateInput(res, urlSchema, input);         
    }
}