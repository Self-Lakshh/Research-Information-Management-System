import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import datetime

# 1. Setup Firebase Admin SDK
# Path to your service account key file
cred_path = 'secrets/spsu-rims-22efd-firebase-adminsdk-fbsvc-d26abb5119.json'
cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred)

db = firestore.client()

# 2. Users data to populate
users_to_add = [
    {
        "uid": "0sYks2ccHBU4vd8nrqB1oaY8dIL2",
        "email": "harish.tiwari@spsu.ac.in",
        "name": "Harish Tiwari",
        "user_role": "user",
    },
    {
        "uid": "qkvRBasJ22ZoC154Hvgxi2J9uAs1",
        "email": "rahul.kumar@spsu.ac.in",
        "name": "Rahul Kumar",
        "user_role": "user",
    },
    {
        "uid": "8yWhIbeYXiZ2zvD3mWFmfA1pAr93",
        "email": "dean.fci@spsu.ac.in",
        "name": "Dean FCI",
        "user_role": "user",
    },
    {
        "uid": "cNC8be0UhdTbtlbbGw0pWHUbgcZ2",
        "email": "chandani.joshi@spsu.ac.in",
        "name": "Chandani Joshi",
        "user_role": "user",
    }
]

def populate_users():
    print(f"--- Starting Population of {len(users_to_add)} users ---")
    
    for user in users_to_add:
        uid = user['uid']
        user_data = {
            "uid": uid,
            "email": user['email'],
            "name": user['name'],
            "user_role": user['user_role'],
            "faculty": user.get('faculty', ''),
            "designation": user.get('designation', ''),
            "phone_number": "",
            "address": "",
            "is_active": True,
            "created_at": firestore.SERVER_TIMESTAMP,
            "updated_at": firestore.SERVER_TIMESTAMP
        }
        
        # Create or update the document in 'users' collection
        db.collection('users').document(uid).set(user_data, merge=True)
        print(f"✓ Created/Updated user: {user['name']} ({uid})")

    print("--- Population Complete ---")

if __name__ == "__main__":
    populate_users()
