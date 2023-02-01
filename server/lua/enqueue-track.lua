-- Adds the track to the back of the queue
local function enqueueTrack(track)
    redis.call('RPUSH', KEYS[1], track)
end

return enqueueTrack(ARGV[1])