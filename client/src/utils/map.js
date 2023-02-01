/**
* Transforms an object to an array where each item represents the key value
* with a structure: {
*   key: key,
*   val: value
* }
* @param {object} map - The map to transform
* @returns {object[]} The transformed array
*/  
export const toNameValArray = map => {
    const keys = Object.keys(map)

    return keys.map(
        key => {
            return {
                name: map[key].name,
                val: key
            }
        }
    )
}