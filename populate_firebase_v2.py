
import firebase_admin
from firebase_admin import credentials, firestore, auth
from datetime import datetime
import sys
import random
import os
import glob

# ==========================================
# CONFIGURATION
# ==========================================
PROJECT_ID = "spsu-rims-22efd"  # New Project ID

# Mapping of Schema Keys to Firestore Collection Names
# Adjust these if you want different collection names in Firestore
COLLECTION_MAP = {
    "user": "users",
    "media": "media",  # or 'media_files'
    "document": "documents", # Generic documents
    "IPR": "ipr",
    "PHD_Student_Data": "phd_students",
    "Journal": "journals",
    "Conference": "conferences",
    "Book": "books",
    "Consultancy_Project_Grants": "consultancy_projects",
    "Awards": "awards",
    "Others": "other_events"
}

# ==========================================
# INITIALIZATION
# ==========================================
def initialize_firebase():
    """Initializes Firebase Admin SDK."""
    # Try to find a JSON file in the secrets folder
    secret_files = glob.glob("secrets/*.json")
    service_account_path = None
    
    if secret_files:
        # Pick the first one found, or preferably one that matches the project ID if possible
        # For now, just pick the first one
        service_account_path = secret_files[0]
        print(f"🔑 Found service account key: {service_account_path}")
    else:
        # Fallback to the specific file mentioned previously if it exists
        default_path = 'secrets/spsu-rims-firebase-adminsdk-fbsvc-228ecc4d45.json' 
        if os.path.exists(default_path):
             service_account_path = default_path

    if not service_account_path or not os.path.exists(service_account_path):
        print("❌ Error: Could not find a service account JSON key in 'secrets/'.")
        print(f"Please place the service account key for project '{PROJECT_ID}' in the 'secrets/' folder.")
        sys.exit(1)

    try:
        cred = credentials.Certificate(service_account_path)
        # Check if app is already initialized to avoid errors on re-runs in interactive modes
        if not firebase_admin._apps:
            firebase_admin.initialize_app(cred)
        print("✅ Firebase Admin SDK initialized successfully!\n")
    except Exception as e:
        print(f"❌ Error initializing Firebase: {e}")
        sys.exit(1)

    return firestore.client()

db = initialize_firebase()

# ==========================================
# DATA GENERATORS
# ==========================================

def get_random_date():
    year = random.randint(2020, 2025)
    month = random.randint(1, 12)
    day = random.randint(1, 28)
    return datetime(year, month, day)

def create_users(count=5):
    """Creates dummy users and returns their Document References."""
    print(f"👤 Creating users...")
    user_refs = []
    
    # Specific users to create
    specific_users = [
        {
            "name": "Admin User",
            "email": "admin@test.com",
            "password": "admin123", # Password used for Auth creation
            "phone_number": "+919876543200",
            "address": "Admin Block, SPSU",
            "user_role": "admin",
            "designation": "Dean",
            "faculty": "Administration",
            "is_active": True,
            "profile_picture_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
        },
        {
            "name": "Test User",
            "email": "test@test.com",
            "password": "test123",
            "phone_number": "+919876543201",
            "address": "Faculty Quarters, SPSU",
            "user_role": "user",
            "designation": "Assistant Professor",
            "faculty": "FCI",
            "is_active": True,
            "profile_picture_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=test"
        }
    ]

    collection_name = COLLECTION_MAP["user"]
    
    # helper to create single user
    def create_single_user(user_data, password="password123"):
        uid = None
        # 1. Create/Get Auth User
        try:
            try:
                user_record = auth.get_user_by_email(user_data["email"])
                uid = user_record.uid
                print(f"   ℹ️ Auth user already exists: {user_data['email']}")
            except auth.UserNotFoundError:
                user_record = auth.create_user(
                    email=user_data["email"],
                    password=password,
                    display_name=user_data["name"],
                    email_verified=True
                )
                uid = user_record.uid
                print(f"   ✅ Created Auth user: {user_data['email']}")
        except Exception as e:
            print(f"   ❌ Error creating auth user {user_data['email']}: {e}")
            # Generate a random UID if auth fails so we can still make the firestore doc for testing?
            # Better to skip or use a fallback
            uid = f"user_{random.randint(10000, 99999)}"

        # 2. Add Firestore Metadata
        # Remove password field if it exists in data dict before saving to Firestore
        firestore_data = user_data.copy()
        if "password" in firestore_data:
            del firestore_data["password"]
            
        firestore_data["created_at"] = firestore.SERVER_TIMESTAMP
        firestore_data["updated_at"] = firestore.SERVER_TIMESTAMP
        
        doc_ref = db.collection(collection_name).document(uid)
        doc_ref.set(firestore_data)
        return doc_ref

    # Create specific users
    print("   --- Creating Specific Users ---")
    for u_data in specific_users:
        pwd = u_data.pop("password") 
        ref = create_single_user(u_data, pwd)
        user_refs.append(ref)

    # Create random users
    print(f"   --- Creating {count} Random Users ---")
    roles = ["admin", "user"]
    depts = ["FCI", "FOM", "FIAT", "FDLS"]
    
    for i in range(count):
        role = random.choice(roles)
        dept = random.choice(depts)
        
        u_data = {
            "name": f"Random User {i+1}",
            "email": f"random{i+1}_{random.randint(100,999)}@example.com",
            "phone_number": f"+919876543{random.randint(100,999)}",
            "address": f"{random.randint(1, 100)} Random St, City",
            "user_role": role,
            "designation": "Professor" if role == "user" else "Staff",
            "faculty": dept,
            "is_active": True,
            "profile_picture_url": f"https://api.dicebear.com/7.x/avataaars/svg?seed={i}"
        }
        ref = create_single_user(u_data, "password123")
        user_refs.append(ref)
        
    print(f"✅ Total users created/updated: {len(user_refs)}")
    return user_refs

def create_common_fields(user_ref):
    """Returns common fields like created_by, updated_by, approval_status."""
    return {
        "approval_status": random.choice(["approved", "pending", "rejected"]),
        "approval_action_by": user_ref, # Self-approval for dummy data
        "action_at": firestore.SERVER_TIMESTAMP,
        "created_at": firestore.SERVER_TIMESTAMP,
        "updated_at": firestore.SERVER_TIMESTAMP,
        "created_by": user_ref,
        "updated_by": user_ref,
        "sources": [] # Array of media refs
    }

def populate_data(user_refs):
    if not user_refs:
        print("⚠️ No users created. Skipping data population.")
        return

    # Helper to pick a random user ref
    def get_random_user():
        return random.choice(user_refs)

    # --- IPR ---
    print("Creating IPR records...")
    for _ in range(5):
        user = get_random_user()
        data = {
            "faculty_ref": user,
            "application_no": f"IPR-{random.randint(10000, 99999)}",
            "title": f"Novel Method for {random.choice(['AI', 'IoT', 'Blockchain'])}",
            "inventors": [user, get_random_user()],
            "applicants": ["SPSU"],
            "country": "India",
            "published_date": get_random_date(),
            "patent_type": random.choice(["patent", "design", "copyright"]),
            "status": "published",
            **create_common_fields(user)
        }
        db.collection(COLLECTION_MAP["IPR"]).add(data)

    # --- PHD Student Data ---
    print("Creating Ph.D. Student records...")
    for _ in range(5):
        user = get_random_user()
        data = {
            "name": f"Student {random.randint(100, 999)}",
            "faculty_ref": user,
            "supervisor_type": "Main Supervisor",
            "name_of_student": f"Student {random.randint(100, 999)}",
            "enrollment_number": f"PHD-{random.randint(1000, 9999)}",
            "phd_stream": "Computer Science",
            **create_common_fields(user)
        }
        db.collection(COLLECTION_MAP["PHD_Student_Data"]).add(data)

    # --- Journals ---
    print("Creating Journal records...")
    for _ in range(5):
        user = get_random_user()
        data = {
            "title_of_paper": f"Analysis of {random.choice(['Data', 'Algorithms', 'Networks'])}",
            "aurthors": [user, get_random_user()], # Note: 'aurthors' typo in schema, keeping it if strict, but correcting to 'authors' is better. 
                                                   # Schema said "aurthors". I will use "authors" to be kind, but maybe I should stick to schema?
                                                   # Let's use "authors" (correct spelling) as 'aurthors' is likely a typo in the jsonl.
            "authors": [user, get_random_user()],
            "journal_name": f"International Journal of {random.choice(['Science', 'Technology'])}",
            "journal_type": "International",
            "date_of_publication": get_random_date(),
            "ISSN_number": f"{random.randint(1000, 9999)}-{random.randint(1000, 9999)}",
            "web_link": "https://example.com/paper",
            **create_common_fields(user)
        }
        db.collection(COLLECTION_MAP["Journal"]).add(data)

    # --- Conferences ---
    print("Creating Conference records...")
    for _ in range(5):
        user = get_random_user()
        data = {
            "authors": [user],
            "title_of_paper": f"Conference Paper on {random.choice(['AI', 'ML'])}",
            "title_of_proceedings_of_conference": "Proc. of Int. Conf.",
            "name_of_conference": "ICCS 2024",
            "origin": "International",
            "year_of_publication": "2024", 
            "isbn_issn_number": "978-3-16-148410-0",
            "name_of_publisher": "Springer",
            **create_common_fields(user)
        }
        db.collection(COLLECTION_MAP["Conference"]).add(data)

    # --- Books ---
    print("Creating Book records...")
    for _ in range(3):
        user = get_random_user()
        data = {
            "author": user,
            "title_of_book": f"Fundamentals of {random.choice(['Coding', 'Design'])}",
            "date_of_publication": get_random_date(),
            "ISBN_number": f"978-{random.randint(100, 999)}-{random.randint(10000, 99999)}",
            "publisher_name": "Pearson",
            **create_common_fields(user)
        }
        db.collection(COLLECTION_MAP["Book"]).add(data)

    # --- Consultancy Projects ---
    print("Creating Consultancy Project records...")
    for _ in range(3):
        user = get_random_user()
        data = {
            "project_title": "Smart City Implementation",
            "amount": "1000000",
            "organization": "Govt of India",
            "organization_url": "https://india.gov.in",
            "principal_investigator_ref": user,
            "co_investigators_refs": [get_random_user()],
            "institution": "SPSU",
            "duration": "2 Years",
            "grant_date": get_random_date(),
            "status": "ongoing",
            **create_common_fields(user)
        }
        db.collection(COLLECTION_MAP["Consultancy_Project_Grants"]).add(data)

    # --- Awards ---
    print("Creating Award records...")
    for _ in range(3):
        user = get_random_user()
        data = {
            "award_name": "Best Researcher",
            "title": "Innovation in AI",
            "recipient_ref": user,
            "institution_body": "IEEE",
            "country": "USA",
            "month_year": "Jan 2024",
            **create_common_fields(user)
        }
        db.collection(COLLECTION_MAP["Awards"]).add(data)

    # --- Others ---
    print("Creating Other Events records...")
    for _ in range(3):
        user = get_random_user()
        data = {
            "type": random.choice(["FDP", "Seminar", "Workshop"]),
            "topic_title": "Deep Learning Workshop",
            "organization": "IIT Delhi",
            "date": get_random_date(),
            "role": "Participant",
            "involved_faculty_refs": [user],
            **create_common_fields(user)
        }
        db.collection(COLLECTION_MAP["Others"]).add(data)

    print("\n✨ Database population complete with V2 structure!")

if __name__ == "__main__":
    if PROJECT_ID not in COLLECTION_MAP.values() and "spsu-rims" in str(db.project):
         # Just a sanity check print
         pass
         
    print(f"🚀 Starting population script for project: {PROJECT_ID}")
    
    # Confirm
    # conf = input(f"Are you sure you want to populate '{PROJECT_ID}'? (y/n): ")
    # if conf.lower() != 'y':
    #     sys.exit(0)

    users = create_users()
    populate_data(users)
