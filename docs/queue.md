# Queue Design
## Queue Length Control:
- A track is added to the queue only once per matchup, after the first checkout, so the queues lose 2 tracks for every 1 tracks they gain, so growth is controlled
## Queues: 
- There will be 2 queues per genre and will be utilized in the following order:
    1. Priority Queue (ie: `rap-priority`)
        - When a track begins/completes a matchup, it will gain an entry into this queue for as many tracks as it consumes during the competition
        - Contains skipped tracks from previous days 
    2. Backup Queue (ie: `rap-backup`)
        - Contains backup tracks in case priority queue is empty.
        - Replenished upon no more tracks being available when lookup in Backup queue.
        - Contains tracks historically added to this competition genre.
## Queue entries:
- Each queue item will contain the required information to check-out the track for a matchup:
    - The trackId: to determine the track information
    - The artistId: to determine that the track does not belong to the artist checking it out
    - The entry will have the following format: `trackId|artistId`
## Checkouts:
- Rules for track checkout:
    - track cannot belong to the artist checking out the track
    - track cannot be the same as the track it will be competing against
- A cron job will query all checked-out tracks at a regular interval and re-queue tracks that have passed the consumption threshold (ie: 10 mins or however long a reasonable amount of time to complete a matchup is determined to be)
    - The user who has checked-out the track will still be responsible for completing the current matchup (unless the skip mechanism is invoked)
- For MVP use user table
    - `competition_tracks_returned` field is flag as to whether the checked-out tracks are returned to the queue
    - need `competition_entered_timestamp` to determine when the matchup began
    - use SQL query such as: `GET * FROM user WHERE competition_entered_timestamp - NOW > threshold AND tracks_returned == false AND winner_key == NULL`

- Required information:
    - trackIds for 
    - matchup completed flag
    - timestamp of checkout
    - matchupId
    - consumingUserId

## Queue Replenishment
- If a track is requested from an empty backup-queue, it will be refilled with appropriate tracks from the database
    populate the queue (or a backup queue) with these tracks in bulk, then queue query is re-tried

## Queue Initialization
- If queue is empty, however it is being attempted to be entered into, as long as that track is not currently in the queue, it may enter, so a track would only get 1 free entry. At that point it must wait until other entries are in the queue to proceed.