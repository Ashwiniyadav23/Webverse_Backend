# CI/CD

GitHub Actions runs `npm ci`, checks JavaScript syntax, loads the Express app and route modules, and verifies the combined-assessment rubric for pull requests targeting `main`, pushes to `main`, and manual workflow runs.

Vercel preview deployments for pull requests and production deployments from `main` are available when the repository is configured with these GitHub settings:

- Repository variable `VERCEL_DEPLOY_ENABLED=true`
- Repository secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID`

Configure the Vercel project to use this repository and set its runtime environment variables (including `MONGODB_URI` and `JWT_SECRET`) in Vercel. Leave the variable unset to use Vercel's existing Git integration or to run CI only. Do not enable both Git-based auto-deploys and this workflow unless duplicate deployments are intended.
