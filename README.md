# Everybody Polls website

A community polling app inspired by the playful vote, predict, and reveal rhythm
of Everybody Votes. The landing page offers clearly labeled practice polls;
`/shared/:questionId` displays real public results from the Render backend.
The current iOS release is in preparation, so no unverified download link is shown.

## Development

```sh
npm ci
npm run dev
npm run typecheck
npm run build
```

The backend adapter defaults to `https://everybody-polls-api.onrender.com` with
`everybody-polls-public`, a public application identifier. Optional local values
are documented in `.env.sample`. Public shared pages discard user IDs and display
aggregate counts only. The production API permits the website's production
origins; local shared-results checks need controlled fixtures or a local API.

## Deployment

The existing Netlify site is `everybody-polls`, serving
https://www.everybodypolls.com from this repository's `main` branch.
`netlify.toml` declares the build command, `dist` output, SPA fallback, and public
Render configuration. It overrides conflicting Netlify UI build values.

The homepage practice polls are local and illustrative. They submit no votes and
do not send notifications. Historical shared links preserve their actual results,
including polls with no options or votes. Account deletion remains unfinished.
