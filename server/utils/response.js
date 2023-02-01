module.exports = {
    ENTITY_TYPES: {
        ARTISTS: 'artists',
        TRACKS: 'tracks'
    },

    setValidationError: (res, errorMessage) => {
        res.status(400).send({
            error: errorMessage
        });
    },

    // Pass in a response to amend it
    constructEntityResponse: (entityType, entityId, entity, response) => {
        response = response || {};
        response[entityType] = response[entityType] || {};
        response[entityType][entityId] = {
            ...response[entityType][entityId],
            ...entity
        };
        return response;
    }    
};