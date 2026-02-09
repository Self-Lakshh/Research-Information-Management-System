import firebase_admin
from firebase_admin import credentials, firestore, auth
from datetime import datetime

# ==========================================
# CONFIGURATION
# ==========================================
# Path to your Firebase service account key file.
# You need to download this from Firebase Console -> Project Settings -> Service Accounts -> Generate new private key
# Place the downloaded JSON file in the project root and update the path below if needed.
SERVICE_ACCOUNT_KEY_PATH = "secrets/spsu-rims-firebase-adminsdk-fbsvc-228ecc4d45.json"

USER_EMAIL = "test@test.com"
USER_PASSWORD = "password"  # Set a default password
USER_NAME = "Test User"
USER_ROLE = "user"  # 'admin' or 'user'
USER_FACULTY = "FCI"  # Example faculty

def initialize_firebase():
    try:
        cred = credentials.Certificate(SERVICE_ACCOUNT_KEY_PATH)
        firebase_admin.initialize_app(cred)
        print("Firebase initialized successfully.")
    except Exception as e:
        print(f"Error initializing Firebase: {e}")
        print("Please ensure 'serviceAccountKey.json' exists and is valid.")
        exit(1)

def create_or_get_user():
    try:
        # Check if user exists in Authentication
        try:
            user = auth.get_user_by_email(USER_EMAIL)
            print(f"User {USER_EMAIL} already exists in Auth with UID: {user.uid}")
            return user.uid
        except auth.UserNotFoundError:
            print(f"User {USER_EMAIL} not found in Auth. Creating...")
            user = auth.create_user(
                email=USER_EMAIL,
                password=USER_PASSWORD,
                display_name=USER_NAME
            )
            print(f"User created in Auth with UID: {user.uid}")
            return user.uid

    except Exception as e:
        print(f"Error managing Auth user: {e}")
        exit(1)

def update_firestore_user(uid):
    db = firestore.client()
    user_ref = db.collection('users').document(uid)

    # Data structure matching your rims.types.ts User interface
    user_data = {
        "uid": uid,
        "name": USER_NAME,
        "email": USER_EMAIL,
        "user_role": USER_ROLE,
        "faculty": USER_FACULTY,
        "is_active": True,
        # Use server timestamp for consistency
        "created_at": firestore.SERVER_TIMESTAMP,
        "updated_at": firestore.SERVER_TIMESTAMP,
        # Optional fields
        "phone_number": "",
        "address": "",
        "designation": "Tester",
    }

    try:
        # Check if document exists to merge or set
        doc = user_ref.get()
        if doc.exists:
            print(f"Updating existing Firestore document for user {uid}...")
            # If updating, we might want to keep created_at, so let's exclude it from update if exists
            update_data = user_data.copy()
            del update_data["created_at"]
            user_ref.set(update_data, merge=True)
        else:
            print(f"Creating new Firestore document for user {uid}...")
            user_ref.set(user_data)
        
        print(f"Firestore user document successfully updated for {USER_EMAIL}.")
        print(f"Role: {USER_ROLE}, Active: True")

    except Exception as e:
        print(f"Error updating Firestore: {e}")
        exit(1)

if __name__ == "__main__":
    print(f"Starting script to create/restore user: {USER_EMAIL}")
    
    # 1. Initialize Firebase Admin SDK
    initialize_firebase()
    
    # 2. Get or Create Auth User
    uid = create_or_get_user()
    
    # 3. Create or Update Firestore Document
    update_firestore_user(uid)

    print("\nDone! prevent this script from being committed if it contains secrets.")
