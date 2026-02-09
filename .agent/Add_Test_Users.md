# Add Test Users to Firebase

You have **2 options** to add test users to your Firebase database:

---

## Option 1: Run the Automated Script (Recommended) ✨

This script will automatically create both Firebase Auth users and Firestore documents.

### Steps:

1. **Run the script:**
   ```bash
   node scripts/populate-users.js
   ```

2. **Done!** The script will create:
   - `test@test.com` (password: `test123`) - Regular User
   - `admin@test.com` (password: `admin123`) - Admin User

### What the script does:
- ✅ Creates Firebase Authentication users
- ✅ Creates Firestore user documents
- ✅ Sets up proper roles (user/admin)
- ✅ Adds all required fields

---

## Option 2: Manual Setup via Firebase Console 📝

If you prefer to add users manually or the script doesn't work:

**See detailed instructions in:** `.agent/Manual_User_Setup.md`

### Quick Steps:
1. Go to Firebase Console → Authentication
2. Add users with email/password
3. Copy each user's UID
4. Go to Firestore Database
5. Create `users` collection
6. Add documents with the UIDs and user data

---

## Test Credentials

After setup, login with:

### Regular User:
- **Email:** `test@test.com`
- **Password:** `test123`
- **Redirects to:** `/user/dashboard`

### Admin User:
- **Email:** `admin@test.com`
- **Password:** `admin123`
- **Redirects to:** `/admin/dashboard`

---

## Troubleshooting

### Script fails with "auth/email-already-in-use"
- Users already exist, you're good to go!
- Try logging in with the credentials above

### Script fails with "CONFIGURATION_NOT_FOUND"
- Make sure you've enabled Authentication in Firebase Console
- See `.agent/Firebase_Setup_Guide.md` for setup instructions

### Can't login after creating users
- Make sure the Firestore document ID matches the Firebase Auth UID
- Check that `user_role` is set to either "user" or "admin"
- Verify `is_active` is set to `true`

---

## Next Steps

After adding users:
1. ✅ Try logging in at `http://localhost:5173/sign-in`
2. ✅ Test role-based routing (user vs admin)
3. ✅ Check user profile page
4. ✅ Test logout functionality
