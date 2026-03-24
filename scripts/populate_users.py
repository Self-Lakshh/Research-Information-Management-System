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
        "uid": "r16NZRpyVgfI7UoeHfmGqrxiYxm1",
        "email": "emmanueldaanoba.sunkari@spsu.ac.in",
        "name": "Dr. Emmanuel Daanoba Sunkari",
        "user_role": "user",
    },
    {
        "uid": "AP6uUNxOelOd1BeFYndN6EBdeW72",
        "email": "pankaj.rastogi@spsu.ac.in",
        "name": "Dr. Pankaj Mohan Rastogi",
        "user_role": "user",
    },
    {
        "uid": "xJdIW5IEaebl6XKH01WeerFz8qs1",
        "email": "avinash.ojha@spsu.ac.in",
        "name": "Dr. Avinash Ojha",
        "user_role": "user",
    },
    {
        "uid": "8jx4KmQ35ydyiq5wu7ea4hwB4Dd2",
        "email": "manish.dadhich@spsu.ac.in",
        "name": "Dr. Manish Dadhich",
        "user_role": "user",
    },
    {
        "uid": "W2MchdrVO9VQ2wQjki8jEBemLsy1",
        "email": "prasun.chakrabarti@spsu.ac.in",
        "name": "Prof. (Dr.) Prasun Chakrabarti",
        "user_role": "user",
    },
    {
        "uid": "9nibW5i0mPfLCCn5ObduW9rbFVv1",
        "email": "anand.bhaskar@spsu.ac.in",
        "name": "Dr. Anand A Bhaskar",
        "user_role": "user",
    },
    {
        "uid": "1SW5QCtOGzU7PewQjBWeEar57kh1",
        "email": "manish.tiwari@spsu.ac.in",
        "name": "Dr. Manish Tiwari",
        "user_role": "user",
    },
    {
        "uid": "7wd1oR044eh6DGBbKtOf0Q2eCWp2",
        "email": "brajesh.sharma@spsu.ac.in",
        "name": "Dr. Brajesh Kumar Sharma",
        "user_role": "user",
    },
    {
        "uid": "5pwyhN2Paygh1O03yixUu1lvZ0X2",
        "email": "manuj.joshi@spsu.ac.in",
        "name": "Dr. Manuj Joshi",
        "user_role": "user",
    },
    {
        "uid": "yzzWOWwNvzOQ9Ghl1z3AlaDvVp53",
        "email": "arun.vaishnav@spsu.ac.in",
        "name": "Dr. Arun Vaishnav",
        "user_role": "user",
    },
    {
        "uid": "OZL0yHa8ZQUFWFe48p5iwfq1bhi2",
        "email": "naveen.kumar@spsu.ac.in",
        "name": "Dr. Naveen Kumar",
        "user_role": "user",
    },
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
            "joining_date": "",
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
