# Olivia IA — Business Suites Kepler

The shared site layout loads a Spanish, English and Simplified Chinese chat on every page. The
cream, charcoal and gold panel and layered shadows follow suitesmine-bot's
Olivia design. Shadow DOM isolates the widget from the site styles. Consent
is required before sending; chat content is rendered as plain text.

Browser → Vercel POST /api/olivia → authenticated VPS gateway at
https://olivia.o7digitalgroup.com/kepler/chat → private Olivia V3.5 /v1/chat.
The gateway fixes the tenant to `kepler`, authenticates with a dedicated service
account, signs conversation IDs and limits messages per visitor IP. Engine
credentials stay on the VPS. Vercel's production `OLIVIA_GATEWAY_KEY` is private.
The Vercel function is native (`api/olivia.mjs`); Astro pages remain static.

VPS files: /opt/o7/apps/kepler-olivia. The source files are tracked under
infrastructure/olivia; `.env` and `.owner-credentials.json` stay private on the
VPS. Never copy them into this repository. The existing o7-proxy has an exact
/kepler/chat route to kepler-olivia-gateway:3099. V3 remains private.

Update approved hotel facts in infrastructure/olivia/knowledge.txt, copy it
to the VPS and recreate only this gateway with `docker compose up -d --force-recreate`.
It answers room, location and service questions, including complimentary
laundry from five nights. Live rates and availability go to the official
Cloudbeds engine or reservaskepler@gmail.com / +52 55 3666 8535.

Validation: npm run build, npm run check, npm test; then verify an actual
production exchange in all three languages and a signed conversation follow-up.
Rollback: remove OliviaAI from SiteLayout and redeploy; the dedicated gateway
can be stopped without affecting other tenants.

The gateway `/health` probes the private engine with a three-second timeout and
returns HTTP 503 when that engine cannot respond. A running gateway alone does
not mean that chat is available.

If production chat returns 503, check `docker logs --since 10m
kepler-olivia-gateway` and the state of `olivia-v3` and `olivia-v3-postgres`.
Both engine containers are required for Kepler, even though the public-facing
gateway is separate. On 2026-11-26, both were found stopped while the gateway
incorrectly reported healthy. Starting PostgreSQL and then the API restored
real chat responses. Host continuity controls manage these engine containers'
startup and enforce `restart=no`; do not override that policy. Do not retire
them while Kepler uses them, and include them in authorized host recovery.

When updating the gateway, deploy `gateway.mjs`, `health.mjs`, `knowledge.txt`
and `compose.yaml` together to `/opt/o7/apps/kepler-olivia`, then run
`docker compose up -d --force-recreate gateway` from that directory.
