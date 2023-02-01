// Returns true if an array of numbers contains a matching number, regardless of whether the array contains numbers or strings of numbers 
export const includesStringOrInt = (arr, number) => {
    const parsedItems = arr.map(item => {
        return parseInt(item)
    })

    return parsedItems.includes(number)
}