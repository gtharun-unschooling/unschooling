"""
Firebase Service for connecting to Firestore
"""

import os
import logging
from typing import Dict, List, Any, Optional
import firebase_admin
from firebase_admin import credentials, firestore
from config.settings import Settings

logger = logging.getLogger(__name__)

class FirebaseService:
    """Service for interacting with Firebase Firestore."""
    
    def __init__(self):
        self.db = None
        self.initialized = False
        self._initialize_firebase()
    
    def _initialize_firebase(self):
        """Initialize Firebase Admin SDK."""
        try:
            # Check if Firebase is already initialized
            if firebase_admin._apps:
                logger.info("🔥 Firebase already initialized, reusing existing app")
                self.db = firestore.client()
                self.initialized = True
                return
            
            # Get Firebase configuration
            settings = Settings()
            firebase_config = settings.get_firebase_config()
            
            # Use default credentials (for local development with gcloud auth)
            cred = credentials.ApplicationDefault()
            logger.info("🔥 Using default application credentials")
            
            # Initialize Firebase Admin
            app = firebase_admin.initialize_app(cred, {
                'projectId': firebase_config['projectId']
            })
            
            # Get Firestore client
            self.db = firestore.client()
            self.initialized = True
            
            logger.info("🔥 Firebase Admin SDK initialized successfully")
            logger.info(f"🔥 Project ID: {firebase_config['projectId']}")
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize Firebase: {e}")
            self.initialized = False
    
    def get_all_users(self) -> List[Dict[str, Any]]:
        """Get all users from Firestore."""
        if not self.initialized or not self.db:
            logger.error("❌ Firebase not initialized")
            return []
        
        try:
            users = []
            # Get all user documents from the users collection
            users_ref = self.db.collection('users')
            docs = users_ref.stream()
            
            for doc in docs:
                user_data = doc.to_dict()
                # Use UID as display name if no email/displayName
                display_name = user_data.get('email') or user_data.get('displayName') or doc.id
                users.append({
                    'uid': doc.id,
                    'email': user_data.get('email', ''),
                    'displayName': display_name,
                    'created_at': user_data.get('created_at', ''),
                    'last_login': user_data.get('last_login', ''),
                    'children_count': 0  # Will be updated below
                })
            
            logger.info(f"📊 Found {len(users)} users in Firestore")
            return users
            
        except Exception as e:
            logger.error(f"❌ Error getting users from Firestore: {e}")
            return []
    
    def get_user_children(self, user_uid: str) -> List[Dict[str, Any]]:
        """Get all children for a specific user."""
        if not self.initialized or not self.db:
            logger.error("❌ Firebase not initialized")
            return []
        
        try:
            children = []
            # Get children from users/{uid}/children collection
            children_ref = self.db.collection(f'users/{user_uid}/children')
            docs = children_ref.stream()
            
            for doc in docs:
                child_data = doc.to_dict()
                children.append({
                    'child_id': doc.id,
                    'child_name': child_data.get('child_name', doc.id),
                    'child_age': child_data.get('child_age', 0),
                    'interests': child_data.get('interests', []),
                    'account_id': user_uid,
                    'account_email': child_data.get('account_email', ''),
                    'created_at': child_data.get('created_at', ''),
                    'updated_at': child_data.get('updated_at', ''),
                    'plan_type': child_data.get('plan_type', 'hybrid')
                })
            
            logger.info(f"👶 Found {len(children)} children for user {user_uid}")
            return children
            
        except Exception as e:
            logger.error(f"❌ Error getting children for user {user_uid}: {e}")
            return []
    
    def get_all_children_with_accounts(self) -> List[Dict[str, Any]]:
        """Get all children with their account information."""
        if not self.initialized or not self.db:
            logger.error("❌ Firebase not initialized")
            return []
        
        try:
            all_children = []
            users = self.get_all_users()
            
            for user in users:
                user_children = self.get_user_children(user['uid'])
                for child in user_children:
                    child['account_info'] = {
                        'account_id': user['uid'],
                        'account_email': user['email'],
                        'account_display_name': user['displayName']
                    }
                all_children.extend(user_children)
            
            logger.info(f"👶 Found {len(all_children)} total children across all users")
            return all_children
            
        except Exception as e:
            logger.error(f"❌ Error getting all children with accounts: {e}")
            return []
    
    def get_accounts_summary(self) -> Dict[str, Any]:
        """Get summary of all accounts and their children."""
        if not self.initialized or not self.db:
            logger.error("❌ Firebase not initialized")
            return {"accounts": [], "children": [], "total_accounts": 0, "total_children": 0}
        
        try:
            users = self.get_all_users()
            all_children = self.get_all_children_with_accounts()
            
            # Create accounts list with children count
            accounts = []
            for user in users:
                user_children = [c for c in all_children if c['account_id'] == user['uid']]
                accounts.append({
                    'account_id': user['uid'],
                    'account_email': user['email'] or user['uid'],
                    'display_name': user['displayName'] or user['uid'],
                    'children_count': len(user_children),
                    'created_at': user.get('created_at', ''),
                    'last_login': user.get('last_login', '')
                })
            
            # Create children list
            children = []
            for child in all_children:
                children.append({
                    'child_id': child['child_id'],
                    'child_name': child['child_name'],
                    'account_id': child['account_id'],
                    'account_email': child['account_email'],
                    'created_at': child.get('created_at', ''),
                    'plan_type': child.get('plan_type', 'hybrid')
                })
            
            return {
                "accounts": sorted(accounts, key=lambda x: x['display_name']),
                "children": sorted(children, key=lambda x: x['child_name']),
                "total_accounts": len(accounts),
                "total_children": len(children)
            }
            
        except Exception as e:
            logger.error(f"❌ Error getting accounts summary: {e}")
            return {"accounts": [], "children": [], "total_accounts": 0, "total_children": 0}

# Global instance
firebase_service = FirebaseService()
