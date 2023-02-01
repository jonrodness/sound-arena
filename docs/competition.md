# Competition time definitions
- The system should support all of North America
- A competition day will begin at 00:00 PST and end at 23:59 PST of the same day
- mysql server will need to be explicitly started with PST timezone (see: https://dev.mysql.com/doc/refman/8.0/en/time-zone-support.html)
  
# Competition rules
## Normal Rules:
    Rules: 
        i. Track must have entered MINIMUM_COMPETITION_ENTRIES during the day
        ii. Track must have been consumed MINIMUM_COMPETITION_ENTRIES_CONSUMED during the day
    - if track does not pass i), it is discarded 
    - if track passes i), but does not pass ii), it is pushed to the next day 
    - if track passes rules i) & ii), they are calculated for yesterday's competition and are eligible for a badge

## Extra Competition Rules (feature flag: EXTRA_COMPETITION_RULES):
- 3 scenarios to ensure there is at least 1 track is displayed on chart if there were any matchups:
    1. At least 1 track entered MINIMUM_COMPETITION_ENTRIES and was consumed MINIMUM_COMPETITION_ENTRIES_CONSUMED:
        Rules:
            i. Track must have entered MINIMUM_COMPETITION_ENTRIES during the day
            ii. Track must have been consumed MINIMUM_COMPETITION_ENTRIES_CONSUMED during the day
        - if track does not pass i), it is discarded 
        - if track passes i), but does not pass ii), it is pushed to the next day 
        - if track passes rules i) & ii), they are calculated for yesterday's competition and are eligible for a badge
    2. At least 1 track was entered MINIMUM_COMPETITION_ENTRIES, but no tracks were consumed MINIMUM_COMPETITION_ENTRIES_CONSUMED:
        Rules:
            i. Track must have entered MINIMUM_COMPETITION_ENTRIES during the day
            ii. The number of times a track was consumed must equal the calculated maximum consumptions for a track that has passed rule i)
        - if track does not pass i), it is discarded 
        - if track passes i), but does not pass ii), it is pushed to the next day 
        - if track passes rules i) & ii), they are calculated for yesterday's competition and are eligible for a badge
        * if none of these tracks had at least 1 play, all of these tracks will be skipped
    3. No tracks were entered MINIMUM_COMPETITION_ENTRIES:
        Rules:
            i. The number of times a track was entered must equal the calculated maximum entries for any given track in this group
        - if track passes i), they are calculated for yesterday's competition and are eligible for a badge
        - if track does not pass i), it is discarded

# Skipped Tracks
If a track has minimum number of entries, but does not meet minimum number of plays, it is skipped until the next day, where it is combined with the next day's results. Skipped tracks are stored in skipped_tracks table. The skipped_tracks table is refreshed daily, with new skipped tracks (including previous skipped tracks results) inserted, while old skipped track rows are purged.

- users are notified if their track is pushed to the following day
- users are notified if their track did not reach MINIMUM_COMPETITION_ENTRIES
- "push" non-finalized tracks to next day
