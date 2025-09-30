# Firebase Console Setup Guide for Google Sign-In

## 🔧 Step-by-Step Configuration

### 1. Access Firebase Console
- Go to: https://console.firebase.google.com/project/unschooling-464413/overview
- Make sure you're logged in with the correct Google account

### 2. Configure Authentication
1. **Navigate to Authentication:**
   - Click on "Authentication" in the left sidebar
   - Go to "Sign-in method" tab

2. **Enable Google Sign-In:**
   - Find "Google" in the providers list
   - Click on it and toggle "Enable"
   - Make sure it's enabled (toggle should be ON)

### 3. Configure Authorized Domains
1. **In the Authentication section:**
   - Go to "Settings" tab (gear icon)
   - Scroll down to "Authorized domains"

2. **Add Required Domains:**
   ```
   localhost (for development)
   unschooling.in (your production domain)
   unschooling-464413.web.app (Firebase hosting domain)
   unschooling-464413.firebaseapp.com (Firebase app domain)
   ```

### 4. Configure OAuth Consent Screen
1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/apis/credentials/consent?project=unschooling-464413

2. **Configure OAuth Consent Screen:**
   - Choose "External" user type
   - Fill in required fields:
     - App name: "Unschooling"
     - User support email: your email
     - Developer contact: your email

3. **Add Authorized Domains:**
   - In "Authorized domains" section, add:
     ```
     unschooling.in
     unschooling-464413.web.app
     ```

### 5. Configure OAuth 2.0 Client IDs
1. **Go to Credentials:**
   - Visit: https://console.cloud.google.com/apis/credentials?project=unschooling-464413

2. **Find Web Application Client:**
   - Look for "Web application" client type
   - Click on it to edit

3. **Add Authorized JavaScript Origins:**
   ```
   https://unschooling.in
   https://unschooling-464413.web.app
   https://unschooling-464413.firebaseapp.com
   http://localhost:3000 (for development)
   ```

4. **Add Authorized Redirect URIs:**
   ```
   https://unschooling.in/__/auth/handler
   https://unschooling-464413.web.app/__/auth/handler
   https://unschooling-464413.firebaseapp.com/__/auth/handler
   ```

### 6. Verify Configuration
1. **Test in Development:**
   - Run `npm start` locally
   - Try Google Sign-In on localhost:3000

2. **Test in Production:**
   - Visit https://unschooling.in
   - Try Google Sign-In
   - Check browser console for errors

## 🚨 Common Issues and Solutions

### Issue 1: "This app is not verified"
- **Solution:** Complete OAuth consent screen configuration
- **Note:** This warning is normal for development/testing

### Issue 2: "Error 400: redirect_uri_mismatch"
- **Solution:** Add all required redirect URIs to OAuth client
- **Check:** Authorized redirect URIs in Google Cloud Console

### Issue 3: "Error 403: access_denied"
- **Solution:** Check authorized domains in Firebase Console
- **Check:** OAuth consent screen configuration

### Issue 4: "Error 400: invalid_request"
- **Solution:** Verify JavaScript origins are correct
- **Check:** Domain spelling and HTTPS protocol

## 🔍 Verification Checklist

- [ ] Google Sign-In enabled in Firebase Console
- [ ] Authorized domains include unschooling.in
- [ ] OAuth consent screen configured
- [ ] JavaScript origins added to OAuth client
- [ ] Redirect URIs configured
- [ ] Firebase project ID matches (unschooling-464413)

## 📞 Support Links

- Firebase Console: https://console.firebase.google.com/project/unschooling-464413
- Google Cloud Console: https://console.cloud.google.com/project/unschooling-464413
- Firebase Auth Docs: https://firebase.google.com/docs/auth/web/google-signin
