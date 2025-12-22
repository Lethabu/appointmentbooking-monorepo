# 🔐 Cloudflare Authentication Setup

## Current Status
The deployment script is ready and working, but needs Cloudflare authentication.

## Quick Setup - Choose One Method

### Method 1: API Token (Recommended)

1. **Get your API Token**:
   - Go to https://dash.cloudflare.com/profile/api-tokens
   - Create a new API token or use existing one
   - Copy the token

2. **Set the environment variable**:
   ```powershell
   $env:CLOUDFLARE_API_TOKEN="your-actual-api-token-here"
   ```

3. **Test authentication**:
   ```powershell
   npx wrangler whoami
   ```

4. **Run deployment**:
   ```powershell
   node scripts/deploy-with-api-token.js
   ```

### Method 2: OAuth Login

1. **Clear any existing tokens**:
   ```powershell
   Remove-Variable CLOUDFLARE_API_TOKEN -ErrorAction SilentlyContinue
   Remove-Variable CLOUDFLARE_API_KEY -ErrorAction SilentlyContinue
   ```

2. **Login via browser**:
   ```powershell
   npx wrangler login
   ```

3. **Run deployment**:
   ```powershell
   node scripts/deploy-with-api-token.js
   ```

## Which Method to Choose?

- **API Token**: Best for automated deployments, CI/CD
- **OAuth**: Best for manual development, personal use

## Quick Test Commands

```powershell
# Check current auth status
npx wrangler whoami

# Check account info
npx wrangler account list

# List workers
npx wrangler workers list
```

## Deployment After Auth

Once authenticated, the script will:
1. ✅ Check authentication
2. 📦 Install dependencies  
3. 🔨 Build applications
4. 🚀 Deploy Worker
5. 📱 Deploy Next.js apps
6. 🗄️ Apply database migrations
7. 🔍 Verify deployment

## Expected Output

After successful authentication, you should see:
```
[INFO] ✅ Wrangler is authenticated:
[INFO] Name: Your Name
[INFO] Email: your.email@example.com
[INFO] Type: User
[INFO] Account: Your Account (ID: 9e96c83268cae3e0f27168ed50c92033)
```

## Troubleshooting

**"Authentication failed"**:
- Check token validity
- Ensure token has required permissions
- Try OAuth method instead

**"You are logged in with an API Token"**:
- Use OAuth login method instead

**Timeout errors**:
- Try again in a moment
- Check internet connection

---

**Ready to deploy? Set your API token and run the deployment!**
