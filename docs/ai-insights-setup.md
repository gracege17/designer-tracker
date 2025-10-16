# AI Insights Setup Guide

This app now includes AI-powered insights that automatically analyze your weekly reflections and generate personalized summaries.

## 🏗️ Architecture

- **Frontend**: React (Vite) - Client-side app
- **Backend**: Vercel Serverless Functions - Secure API endpoint
- **AI**: OpenAI GPT-4o-mini - Generates insights

## 📁 Files Created

### 1. Serverless API
- `api/generate-insights.ts` - Vercel serverless function that calls OpenAI

### 2. Frontend Service
- `src/utils/aiInsightsService.ts` - Service to call the API and cache results

### 3. Configuration
- `vercel.json` - Vercel deployment configuration
- `package.json` - Added `@vercel/node` dependency

## 🚀 Deployment Steps

### 1. Install Vercel CLI (if not already)
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Link Project
```bash
vercel link
```

### 4. Add Environment Variable
```bash
vercel env add OPENAI_API_KEY
```
When prompted:
- **Environment**: Select "Production, Preview, and Development"
- **Value**: Paste your OpenAI API key

### 5. Deploy
```bash
vercel --prod
```

## 🔑 Getting an OpenAI API Key

1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to **API keys** section
4. Click **Create new secret key**
5. Copy the key (it starts with `sk-`)
6. Add it to Vercel as shown above

## 💰 Cost Estimation

Using GPT-4o-mini:
- **~$0.0015 per insight generation** (500 tokens avg)
- **~$0.05 per month** (30-40 generations)
- **OpenAI free tier**: $5 credit for first 3 months

## 🎨 How It Works

### User Flow
1. User logs tasks and feelings
2. After saving, AI automatically generates insights
3. Insights are cached in localStorage
4. Dashboard displays 4 AI-generated cards:
   - 🔥 What Sparked Passion
   - ⚡ What Gave You Energy
   - 😮‍💨 What Drained You
   - 💜 What Felt Meaningful

### AI Prompt Strategy
The AI receives:
- All tasks from the current week
- Associated emotions (1-16 scale)
- Project names

And generates:
- One reflective insight sentence per card
- 1-3 specific task examples
- Warm, personal, journal-like tone

## 🧪 Local Testing

### Option 1: Vercel Dev Server
```bash
vercel dev
```
This runs the serverless functions locally at `http://localhost:3000`

### Option 2: Environment Variable
Create `.env.local`:
```
OPENAI_API_KEY=sk-your-key-here
```

Then run:
```bash
npm run dev
```

## 🐛 Troubleshooting

### "AI service not configured" error
- Ensure `OPENAI_API_KEY` is set in Vercel environment variables
- Redeploy after adding the variable

### "Failed to generate insights" error
- Check OpenAI API key is valid
- Check you have credits remaining
- Check browser console for detailed error messages

### Insights not showing
- Check browser console (F12) for API errors
- Verify at least 1 task exists in current week
- Try clicking "Regenerate Insights" button

## 📊 Monitoring

### View API Usage
```bash
vercel logs
```

### Check OpenAI Usage
https://platform.openai.com/usage

## 🔒 Security Notes

- ✅ API key stored securely in Vercel environment
- ✅ Never exposed to client
- ✅ Can add rate limiting in the future
- ✅ Can monitor usage via Vercel logs

## 🎯 Future Enhancements

- [ ] Rate limiting per user
- [ ] Insight history/archive
- [ ] Monthly summary emails
- [ ] Custom insight preferences
- [ ] Multi-language support

