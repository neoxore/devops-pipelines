 
---

# InfraFlow — DevOps CI/CD Pipeline (NestJS)

A hands-on DevOps project that demonstrates the full pipeline: **code → tests → containerization → CI → CD → cloud deploy**.
Built with **NestJS**, **Docker**, **GitHub Actions**, and **Render**.

[![CI](https://github.com/neoxore/devops-pipelines/actions/workflows/ci.yml/badge.svg)](https://github.com/neoxore/devops-pipelines/actions/workflows/ci.yml)

---

## Why this project exists

I needed a compact, realistic example to **prove DevOps fundamentals**:

* Automate quality gates (build + tests) on every commit.
* Produce a portable artifact (Docker image).
* Deploy automatically to the cloud on a free tier.
* Expose a health endpoint for platform checks.

This repository is intentionally small so the focus stays on **process**, not app complexity.

---

## What the app does (minimal by design)

A NestJS API with two endpoints:

| Method | Path      | Purpose                         |
| -----: | --------- | ------------------------------- |
|    GET | `/info`   | Returns project/author info     |
|    GET | `/health` | Health check JSON for platforms |

---

## Architecture at a glance

```
Developer → GitHub → GitHub Actions (CI) → Render (CD) → Public URL
                 \→ Docker image build (multi-stage)
```

* **CI (GitHub Actions):** installs deps, builds TS → JS, runs Jest tests.
* **CD (Render):** pulls code, builds, starts the service on a platform-assigned port, probes `/health`.

---

## Screenshots

* **CI success (GitHub Actions):**

  
  ![CI success](https://github.com/neoxore/devops-pipelines/blob/main/IMAGE%202025-11-08%2008%3A59%3A39.jpg)

* **Live deploy (Render):**


  ![Render live](https://github.com/neoxore/devops-pipelines/blob/main/IMAGE%202025-11-08%2008%3A59%3A30.jpg)

---

## Live demo

* **Production URL:** [https://devops-pipelines.onrender.com](https://devops-pipelines.onrender.com)

  * Health: `GET /health`
  * Info: `GET /info`

> If your free instance spins down on inactivity, first request may take a few seconds.

---

## Key decisions & reasoning

1. **NestJS + minimal endpoints**

   * Goal is DevOps; app is deliberately simple.
2. **Health endpoint (`/health`)**

   * Lets the platform verify liveness during/after deploys.
3. **Docker multi-stage build**

   * Stage 1 compiles TS → JS; Stage 2 runs only the compiled output.
   * Smaller image and faster cold starts.
4. **GitHub Actions**

   * Enforces the “don’t break main” rule with automatic build + tests.
5. **Render (Free)**

   * Easiest free path to a public URL with built-in health checks.

---

## How to run locally

### Option A — Node (no Docker)

```bash
npm install
npm run build
npm run start
# open http://localhost:3000/info and /health
```

### Option B — Docker

```bash
docker build -t infraflow .
docker run -p 3000:3000 infraflow
# open http://localhost:3000/info and /health
```

---

## Dockerfile (multi-stage) — what & why

* **Stage: builder**

  * `npm install`
  * `npm run build` → emits `dist/`
* **Stage: runtime**

  * Copies only `dist/` and production deps (`npm install --omit=dev`)
  * Starts with `node dist/main.js`

Benefits: **smaller image**, **fewer attack surface**, **faster pull**.

---

## CI — GitHub Actions

Workflow: `.github/workflows/ci.yml`

What it does on every push/PR to `main`:

1. Checks out the repo.
2. Sets Node 18.
3. Installs dependencies.
4. Builds the project.
5. Runs tests (Jest).

Add your own tests under `src/**/*.spec.ts`.

---

## CD — Render configuration

* **Service type:** Web Service
* **Environment:** Node
* **Build Command:** `npm ci && npm run build`
* **Start Command:** `npm run start` (runs `node dist/main.js`)
* **Environment variable:** `PORT` (Render injects its own; fallback exists for local)
* **Health Check Path:** `/health`
* **Auto-deploy:** On Commit

### Critical app setting

In `src/main.ts` the server **must** listen on the platform port and `0.0.0.0`:

```ts
await app.listen(Number(process.env.PORT) || 3000, '0.0.0.0');
```

Reason: platforms like Render map a dynamic port and expect the app to bind to all interfaces.

---

## Testing

```bash
npm test
```

Sample checks:

* `/info` returns a string containing the author name.
* `/health` returns `{ status: 'ok', uptime: number }`.

---

## Troubleshooting (common)

* **Render “Timed Out” during deploy:**

  * Ensure `main.ts` uses `process.env.PORT` and host `'0.0.0.0'`.
  * Set Health Check Path to `/health`.
  * Use `npm run start` → `node dist/main.js` (not `nest start`).

* **CI fails on YAML:**

  * Validate indenting (2 spaces).
  * Correct keys: `pull_request` (not `pull_requests`), `steps` under `jobs.<job>`.

* **Mixed lockfiles warning:**

  * Prefer one package manager. This setup uses **npm** (`npm ci`).

---

## Security & operational notes

* No secrets are stored in code; use **Render Environment Variables**.
* CI runs on every push to `main`; add branch protections if needed.
* Free Render instances can sleep; first request may be slow.

---

## Possible next steps

* Add **staging** environment and deploy only on tagged releases.
* Push Docker images to **Docker Hub / GHCR** from CI.
* Add **monitoring/logs** (Prometheus, Grafana, or hosted logs).
* Add **alerts** (e.g., Telegram webhooks on CI/CD failures).

---

## Author

**Danila Kovalev**
Google DevOps Essentials & Amazon DevOps Getting Started
GitHub: [@neoxore](https://github.com/neoxore)

---

### How this was built — step by step

1. Created minimal NestJS app with `/info` and `/health`.
2. Wrote unit tests with Jest.
3. Added multi-stage `Dockerfile` to produce a lean runtime image.
4. Configured **GitHub Actions** (`ci.yml`) to build & test on push/PR.
5. Deployed to **Render** with:

   * `npm ci && npm run build`
   * `npm run start` (`node dist/main.js`)
   * `PORT` env + `0.0.0.0` bind
   * Health check on `/health`
6. Verified:

   * CI run turns green ✅
   * Service becomes **Live** on Render and responds at `/info` and `/health`.

---

