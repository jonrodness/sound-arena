-- Checks whether the entry exists in the list and return index, else return NULL
local function checkEntryExists(entry)
    return redis.call('LPOS', KEYS[1], entry)
end

return checkEntryExists(ARGV[1])