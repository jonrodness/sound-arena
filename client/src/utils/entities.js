    /**
     * Find an entity in a given list by id. Entity must have an 'id' property.
     * @param {object[]} entities - The array of entities to search through.
     * @param {number} entityId - The id of the entitiy to find. 
     * @return {object} The found entity or null.
     */
    export const findEntityById = (entities, entityId) => {
        const matchingEntities = entities.filter(entity => {
            return entity.id == entityId
        })

        return matchingEntities.length ? matchingEntities[0] : null
    }

    export const isIdEqual = (id1, id2) => {
        if (id1 && id2) {
            return id1.toString() === id2.toString()            
        } else {
            return false
        }
    }