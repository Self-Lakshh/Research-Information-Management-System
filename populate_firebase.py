import firebase_admin
from firebase_admin import credentials, firestore, auth
from datetime import datetime
import sys

# Initialize Firebase Admin SDK
# Ensure the service account JSON file is in the same directory or provide the full path
service_account_path = 'spsu-rims-firebase-adminsdk-fbsvc-228ecc4d45.json'

try:
    cred = credentials.Certificate(service_account_path)
    firebase_admin.initialize_app(cred)
    print("✅ Firebase Admin SDK initialized successfully!\n")
except Exception as e:
    print(f"❌ Error initializing Firebase: {e}")
    print(f"⚠️  Make sure '{service_account_path}' exists in the project root")
    sys.exit(1)

db = firestore.client()

def delete_collection(coll_ref, batch_size=10):
    """Delete all documents in a collection"""
    docs = coll_ref.limit(batch_size).stream()
    deleted = 0

    for doc in docs:
        doc.reference.delete()
        deleted = deleted + 1

    if deleted >= batch_size:
        return delete_collection(coll_ref, batch_size)

def create_auth_user(email, password, display_name):
    """Create Firebase Authentication user"""
    try:
        # Check if user already exists
        try:
            existing_user = auth.get_user_by_email(email)
            print(f"⚠️  Auth user {email} already exists (UID: {existing_user.uid})")
            return existing_user.uid
        except auth.UserNotFoundError:
            # User doesn't exist, create new one
            user = auth.create_user(
                email=email,
                password=password,
                display_name=display_name,
                email_verified=True
            )
            print(f"✅ Created Auth user: {email} (UID: {user.uid})")
            return user.uid
    except Exception as e:
        print(f"❌ Error creating auth user {email}: {e}")
        return None

def populate_test_users():
    """Create test users with Firebase Auth and Firestore documents"""
    print("🚀 Creating test users...\n")
    
    # Test users configuration
    test_users = [
        {
            'email': 'test@test.com',
            'password': 'test123',
            'name': 'Test User',
            'user_role': 'user',
            'phone_number': '+1234567890',
            'address': '123 Test Street, Test City',
            'designation': 'Assistant Professor',
            'department': 'Computer Science',
        },
        {
            'email': 'admin@test.com',
            'password': 'admin123',
            'name': 'Admin User',
            'user_role': 'admin',
            'phone_number': '+1234567891',
            'address': '456 Admin Avenue, Admin City',
            'designation': 'Dean',
            'department': 'Administration',
        },
    ]
    
    created_users = []
    
    for user_data in test_users:
        # Create Firebase Auth user
        uid = create_auth_user(
            user_data['email'],
            user_data['password'],
            user_data['name']
        )
        
        if uid:
            # Create Firestore document
            firestore_data = {
                'uid': uid,
                'email': user_data['email'],
                'name': user_data['name'],
                'user_role': user_data['user_role'],
                'phone_number': user_data['phone_number'],
                'address': user_data['address'],
                'designation': user_data['designation'],
                'department': user_data['department'],
                'is_active': True,
                'created_at': firestore.SERVER_TIMESTAMP,
                'updated_at': firestore.SERVER_TIMESTAMP,
            }
            
            # Use UID as document ID
            db.collection('users').document(uid).set(firestore_data)
            print(f"✅ Created Firestore document for {user_data['email']}")
            print(f"   Role: {user_data['user_role']}")
            print(f"   Password: {user_data['password']}\n")
            
            created_users.append({
                'uid': uid,
                'email': user_data['email'],
                'password': user_data['password'],
                'role': user_data['user_role']
            })
    
    return created_users

def populate_all():
    """Populate all collections with sample data"""
    now = firestore.SERVER_TIMESTAMP
    
    print("\n📦 Populating sample data...\n")
    
    # First, create test users and get their UIDs
    users = populate_test_users()
    
    if len(users) < 2:
        print("❌ Failed to create required test users. Exiting...")
        return
    
    # Get user references
    user1_uid = users[0]['uid']  # test@test.com (user)
    user2_uid = users[1]['uid']  # admin@test.com (admin)
    
    user1_ref = db.document(f'users/{user1_uid}')
    user2_ref = db.document(f'users/{user2_uid}')
    
    # Sample data for other collections
    collections_data = {
        'ipr': [
            {
                "faculty_ref": user1_ref,
                "application_no": "IPR-2024-001",
                "title": "Smart Irrigation System",
                "inventors": ["Test User", "Admin User"],
                "applicants": ["SPSU University"],
                "country": "India",
                "published_date": "2024-05-20",
                "patent_type": "patent",
                "status": "published",
                "sources": [],
                "approval_status": "approved",
                "approval_action_by": user2_ref,
                "action_at": now,
                "created_at": now,
                "updated_at": now,
                "created_by": user1_ref,
            }
        ],
        'journals': [
            {
                "title_of_paper": "Advancements in Quantum Computing",
                "authors": [user1_ref, user2_ref],
                "journal_name": "IEEE Quantum",
                "journal_type": "International",
                "date_of_publication": "2024-01-15",
                "ISSN_number": "1234-567X",
                "web_link": "https://doi.org/10.1234/iqc.2024.01",
                "sources": [],
                "approval_status": "approved",
                "approval_action_by": user2_ref,
                "action_at": now,
                "created_at": now,
                "updated_at": now,
                "created_by": user1_ref,
            }
        ],
        'conferences': [
            {
                "authors": [user1_ref],
                "title_of_paper": "Edge Computing in IoT",
                "title_of_proceedings_of_conference": "Proceedings of IC-IoT 2024",
                "name_of_conference": "International Conference on IoT",
                "origin": "International",
                "year_of_publication": "2024",
                "isbn_issn_number": "978-3-16-148410-0",
                "name_of_publisher": "Springer",
                "sources": [],
                "approval_status": "pending",
                "created_at": now,
                "updated_at": now,
                "created_by": user1_ref,
            }
        ],
        'books': [
            {
                "author": user1_ref,
                "title_of_book": "Introduction to Modern Cryptography",
                "date_of_publication": "2023-11-10",
                "ISBN_number": "978-0136081760",
                "publisher_name": "Pearson",
                "sources": [],
                "approval_status": "approved",
                "approval_action_by": user2_ref,
                "action_at": now,
                "created_at": now,
                "updated_at": now,
                "created_by": user1_ref,
            }
        ],
        'consultancy_projects': [
            {
                "project_title": "AI-Driven Smart Grid Management",
                "amount": "5,000,000 INR",
                "organization": "National Smart Grid Mission",
                "organization_url": "https://nsgm.gov.in",
                "principal_investigator_ref": user1_ref,
                "co_investigators_refs": [user2_ref],
                "institution": "SPSU",
                "duration": "24 Months",
                "grant_date": "2024-03-01",
                "status": "ongoing",
                "sources": [],
                "approval_status": "approved",
                "approval_action_by": user2_ref,
                "action_at": now,
                "created_at": now,
                "updated_at": now,
                "created_by": user1_ref,
            }
        ],
        'awards': [
            {
                "award_name": "Best Researcher Award 2024",
                "title": "Excellence in Innovation",
                "recipient_ref": user1_ref,
                "institution_body": "IEEE India Council",
                "country": "India",
                "month_year": "January 2024",
                "sources": [],
                "approval_status": "approved",
                "approval_action_by": user2_ref,
                "action_at": now,
                "created_at": now,
                "updated_at": now,
                "created_by": user1_ref,
            }
        ],
        'phd_students': [
            {
                "name": "Alice Johnson",
                "faculty_ref": user1_ref,
                "supervisor_type": "Main Supervisor",
                "name_of_student": "Alice Johnson",
                "enrollment_number": "PHD12345",
                "phd_stream": "Machine Learning",
                "sources": [],
                "approval_status": "approved",
                "approval_action_by": user2_ref,
                "action_at": now,
                "created_at": now,
                "updated_at": now,
                "created_by": user1_ref,
            }
        ],
        'other_events': [
            {
                "type": "FDP",
                "topic_title": "Deep Learning and its Applications",
                "organization": "IIT Bombay",
                "date": "2024-06-10",
                "role": "Participant",
                "involved_faculty_refs": [user1_ref],
                "sources": [],
                "approval_status": "approved",
                "approval_action_by": user2_ref,
                "action_at": now,
                "created_at": now,
                "updated_at": now,
                "created_by": user1_ref,
            }
        ],
    }
    
    # Populate collections
    for collection_name, docs in collections_data.items():
        print(f"📝 Populating collection: {collection_name}...")
        for doc in docs:
            db.collection(collection_name).add(doc)
        print(f"✅ Added {len(docs)} document(s) to {collection_name}\n")

if __name__ == "__main__":
    try:
        print("=" * 60)
        print("🔥 RIMS Firebase Population Script")
        print("=" * 60)
        
        # Create test users
        users = populate_test_users()
        
        # Ask if user wants to populate sample data
        print("\n" + "=" * 60)
        response = input("Do you want to populate sample data? (y/n): ").lower()
        
        if response == 'y':
            populate_all()
        
        print("\n" + "=" * 60)
        print("✨ Database population complete!")
        print("=" * 60)
        print("\n📝 Test Credentials:")
        print("━" * 60)
        for user in users:
            print(f"\n{user['role'].upper()}:")
            print(f"  Email: {user['email']}")
            print(f"  Password: {user['password']}")
            print(f"  UID: {user['uid']}")
        print("\n" + "━" * 60)
        print("\n🚀 You can now login at: http://localhost:5173/sign-in\n")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
