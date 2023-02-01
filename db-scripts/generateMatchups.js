var fs = require('fs');
const DUMMY_TRACK_ID = "141";

/* RAP
(Eligible) Track 141 will be used as dummy track 

(Eligible) Minimum entries reached, minumum plays reached, >= 50%
- Track 216 - 10 entries, 10 wins, 0 losses
- Track 116 - 10 entries, 12 wins, 6, losses 

(Eligible) Minimum entries reached, minumum plays reached, < 50%
- Track 243 - 10 entries, 1 wins, 10 losses

(Not eligible) Minimum entries NOT reached, minumum plays reached 
- Track 244 - 9 entries, 15 wins, 3 losses

(Not eligible) Minimum entries NOT reached, minumum plays NOT reached 
- Track 88 - 9 entries, 2 wins, 3 losses

(Old skipped - not eligible) Skipped again 
- Track 241 - 0 entries, 1 wins, 0 losses 

(Old skipped - eligible) Completing old skipped
- Track 242 - 0 entries, 7 wins, 0 losses 

(Old skipped - skipped) Skipping old skipped 
- Track 240 - 0 entries, 0 wins, 0 losses 

(New skipped - skipped) Minimum entries reached, minumum plays NOT reached 
- Track 236 - 10 entries, 5 wins, 0 losses 

EDM 
- Track 141 will be used as dummy track 

Minimum entries reached, minumum plays reached
- Track 216 - 10 entries, 10 wins, 0 losses

User 43: track notifications:  
- 216: 2 awards (rap - 100%, edm - 100%)
- 241: 1 skipped
- 242: 1 award (rap - 75%)
- 243: 1 losing notification < 50% (rap - 9.09%)
- 244: no notifications (minumum entires not reached)

Expected response of `/job/finalize-competition`:
{
    "rap": {
        "prevSkippedCount": 3,
        "yesterdayMatchupsCount": 142,
        "yesterdayTotalTrackCount": 10,
        "deletedPrevSkippedTracksCount": 3,
        "newSkippedTracksCount": 3,
        "eligibleTracksCount": 5,
        "yesterdayMatchupsErrorCount": 0
    },
    "edm": {
        "prevSkippedCount": 0,
        "yesterdayMatchupsCount": 30,
        "yesterdayTotalTrackCount": 2,
        "deletedPrevSkippedTracksCount": 0,
        "newSkippedTracksCount": 0,
        "eligibleTracksCount": 2,
        "yesterdayMatchupsErrorCount": 0
    },
    "rock": {
        "prevSkippedCount": 0,
        "yesterdayMatchupsCount": 0,
        "yesterdayTotalTrackCount": 0,
        "deletedPrevSkippedTracksCount": 0,
        "newSkippedTracksCount": 0,
        "eligibleTracksCount": 0,
        "yesterdayMatchupsErrorCount": 0
    },
    "pop": {
        "prevSkippedCount": 0,
        "yesterdayMatchupsCount": 0,
        "yesterdayTotalTrackCount": 0,
        "deletedPrevSkippedTracksCount": 0,
        "newSkippedTracksCount": 0,
        "eligibleTracksCount": 0,
        "yesterdayMatchupsErrorCount": 0
    }
}
*/

const queryInstructions = [
    // Ensure dummy track is accounted for
    {
        trackId: DUMMY_TRACK_ID,
        entries: 10,
        wins: 0,
        losses: 0,
        genre: 'rap'
    },
    // (Eligible) Minimum entries reached, minumum plays reached, >= 50%
    {
        trackId: 216,
        entries: 10,
        wins: 10,
        losses: 0,
        genre: 'rap'
    },
    // (Eligible) Minimum entries reached, minumum plays reached, >= 50%
    {
        trackId: 116,
        entries: 10,
        wins: 12,
        losses: 6,
        genre: 'rap'
    },
    // (Eligible) Minimum entries reached, minumum plays reached, < 50%
    {
        trackId: 243,
        entries: 10,
        wins: 0,
        losses: 10,
        genre: 'rap'
    },
    // (Not eligible) Minimum entries NOT reached, minumum plays reached 
    {
        trackId: 244,
        entries: 9,
        wins: 15,
        losses: 3,
        genre: 'rap'
    },
    // (Not eligible) Minimum entries NOT reached, minumum plays NOT reached
    {
        trackId: 88,
        entries: 9,
        wins: 2,
        losses: 3,
        genre: 'rap'
    },
    // (Old skipped - eligible) Completing old skipped
    {
        trackId: 242,
        entries: 0,
        wins: 0,
        losses: 7,
        genre: 'rap'
    },    
    // (Old skipped - not eligible) - Added new matchup, but skipped again
    {
        trackId: 241,
        entries: 0,
        wins: 1,
        losses: 0,
        genre: 'rap'
    },
    // (Old skipped -skipped) - No new matchups, skipped again
    {
        trackId: 240,
        entries: 0,
        wins: 0,
        losses: 0,
        genre: 'rap'
    },
    // (New skipped - skipped) Minimum entries reached, minumum plays NOT reached
    {
        trackId: 236,
        entries: 10,
        wins: 5,
        losses: 0,
        genre: 'rap'
    },    
    // Ensure dummy track is accounted for
    {
        trackId: DUMMY_TRACK_ID,
        entries: 10,
        wins: 0,
        losses: 0,
        genre: 'edm'
    },
    // Minimum entries reached, minumum plays reached
    {
        trackId: 216,
        entries: 10,
        wins: 10,
        losses: 0,
        genre: 'edm'
    }        
];

let matchupCount = 0;

function generateSqlScript(queryInstructions) {
    function printMatchupQueries(
        count, 
        entryTrackId, 
        winningTrackId, 
        losingTrackId, 
        genre
    ) {
        for (let i = 0; i < count; i++) {
            const query = `INSERT INTO matchup (winning_track_id, losing_track_id, timestamp_added, user_id, winning_track_key, genre, entered_track_id) VALUES (${winningTrackId}, ${losingTrackId}, curdate()-1, 46, 'track2', '${genre}', ${entryTrackId});\n`;
            
            fs.appendFile('populate_yesterday_matchups.txt', query, function (err) {
                if (err) throw err;
            });
            
            matchupCount++;
        }
    }

    fs.writeFile('populate_yesterday_matchups.txt', '', function (err) {
        if (err) throw err;
        console.log('Created new file');
    });

    queryInstructions.forEach(instruction => {
        // Entries
        printMatchupQueries(
            instruction.entries,
            instruction.trackId,
            DUMMY_TRACK_ID,
            DUMMY_TRACK_ID,
            instruction.genre
        );

        // Wins
        printMatchupQueries(
            instruction.wins,
            DUMMY_TRACK_ID,
            instruction.trackId,
            DUMMY_TRACK_ID,
            instruction.genre
        );
        
        // Losses
        printMatchupQueries(
            instruction.losses,
            DUMMY_TRACK_ID,
            DUMMY_TRACK_ID,
            instruction.trackId,
            instruction.genre
        );        
    });
    console.log(`Wrote ${matchupCount} matchups`);
};

generateSqlScript(queryInstructions);