# Trendova Frontend

Arabic RTL React frontend for the Trendova FastAPI store.

## Prerequisites

- Node.js and npm
- Docker Desktop for container deployment
- Backend repository: `C:\Users\Cellusys\Desktop\Trendova-`

## Development

Start and seed the backend first:

```powershell
cd C:\Users\Cellusys\Desktop\Trendova-
docker compose up -d
python scripts/seed_demo.py
```

Then run this project:

```powershell
npm install
npm run dev
```

Vite proxies `/api`, `/media`, `/health`, `/docs`, and `/openapi.json` to the backend. Browser requests use relative URLs, avoiding CORS. `VITE_BACKEND_URL` only changes the development/preview proxy target.

## Routes

| Route | Access |
| --- | --- |
| `/login`, `/register` | Public |
| `/`, `/product/:id`, `/favorites`, `/cart` | Signed-in user |
| `/orders`, `/orders/:id`, `/profile`, `/notifications` | Signed-in user |
| `/admin`, `/admin/products`, `/admin/products/new`, `/admin/products/:id/edit` | Admin |
| `/admin/categories`, `/admin/users`, `/admin/orders` | Admin |

The seeded admin account is configured through `ADMIN_EMAIL` and `ADMIN_PASSWORD` in the backend `.env`; no credentials are stored here.

## Verification

```powershell
npx playwright test
npm run lint
npm run build
```

## Docker

The image builds with `node:20-alpine` then serves the static HashRouter build from nginx. nginx proxies `/api`, `/media`, and `/health` to `BACKEND_URL`, defaulting to `http://host.docker.internal:8000` for Docker Desktop.

```powershell
docker build -t trendova-ui .
docker run --rm -p 8080:80 trendova-ui
```
