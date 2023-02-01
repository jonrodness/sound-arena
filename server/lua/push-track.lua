-- Adds the track to the front of the queue
local function pushTrack(trackId)
    redis.call('LPUSH', KEYS[1], trackId)
end

return pushTrack(ARGV[1])