MoveIt — Vercel deployment notes

Quick steps to deploy this project to Vercel:

1) Create a Git repository and push this project to GitHub/GitLab/Bitbucket.

2) On Vercel, click "New Project" → Import from Git Repository → select the repo.

3) Set the build & output settings (Vercel auto-detects for many frameworks):
   - Framework: "Other"
   - Build Command: `npm run build`
   - Output Directory: `dist`

4) Add required environment variables under Project Settings → Environment Variables:
   - `PAYFAST_MERCHANT_ID` (your PayFast merchant id)
   - `PAYFAST_MERCHANT_KEY` (your PayFast merchant key)
   - `PAYFAST_PASSPHRASE` (optional passphrase used for signatures)

   Note: The client-side admin passphrase in `src/lib/appStorage.js` is for demo use only — for a secure admin login you must implement a backend authentication system and store secrets server-side.

5) (Optional) If you want PayFast server notifications (IPN) to update bookings centrally, create a proper backend to store bookings (database) and set the PayFast `notify_url` to the serverless endpoint:
   - `https://<your-vercel-domain>/api/payfast/notify`

   The repository contains a simple stub at `api/payfast/notify.js` that logs incoming notifications. It does NOT update client-side localStorage bookings. For production, implement signature verification and update your DB there.

6) Deploy. After the initial deploy, open the site and test booking flow:
   - Use `/admin/login` to sign in (default passphrase in demo is `admin123`).
   - Use Admin Panel to set sandbox keys and return URL if needed.

Notes and limitations:
- This app currently stores bookings in the browser `localStorage`. That means server-side PayFast notifications cannot directly modify client localStorage. For production payment reconciliation, migrate bookings to a backend service and update booking records from the `api/payfast/notify` handler.
- The `vercel.json` file is included to configure static builds and the `api/*` serverless function.

Commands to try locally:

```bash
npm install
npm run build
npm run preview
```

Then open `http://localhost:4173` (Vite preview default).
