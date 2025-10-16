"""
Delete Test Firebase Accounts
This script will delete the test accounts and keep only manojmnj007@gmail.com
"""

import firebase_admin
from firebase_admin import credentials, auth, firestore

# Account to preserve
PRESERVE_EMAIL = 'manojmnj007@gmail.com'
PRESERVE_UID = 'XNVLf62u6pOiD97Mpsr0rCM8NM23'

# Accounts to delete
DELETE_ACCOUNTS = [
    {
        'email': 'gtharun@unschooling.in',
        'uid': 'CfQRbWsLstZ2oiXCbitnYV4QB0B2',
        'children_count': 6
    },
    {
        'email': 'gtharun04@gmail.com',
        'uid': 'K4hCLJm3xPNO1npC1sQiJjDs8Xm1',
        'children_count': 3
    }
]

def delete_user_and_data(db, user_uid, user_email):
    """Delete user from Auth and all their Firestore data"""
    try:
        # Get and delete all children first
        children_ref = db.collection(f'users/{user_uid}/children')
        children_docs = list(children_ref.stream())
        
        print(f'   📂 Found {len(children_docs)} children profiles')
        for child_doc in children_docs:
            child_data = child_doc.to_dict()
            child_name = child_data.get('child_name', child_doc.id)
            child_doc.reference.delete()
            print(f'      ✅ Deleted child: {child_name}')
        
        # Delete user profile from Firestore
        user_ref = db.collection('users').document(user_uid)
        user_ref.delete()
        print(f'   ✅ Deleted Firestore user profile')
        
        # Delete user from Firebase Auth
        auth.delete_user(user_uid)
        print(f'   ✅ Deleted Firebase Auth account')
        
        return True
        
    except Exception as e:
        print(f'   ❌ Error: {e}')
        return False

def main():
    try:
        # Initialize Firebase Admin
        print('🔄 Connecting to Firebase...')
        cred = credentials.Certificate('google-sheets-service-account.json')
        firebase_admin.initialize_app(cred)
        print('✅ Connected successfully!\n')
        
        db = firestore.client()
        
        print('='*80)
        print('🗑️  DELETING TEST ACCOUNTS')
        print('='*80)
        
        print(f'\n✅ PRESERVING: {PRESERVE_EMAIL}\n')
        print(f'⚠️  DELETING {len(DELETE_ACCOUNTS)} accounts:\n')
        
        for account in DELETE_ACCOUNTS:
            print(f'   • {account["email"]} ({account["children_count"]} children)')
        
        print('\n' + '='*80 + '\n')
        
        # Delete each account
        success_count = 0
        total_children_deleted = 0
        
        for account in DELETE_ACCOUNTS:
            print(f'🗑️  Deleting: {account["email"]}')
            
            if delete_user_and_data(db, account['uid'], account['email']):
                success_count += 1
                total_children_deleted += account['children_count']
                print(f'   ✅ Successfully deleted account and all data\n')
            else:
                print(f'   ❌ Failed to delete account\n')
        
        # Verify remaining accounts
        print('='*80)
        print('🔍 VERIFYING REMAINING ACCOUNTS')
        print('='*80 + '\n')
        
        page = auth.list_users()
        remaining_users = list(page.users)
        
        print(f'📊 Total remaining accounts: {len(remaining_users)}\n')
        
        for user in remaining_users:
            print(f'✅ {user.email}')
            print(f'   Display Name: {user.display_name}')
            print(f'   UID: {user.uid}\n')
        
        # Summary
        print('='*80)
        print('🎉 CLEANUP COMPLETE!')
        print('='*80)
        print(f'✅ Accounts deleted: {success_count}')
        print(f'✅ Children profiles deleted: {total_children_deleted}')
        print(f'✅ Remaining accounts: {len(remaining_users)}')
        print('='*80 + '\n')
        
    except Exception as e:
        print(f'❌ Error: {e}')
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()

