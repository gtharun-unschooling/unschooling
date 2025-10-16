"""
Delete Anonymous Firebase Accounts
This script will delete all anonymous users from Firebase Authentication
while preserving the real Google Sign-In accounts.
"""

import firebase_admin
from firebase_admin import credentials, auth, firestore

# List of emails to preserve (real accounts)
PRESERVE_EMAILS = [
    'gtharun@unschooling.in',
    'gtharun04@gmail.com',
    'manojmnj007@gmail.com'
]

def main():
    try:
        # Initialize Firebase Admin
        print('🔄 Connecting to Firebase...')
        cred = credentials.Certificate('google-sheets-service-account.json')
        firebase_admin.initialize_app(cred)
        print('✅ Connected successfully!\n')
        
        db = firestore.client()
        
        # Get all users from Firebase Authentication
        print('📊 Fetching all users from Firebase Authentication...')
        page = auth.list_users()
        all_users = list(page.users)
        
        # Continue fetching if there are more pages
        while page.next_page_token:
            page = auth.list_users(page_token=page.next_page_token)
            all_users.extend(page.users)
        
        print(f'✅ Found {len(all_users)} total users in Firebase Auth\n')
        
        # Identify anonymous users (no email or anonymous provider)
        anonymous_users = []
        preserved_users = []
        
        for user in all_users:
            # Check if user should be preserved
            if user.email and user.email in PRESERVE_EMAILS:
                preserved_users.append(user)
                print(f'✅ PRESERVING: {user.email} ({user.uid})')
            # Check if user is anonymous
            elif not user.email or len(user.provider_data) == 0:
                anonymous_users.append(user)
            else:
                # Other users without preserved emails
                anonymous_users.append(user)
        
        print(f'\n📊 Analysis:')
        print(f'   Accounts to PRESERVE: {len(preserved_users)}')
        print(f'   Accounts to DELETE: {len(anonymous_users)}')
        
        if not anonymous_users:
            print('\n✅ No anonymous accounts to delete!')
            return
        
        # Ask for confirmation
        print(f'\n⚠️  WARNING: This will delete {len(anonymous_users)} accounts!')
        print('   The following emails will be PRESERVED:')
        for email in PRESERVE_EMAILS:
            print(f'   ✅ {email}')
        
        response = input('\n❓ Do you want to proceed with deletion? (type "DELETE" to confirm): ')
        
        if response != 'DELETE':
            print('\n❌ Deletion cancelled.')
            return
        
        # Delete anonymous users
        print(f'\n🗑️  Deleting {len(anonymous_users)} anonymous accounts...\n')
        deleted_count = 0
        error_count = 0
        
        for user in anonymous_users:
            try:
                # Delete from Firebase Auth
                auth.delete_user(user.uid)
                
                # Also try to delete from Firestore if exists
                try:
                    user_ref = db.collection('users').document(user.uid)
                    user_ref.delete()
                except:
                    pass  # User might not exist in Firestore
                
                deleted_count += 1
                if user.email:
                    print(f'✅ Deleted: {user.email} ({user.uid})')
                else:
                    print(f'✅ Deleted: Anonymous user ({user.uid})')
                    
            except Exception as e:
                error_count += 1
                print(f'❌ Error deleting {user.uid}: {e}')
        
        # Summary
        print(f'\n' + '='*80)
        print(f'🎉 DELETION COMPLETE!')
        print(f'='*80)
        print(f'✅ Successfully deleted: {deleted_count} accounts')
        print(f'❌ Errors: {error_count}')
        print(f'✅ Preserved: {len(preserved_users)} accounts')
        print(f'\n📊 Remaining accounts:')
        for user in preserved_users:
            print(f'   ✅ {user.email}')
        print('='*80 + '\n')
        
    except Exception as e:
        print(f'❌ Error: {e}')
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()

