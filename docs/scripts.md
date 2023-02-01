# Server

## Start dev server
yarn dev

## Start mysql server
sudo service mysql start
mysql -u <username> -p


# Redis

## Start redis server
redis-server

## Start redis client
redis-cli

## Populate redis queue:
- in root project directory:
- `cat redis-scripts/populate-rock-queue.txt | redis-cli -h <host> -p <port> -a <pw> --pipe`

## Repopulate redis queue from bash (from project root dir):
repop
    - alias for "cat redis-scripts/repopulate-queue.txt | redis-cli --pipe"
    - `cat redis-scripts/repopulate-queue-entries.txt | redis-cli --pipe`

# Db

# warm db for testing:
## first, run `generateMatchups.js` to generate `populate_yesterday_matchups.txt` file
## second, run `yarn setup-data` to execute mysql scripts and populate tables