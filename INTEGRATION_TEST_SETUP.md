# Integration Test Setup Guide

This guide explains how to run **true integration tests** that hit real APIs (OpenAI) with no mocks.

## 🎯 What This Tests

- ✅ Real OpenAI API calls (GPT-4o-mini or GPT-4)
- ✅ Your Vercel API endpoint (`/api/match-challenges`)
- ✅ Complete challenge matching flow
- ❌ No mocks, no simulations, no fake data

## 📋 Prerequisites

1. **OpenAI API Key**: Get one from https://platform.openai.com/api-keys
2. **Vercel Account**: For deploying the API (or run locally)
3. **Node.js 18+**: For running the test script

## 🚀 Quick Start

### Option 1: Test Against Deployed API (Recommended)

1. **Set up Vercel environment variables:**
   ```bash
   # Go to your Vercel dashboard
   # Project Settings → Environment Variables
   # Add:
   OPENAI_API_KEY=sk-your-key-here
   OPENAI_MODEL=gpt-4o-mini
   ```

2. **Deploy your app:**
   ```bash
   vercel --prod
   ```

3. **Run the integration test:**
   ```bash
   npx tsx test-challenge-matching.ts
   ```

### Option 2: Test Against Local Dev Server

1. **Create a `.env` file:**
   ```bash
   echo "OPENAI_API_KEY=sk-your-key-here" > .env
   echo "OPENAI_MODEL=gpt-4o-mini" >> .env
   ```

2. **Start the dev server:**
   ```bash
   npm run dev
   ```

3. **Run the test (in another terminal):**
   ```bash
   API_URL=http://localhost:5173 npx tsx test-challenge-matching.ts
   ```

## 📖 Usage Examples

### Run all test scenarios:
```bash
npx tsx test-challenge-matching.ts
```

### Run a specific scenario:
```bash
npx tsx test-challenge-matching.ts "Deadline Pressure"
npx tsx test-challenge-matching.ts "Cursor/Tool Frustration"
```

### Test against a different URL:
```bash
API_URL=https://your-custom-domain.com npx tsx test-challenge-matching.ts
```

### Use local simulation (no API calls):
```bash
USE_REAL_API=false npx tsx test-challenge-matching.ts
```

## 🧪 Available Test Scenarios

1. **Deadline Pressure** - Tests deadline/stress detection
2. **Stuck on Problem** - Tests "no progress" triggers  
3. **Cursor/Tool Frustration** - Tests tool-specific matching
4. **General Overwhelm** - Tests multiple draining tasks
5. **Creative Block** - Tests frustration/stuck patterns
6. **AI Anxiety** - Tests AI-related concerns

## 🔍 What to Look For

When running tests, you should see:

```
🚀 Integration Test Mode
============================================================
📡 API URL: https://designer-tracker.vercel.app
🤖 Using real API: YES ✅
============================================================

============================================================
Testing: Deadline Pressure
============================================================

📝 Entry data:
  - Working on homepage redesign
    Notes: Feeling stressed about the deadline pressure
    Emotion: 6

⏳ Matching challenges...

🌐 Calling: https://designer-tracker.vercel.app/api/match-challenges

✅ Found 3 challenge(s):

1. Deadline pressure feels intense
   Your body flagged today's work as stressful...
   Actions: 4
```

## 🐛 Troubleshooting

### "No OPENAI_API_KEY found"
- Make sure you set the environment variable in Vercel
- Or create a `.env` file locally with `OPENAI_API_KEY=your-key`

### "Failed to fetch" or Network Error
- Check your API_URL is correct
- Make sure your dev server is running (for local tests)
- Verify your app is deployed (for production tests)

### "Rate limit exceeded"
- You've hit OpenAI's rate limits
- Wait a few minutes and try again
- Or use `USE_REAL_API=false` for testing without API calls

### Getting simulated results ([SIMULATED] in reasoning)
- Your API key is not set in the environment
- The API is falling back to mock data
- Check Vercel environment variables

## 💰 Cost Considerations

Each test scenario makes **1 API call to OpenAI**:
- Using `gpt-4o-mini`: ~$0.0001 per test (very cheap)
- Using `gpt-4`: ~$0.01 per test (more expensive)

Running all 6 scenarios once ≈ **$0.0006** (mini) or **$0.06** (gpt-4)

## 🔄 CI/CD Integration

To run these tests in CI:

```yaml
# .github/workflows/integration-test.yml
name: Integration Tests

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npx tsx test-challenge-matching.ts
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          API_URL: ${{ secrets.VERCEL_URL }}
```

## 📚 Related Files

- `test-challenge-matching.ts` - Main integration test script
- `api/match-challenges.ts` - Vercel API endpoint (calls OpenAI)
- `src/utils/hybridChallengeMatchingService.ts` - Frontend service
- `.env.example` - Example environment variables

## ✅ Verification Checklist

- [ ] OpenAI API key is set
- [ ] API endpoint is deployed or running locally
- [ ] Test runs without errors
- [ ] Results are NOT marked as `[SIMULATED]`
- [ ] Challenges returned are relevant to input
- [ ] Reasoning includes semantic analysis (not just keyword matching)

