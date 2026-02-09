# Run Firebase Population Script

## Quick Start

```bash
python populate_firebase.py
```

This will:
1. ✅ Create Firebase Authentication users
2. ✅ Create Firestore user documents with proper UIDs
3. ✅ Optionally populate sample data (IPR, journals, conferences, etc.)

---

## What Gets Created

### Test Users

**Regular User:**
- Email: `test@test.com`
- Password: `test123`
- Role: `user`
- Redirects to: `/user/dashboard`

**Admin User:**
- Email: `admin@test.com`
- Password: `admin123`
- Role: `admin`
- Redirects to: `/admin/dashboard`

### Sample Data (Optional)

If you choose to populate sample data, it will create:
- 1 IPR record
- 1 Journal publication
- 1 Conference paper
- 1 Book
- 1 Consultancy project
- 1 Award
- 1 PhD student record
- 1 Other event (FDP)

All sample records are linked to the test users created above.

---

## Prerequisites

### 1. Install Firebase Admin SDK

```bash
pip install firebase-admin
```

### 2. Download Service Account Key

1. Go to Firebase Console: https://console.firebase.google.com/project/spsu-rims
2. Click the gear icon → **Project Settings**
3. Go to **Service Accounts** tab
4. Click **Generate New Private Key**
5. Save the JSON file as `spsu-rims-firebase-adminsdk-fbsvc-228ecc4d45.json` in the project root

---

## Running the Script

```bash
# Make sure you're in the project root directory
cd f:\Github\Research-Information-Management-System

# Run the script
python populate_firebase.py
```

### Expected Output

```
============================================================
🔥 RIMS Firebase Population Script
============================================================

🚀 Creating test users...

✅ Created Auth user: test@test.com (UID: abc123...)
✅ Created Firestore document for test@test.com
   Role: user
   Password: test123

✅ Created Auth user: admin@test.com (UID: xyz789...)
✅ Created Firestore document for admin@test.com
   Role: admin
   Password: admin123

============================================================
Do you want to populate sample data? (y/n): y

📦 Populating sample data...

📝 Populating collection: ipr...
✅ Added 1 document(s) to ipr

📝 Populating collection: journals...
✅ Added 1 document(s) to journals

...

============================================================
✨ Database population complete!
============================================================

📝 Test Credentials:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

USER:
  Email: test@test.com
  Password: test123
  UID: abc123...

ADMIN:
  Email: admin@test.com
  Password: admin123
  UID: xyz789...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 You can now login at: http://localhost:5173/sign-in
```

---

## Troubleshooting

### Error: "No module named 'firebase_admin'"

Install the Firebase Admin SDK:
```bash
pip install firebase-admin
```

### Error: "Could not open service account file"

Make sure you've downloaded the service account key and saved it as:
`spsu-rims-firebase-adminsdk-fbsvc-228ecc4d45.json`

### Error: "User already exists"

The script will skip creating auth users that already exist and just update their Firestore documents.

### Error: "Permission denied"

Make sure:
1. Firebase Authentication is enabled
2. Firestore Database is created
3. Service account has proper permissions

---

## After Running

1. ✅ Go to http://localhost:5173/sign-in
2. ✅ Login with test credentials
3. ✅ Verify role-based routing works
4. ✅ Check user profile page
5. ✅ Test logout functionality

---

## Clean Up

To delete all data and start fresh, you can:

1. Go to Firebase Console → Firestore Database
2. Delete collections manually, or
3. Modify the script to call `delete_collection()` before populating

---

## Next Steps

After verifying login works:
1. Build record forms for users to submit data
2. Build admin portal for managing records
3. Implement approval workflow
4. Add file upload functionality
