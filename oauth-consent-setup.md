# OAuth Consent Screen Setup Guide

## 📝 Step-by-Step Configuration

### 1. Access OAuth Consent Screen
- Go to: https://console.cloud.google.com/apis/credentials/consent?project=unschooling-464413
- Make sure you're logged in with the correct Google account

### 2. Configure OAuth Consent Screen

#### **App Information:**
- **App name:** `Unschooling`
- **User support email:** `your-email@example.com` (use your email)
- **App logo:** (optional, can skip for now)

#### **Developer contact information:**
- **Email addresses:** `your-email@example.com` (use your email)

### 3. Scopes (if prompted)
- **Email:** `userinfo.email`
- **Profile:** `userinfo.profile`
- **OpenID:** `openid`

### 4. Test Users (if needed)
- Add your email as a test user
- This allows you to test the app before verification

### 5. Save Configuration
- Click "Save and Continue" through all steps
- Complete the setup process

## 🚨 Important Notes

### "This app is not verified" Warning
- This is **NORMAL** for development/testing
- Click "Advanced" → "Go to [your app name] (unsafe)"
- This is safe for your own application

### Publishing Status
- Keep the app in "Testing" mode for now
- You can publish it later when ready for public use

## ✅ After Setup

1. **Test Google Sign-In again**
2. **You should be able to:**
   - Select your Google account
   - Grant permissions
   - Get redirected back to your website
   - See successful sign-in

## 🔧 If You Need Help

If you're still having issues:
1. **Check the browser console** for any error messages
2. **Try the diagnostic tools** on your website
3. **Share any specific error messages** you see

## 📞 Quick Links

- **OAuth Consent Screen:** https://console.cloud.google.com/apis/credentials/consent?project=unschooling-464413
- **Google Cloud Console:** https://console.cloud.google.com/project/unschooling-464413
- **Firebase Console:** https://console.firebase.google.com/project/unschooling-464413
