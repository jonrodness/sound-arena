local function isValidFormat(trackEntry) 
    local _, _, trackId, artistId = string.find(trackEntry, "(%d+)|(%d+)")

    if artistId == nil or trackId == nil then
        return false
    else
        return true
    end
end

local function isSameArtist(trackEntry) 
    local _, _, trackId, artistId = string.find(trackEntry, "(%d+)|(%d+)")

    if artistId == ARGV[1] then
        return true
    else
        return false
    end
end


local function isTrackExcluded(trackEntry) 
    local _, _, trackId, artistId = string.find(trackEntry, "(%d+)|(%d+)")

    if trackId == ARGV[2] then
        return true
    else
        return false
    end
end

-- push the given track back to the left side of the queue
local function restoreTrackId(trackEntry)
    if trackEntry then
        redis.call('LPUSH', KEYS[1], trackEntry)
    end
end

-- Lua scripts are atomic on redis instance, meaning only
-- one script can execute at a time, so it's not a performance
-- issue that many of the track ids could be temporarily poppedTrackId
-- while finding the next valid track (although its not the most performant design
-- to block the queue with potentially O(n))

-- getNextValidTrack is a function that recursively pops the the head of the queue
    -- until either a valid track is found or there are no more tracks in
    -- the queue, at which point it pushes the popped tracks back into the
    -- queue to maintain the original order as it returns from the callee's
    -- context
local function getNextValidTrack(poppedTrackId)
    if redis.call('LLEN', KEYS[1]) > 0 then
        local trackEntry = redis.call('LPOP', KEYS[1])
        if isValidFormat(trackEntry) and not isSameArtist(trackEntry) and not isTrackExcluded(trackEntry) then -- Add all rules to this conditional
            -- track is valid
            restoreTrackId(poppedTrackId)
            return trackEntry
        else
            -- track is invalid, try the next track in the queue
            local validTrackId = getNextValidTrack(trackEntry)
            restoreTrackId(poppedTrackId)
            return validTrackId
        end
    else
        -- queue is empty
        restoreTrackId(poppedTrackId)
        return nil
    end
end

return getNextValidTrack(nil)