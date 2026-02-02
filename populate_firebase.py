import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime

# Initialize Firebase Admin SDK
# Ensure the service account JSON file is in the same directory or provide the full path
service_account_path = 'spsu-rims-firebase-adminsdk-fbsvc-228ecc4d45.json'
cred = credentials.Certificate(service_account_path)
firebase_admin.initialize_app(cred)

db = firestore.client()

def delete_collection(coll_ref, batch_size=10):
    docs = coll_ref.limit(batch_size).stream()
    deleted = 0

    for doc in docs:
        doc.reference.delete()
        deleted = deleted + 1

    if deleted >= batch_size:
        return delete_collection(coll_ref, batch_size)

def populate_all():
    now = datetime.now().isoformat()
    
    # User emails to use as IDs and references
    user1_email = "john.doe@example.com"
    user2_email = "jane.smith@example.com"
    
    # Document References
    user1_ref = db.document(f'users/{user1_email}')
    user2_ref = db.document(f'users/{user2_email}')

    # 1. Refresh Users
    users_data = {
        user1_email: {
            "name": "John Doe",
            "email": user1_email,
            "phone_number": "+1234567890",
            "address": "123 Main St, Springfield",
            "user_role": "admin",
            "designation": "Professor",
            "department": "Computer Science",
            "is_active": True,
            "created_at": now,
            "updated_at": now,
            "profile_picture_url": "https://example.com/profiles/johndoe.jpg",
            "profile_picture_media": "default_ref"
        },
        user2_email: {
            "name": "Jane Smith",
            "email": user2_email,
            "phone_number": "+0987654321",
            "address": "456 Oak Ave, Metropolis",
            "user_role": "user",
            "designation": "Assistant Professor",
            "department": "Physics",
            "is_active": True,
            "created_at": now,
            "updated_at": now,
            "profile_picture_url": "https://example.com/profiles/janesmith.jpg",
            "profile_picture_media": "default_ref"
        }
    }

    print("Refreshing 'users' collection...")
    delete_collection(db.collection('users'))
    for email, data in users_data.items():
        db.collection('users').document(email).set(data)

    # Define other collections with Document References
    collections_data = {
        'media': [
            {
                "media_name": "Event Photo 1",
                "media_type": "event",
                "media_url": "https://example.com/media/event1.jpg",
                "uploaded_by": user1_ref,
                "uploaded_at": now,
                "status": "active"
            }
        ],
        'documents': [
            {
                "document_name": "Research Proposal 2024",
                "document_type": "journal",
                "file_url": "https://example.com/docs/proposal.pdf",
                "description": "Initial proposal for AI research",
                "status": "approved",
                "reviewed_by": user1_ref,
                "review_date": now,
                "uploaded_by": user2_ref,
                "upload_date": now,
                "created_at": now
            }
        ],
        'IPR': [
            {
                "faculty_ref": user2_ref,
                "application_no": "IPR-2024-001",
                "title": "Smart Irrigation System",
                "inventors": ["John Doe", "Jane Smith"],
                "applicants": ["SPSU University"],
                "country": "India",
                "published_date": "2024-05-20",
                "patent_type": "patent",
                "status": "published",
                "sources": ["doc_ref_1"],
                "approval_status": "approved",
                "approval_action_by": user1_ref,
                "action_at": now,
                "created_at": now,
                "updated_at": now,
                "created_by": user2_ref,
                "updated_by": user2_ref
            }
        ],
        'PHD_Student_Data': [
            {
                "name": "Alice Johnson",
                "faculty_ref": user2_ref,
                "supervisor_type": "Main Supervisor",
                "name_of_student": "Alice Johnson",
                "enrollment_number": "PHD12345",
                "phd_stream": "Machine Learning",
                "created_at": now,
                "updated_at": now,
                "created_by": user1_ref,
                "updated_by": user1_ref
            }
        ],
        'Journal': [
            {
                "title_of_paper": "Advancements in Quantum Computing",
                "aurthors": [user2_ref, user1_ref],
                "journal_name": "IEEE Quantum",
                "journal_type": "International",
                "date_of_publication": "2024-01-15",
                "ISSN_number": "1234-567X",
                "web_link": "https://doi.org/10.1234/iqc.2024.01",
                "source": ["doc_ref_2"],
                "approval_status": "approved",
                "approval_action_by": user1_ref,
                "action_at": now,
                "created_at": now,
                "updated_at": now,
                "created_by": user2_ref,
                "updated_by": user2_ref
            }
        ],
        'Conference': [
            {
                "authors": [user2_ref],
                "title_of_paper": "Edge Computing in IoT",
                "title_of_proceedings_of_conference": "Proceedings of IC-IoT 2024",
                "name_of_conference": "International Conference on IoT",
                "origin": "International",
                "year_of_publication": "2024",
                "ISBN/ISSN number of the proceeding": "978-3-16-148410-0",
                "name_of_publisher": "Springer",
                "source": ["doc_ref_3"],
                "approval_status": "pending",
                "approval_action_by": None,
                "action_at": None,
                "created_at": now,
                "updated_at": now,
                "created_by": user2_ref,
                "updated_by": user2_ref
            }
        ],
        'Book': [
            {
                "author": "Dr. Robert Wilson",
                "title_of_book": "Introduction to Modern Cryptography",
                "date_of_publication": "2023-11-10",
                "ISBN_number": "978-0136081760",
                "publisher_name": "Pearson",
                "sources": ["doc_ref_4"],
                "approval_status": "approved",
                "approval_action_by": user1_ref,
                "action_at": now,
                "created_at": now,
                "updated_at": now,
                "created_by": user1_ref,
                "updated_by": user1_ref
            }
        ],
        'Consultancy_Project_Grants': [
            {
                "project_title": "AI-Driven Smart Grid Management",
                "amount": "5,000,000 INR",
                "organization": "National Smart Grid Mission",
                "organization_url": "https://nsgm.gov.in",
                "principal_investigator_ref": user2_ref,
                "co_investigators_refs": [user1_ref],
                "institution": "SPSU",
                "duration": "24 Months",
                "grant_date": "2024-03-01",
                "status": "ongoing",
                "sources": ["grant_letter_ref"],
                "approval_status": "approved",
                "approval_action_by": user1_ref,
                "action_at": now,
                "created_at": now,
                "updated_at": now,
                "created_by": user2_ref,
                "updated_by": user2_ref
            }
        ],
        'Awards': [
            {
                "award_name": "Best Researcher Award 2024",
                "title": "Excellence in Innovation",
                "recipient_ref": user2_ref,
                "institution_body": "IEEE India Council",
                "country": "India",
                "month_year": "January 2024",
                "sources": ["award_cert_ref"],
                "approval_status": "approved",
                "approval_action_by": user1_ref,
                "action_at": now,
                "created_at": now,
                "updated_at": now,
                "created_by": user2_ref,
                "updated_by": user2_ref
            }
        ],
        'Others': [
            {
                "type": "FDP",
                "topic_title": "Deep Learning and its Applications",
                "organization": "IIT Bombay",
                "date": "2024-06-10",
                "role": "Participant",
                "involved_faculty_refs": [user2_ref],
                "sources": ["certificate_ref"],
                "approval_status": "approved",
                "approval_action_by": user1_ref,
                "action_at": now,
                "created_at": now,
                "updated_at": now,
                "created_by": user2_ref,
                "updated_by": user2_ref
            }
        ]
    }

    for collection_name, docs in collections_data.items():
        print(f"Refreshing collection: {collection_name}...")
        delete_collection(db.collection(collection_name))
        for doc in docs:
            db.collection(collection_name).add(doc)

if __name__ == "__main__":
    try:
        populate_all()
        print("\nAll collections refreshed with Firebase References successfully!")
    except Exception as e:
        print(f"Error: {e}")
