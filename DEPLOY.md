# Deploying JustMsg

## 1. Prerequisites
- GitHub Account
- Vercel Account
- Supabase Account (Already set up)

## 2. Push to GitHub
1. Initialize git if not done:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
2. Create a new repository on GitHub.
3. Push your code:
   ```bash
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

## 3. Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New..."** > **"Project"**.
3. Import your GitHub repository.
4. **Environment Variables**:
   Copy the values from your `.env.local` file and add them to the Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **"Deploy"**.

## 4. PWA Verification
Once deployed:
1. Open the URL on your mobile phone.
2. iOS (Safari): Tap **Share** > **Add to Home Screen**.
3. Android (Chrome): Tap **Three Dots** > **Install App**.

## 5. Troubleshooting
- If you see build errors about `turbopack`, ensure your `package.json` build script is standard `next build` (Vercel uses Webpack for builds by default usually, but dev might need flags).
- If PWA icons don't show, check `public/manifest.json` paths.
