# Teklito Store: Hostinger Deployment Plan via GitHub Actions

This document outlines the deployment strategy for the Teklito Store (Laravel Backend + React Frontend) to Hostinger Shared Hosting, utilizing GitHub Actions to automate the build process and Hostinger's Git deployment feature to pull the final artifacts.

## Overview of the CI/CD Pipeline

1. **Development Branch (`teklito_dev`):** This is your active working branch containing all recent UI/UX improvements and backend changes. 
2. **Main Branch (`master`):** Once `teklito_dev` is tested, it gets merged into `master` (the source of truth for stable code).
3. **GitHub Action:** Triggers when code is pushed or merged into `master`. It automatically builds the React frontend, runs Composer to build the backend, prepares the deployable structure, and forcefully pushes only the compiled result to a separate `production` branch.
4. **Hostinger Git Deployment:** Configured strictly to track the `production` branch. Hostinger will automatically pull down only the optimized, production-ready artifacts to the public-facing directory.

---

## 1. Implementation Steps (GitHub Actions)

We will create a GitHub Action workflow (`.github/workflows/deploy.yml`) that does the following:

- **Check out** the codebase.
- **Frontend Build (`/frontend`):**
  - Setup Node.js.
  - Run `npm install` and `npm run build`.
- **Backend Build (`/backend`):**
  - Setup PHP.
  - Run `composer install --optimize-autoloader --no-dev`.
- **Artifact Compilation (The "Release" Package):**
  - Move the built frontend files (`frontend/dist/*`) into the backend's public directory (`backend/public/`), or structure it appropriately for the Hostinger `public_html` root.
  - Move customized `.htaccess` routing files to ensure React Router works correctly alongside the Laravel API.
- **Push to Production Branch:**
  - Commit the final compiled project (no raw React/Node modules, only compiled assets and optimized backend code) to the `production` branch using a bot account.

### Why this approach?
Hostinger shared hosting doesn't provide Node.js environments to run `npm run build` on the server reliably, nor do you want to run `composer install` with dev dependencies on a live site. By pushing *completed builds* to a separate `production` branch, Hostinger strictly acts as a file server.

---

## 2. Directory Structure on Hostinger

To ensure better security on shared hosting:
- The Laravel core (app, routes, config, vendor) should ideally sit *above* or outside `public_html`.
- Only the contents of `backend/public/` (and the injected frontend `dist/` files) should be inside Hostinger's `public_html`.
- We will configure the action to structure the `production` branch such that the repository structure maps cleanly to Hostinger's folder hierarchy.

---

## 3. Manual Steps (Hostinger Setup)

Once the GitHub Action is coded and pushes the built site to the `production` branch, you will need to perform these manual steps on Hostinger:

### Step A: Configure Git in Hostinger
1. Go to your Hostinger hPanel -> **Advanced** -> **GIT**.
2. Connect your GitHub repository using SSH/Deploy Keys.
3. Set the **Branch** to `production`.
4. Set the **Install Path** to your domain root (e.g., `public_html`).
5. Click **Deploy**. (You can also set up a Webhook here so GitHub tells Hostinger to pull automatically when the Action finishes).

### Step B: Configure Environment Variables
1. Go to Hostinger File Manager.
2. Create or open the `.env` file in the Laravel root.
3. Set `APP_ENV=production` and `APP_DEBUG=false`.
4. Set your production database credentials:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=u703200280_teklito_store
   DB_USERNAME=u703200280_teklito_store
   DB_PASSWORD=!Z9qZF@wa
   ```
5. Set `APP_URL=https://yourdomain.com`.

### Step C: Run Migrations and Seeders
Since it's shared hosting, you can run artisan commands via SSH or Hostinger's terminal:
1. Open Hostinger **SSH Access** / Terminal.
2. Navigate to your project root.
3. Run migrations and seed the initial data (categories, icons, initial products):
   ```bash
   php artisan migrate:fresh --force
   php artisan db:seed --force
   ```
   *(Note: Remove `migrate:fresh` for future updates to avoid dropping existing customer data! Use just `migrate` after the initial launch).*

### Step D: Storage Link
Ensure public images (product variants, icons) are accessible:
```bash
php artisan storage:link
```

### Step E: Cache Configuration
Ensure the backend runs blazingly fast in production:
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## Next Action
When you are ready to implement this, reply with **"Let's code the GitHub Action"** and we will:
1. Write the `.github/workflows/deploy.yml`.
2. Write the production `.htaccess` file.
3. Setup the build scripts to wire up the frontend to the backend correctly.
