# Deployment steps:
1. ensure build is correct profile
2. update FE variables to match server variables (
    ```
    in competition.js:
        export const COMPETITION = {
            MINIMUM_ENTRIES_TODAY: 10,
            MINIMUM_PLAYS_TODAY: 10,
            MINIMUM_MATCHUPS_LAST_10_DAYS: 5
        }
    ```
)

# GCP
## GAE
- deploy to QA environment: `gcloud app deploy app.*.yaml`
- deploy cron job configuration: `gcloud app deploy cron.yaml`
- get URL for deployed instance: `gcloud app browse`
- list projects: `gcloud projects list`
- switch project: `gcloud config set project my-project`