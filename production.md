# Production

## Docker
-   Builds docker image via GitHub Actions every time `master` is pushed

## fly.io

-   Deployed daily at 7am UTC via GitHub Actions

### Useful fly commands

-   `fly deploy`
-   `fly apps restart dota-coach`
-   `fly ssh console`
-   `fly secrets set SECRET=value`
