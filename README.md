<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# SEF Multimedia Global

A full-service creative agency specializing in photography, videography, graphic design, and web development.

## GitHub Hosting

1. Create a GitHub repository named `sef-multimedia-global`.
2. Add the remote and push your project:
   - `git init`
   - `git add .`
   - `git commit -m "Initial commit"
   - `git branch -M main`
   - `git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/sef-multimedia-global.git`
   - `git push -u origin main`
3. Replace `<YOUR_GITHUB_USERNAME>` in `package.json` with your GitHub username.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key.
3. Run the app:
   `npm run dev`

## Deployment

This project includes a GitHub Actions workflow for CI build validation. The workflow is located at `.github/workflows/ci.yml` and runs on push and pull request.

## GitHub Actions

- `npm ci`
- `npm run build`
- `npm run lint`

## Notes

- Keep `.env.local` out of source control. It is already ignored by `.gitignore` via `*.local`.
- The build output is stored in `dist/`, which is also ignored.
