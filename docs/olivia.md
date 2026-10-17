# Olivia IA — Business Suites Kepler

The shared site layout loads a bilingual, accessible chat on every page. The
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
production exchange in both languages and a signed conversation follow-up.
Rollback: remove OliviaAI from SiteLayout and redeploy; the dedicated gateway
can be stopped without affecting other tenants.
