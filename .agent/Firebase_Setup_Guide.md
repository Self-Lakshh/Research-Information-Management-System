# Firebase Setup Guide - CONFIGURATION_NOT_FOUND Error

## Error Details
```
GET https://www.googleapis.com/identitytoolkit/v3/relyingparty/getProjectConfig?key=... 400 (Bad Request)
{"error":{"code":400,"message":"CONFIGURATION_NOT_FOUND"}}
```

## This error means Firebase Authentication is not properly configured in your Firebase Console.

---

## ✅ Steps to Fix

### 1. Go to Firebase Console
Visit: https://console.firebase.google.com/project/spsu-rims

### 2. Enable Authentication
1. In the left sidebar, click **"Authentication"**
2. Click **"Get Started"** if you haven't set it up yet
3. Go to the **"Sign-in method"** tab
4. Enable **"Email/Password"** authentication:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

### 3. Create Firestore Database
1. In the left sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (we'll add security rules later)
4. Select your preferred location (e.g., us-central)
5. Click "Enable"

### 4. Set Up Storage
1. In the left sidebar, click **"Storage"**
2. Click **"Get started"**
3. Choose **"Start in test mode"**
4. Click "Next" and then "Done"

### 5. Verify API Key Settings
1. Go to **"Project Settings"** (gear icon in left sidebar)
2. Scroll down to **"Your apps"** section
3. Verify the Web App configuration matches your `.env` file
4. If needed, click "Add app" → "Web" to create a new web app

### 6. Check API Key Restrictions (if any)
1. Go to Google Cloud Console: https://console.cloud.google.com/
2. Select your project: **spsu-rims**
3. Go to **"APIs & Services"** → **"Credentials"**
4. Find your API key (AIzaSyAve6jyQSidiYuQz0cPNXjNkukc1bm8Xhg)
5. Make sure it's **NOT restricted** or has the following APIs allowed:
   - Identity Toolkit API
   - Cloud Firestore API
   - Firebase Storage API

---

## 🔄 After Completing These Steps

1. **Restart your dev server**:
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

2. **Clear browser cache** or open in incognito mode

3. **Try logging in again**

---

## 📝 Test Credentials

Once Firebase is set up, you'll need to create a test user:

### Option 1: Create User via Firebase Console
1. Go to **Authentication** → **Users** tab
2. Click **"Add user"**
3. Enter email and password
4. Click "Add user"

### Option 2: Create User via Our App (Admin Flow)
1. First, manually create an admin user in Firebase Console
2. In Firestore, go to the `users` collection
3. Add a document with the admin's UID:
   ```json
   {
     "uid": "firebase-user-uid",
     "email": "admin@example.com",
     "name": "Admin User",
     "user_role": "admin",
     "is_active": true,
     "created_at": [current timestamp],
     "updated_at": [current timestamp]
   }
   ```
4. Login with this admin account
5. Use the admin panel to create other users (they'll get password reset emails)

---

## 🎯 Quick Checklist

- [ ] Firebase Authentication enabled
- [ ] Email/Password sign-in method enabled
- [ ] Firestore Database created
- [ ] Storage enabled
- [ ] API key not restricted (or has required APIs)
- [ ] At least one test user created
- [ ] User document exists in Firestore `users` collection
- [ ] Dev server restarted
- [ ] Browser cache cleared

---

## 🐛 Still Having Issues?

If you still see the error after completing all steps:

1. **Check Firebase Console for errors**
   - Look for any red error messages
   - Check the "Usage" tab for API quota issues

2. **Verify environment variables are loaded**
   - Add `console.log(import.meta.env)` in `firebase.config.ts`
   - Check browser console to see if variables are loaded

3. **Try creating a new Firebase project**
   - Sometimes starting fresh helps
   - Update `.env` with new credentials

---

## 📞 Need Help?

Share the following information:
1. Screenshot of Firebase Console → Authentication page
2. Screenshot of Firebase Console → Firestore Database page
3. Any error messages in browser console
4. Any error messages in Firebase Console
