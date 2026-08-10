<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# SEF Multimedia Global

A full-service creative agency specializing in photography, videography, graphic design, and web development.

## GitHub Hosting

1. Create a GitHub repository named `SEF-Multimedia-Global`.
2. Add the remote and push your project:
   - `git init`
   - `git add .`
   - `git commit -m "Initial commit"`
   - `git branch -M main`
   - `git remote add origin https://github.com/dronegodone2022-netizen/SEF-Multimedia-Global.git`
   - `git push -u origin main`
3. Your repository is already configured with the published homepage URL.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key.
3. Run the app:
   `npm run dev`

## Deployment

This project includes three GitHub Actions workflows:

- `.github/workflows/ci.yml` for build validation on push and pull request
- `.github/workflows/deploy.yml` for publishing the app to GitHub Pages when `main` is updated
- `.github/workflows/hostinger-deploy.yml` for publishing the app to Hostinger automatically when `main` is updated

The app will be published to:

- GitHub Pages: `https://dronegodone2022-netizen.github.io/SEF-Multimedia-Global`
- Hostinger: your Hostinger site URL once configured

### Hostinger automatic deploy setup

To enable Hostinger deploys from GitHub, add the following repository secrets in GitHub:

- `HOSTINGER_FTP_SERVER` — your Hostinger FTP server hostname
- `HOSTINGER_FTP_USERNAME` — your Hostinger FTP username
- `HOSTINGER_FTP_PASSWORD` — your Hostinger FTP password
- `HOSTINGER_REMOTE_DIR` — the remote directory on Hostinger (for example `/public_html`)

Once the secrets are configured, pushing to `main` will build the app with `npm run build:root` and upload `dist/` to Hostinger.

## GitHub Actions

- `npm ci`
- `npm run build`
- `npm run lint`

## Notes

- Keep `.env.local` out of source control. It is already ignored by `.gitignore` via `*.local`.
- The build output is stored in `dist/`, which is also ignored.
