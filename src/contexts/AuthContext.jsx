import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signOut as firebaseSignOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false); // Start as false - no blocking
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [error, setError] = useState(null);

  console.log('🔐 AuthProvider rendering...');

  // Always render children immediately - no blocking
  // Firebase will initialize in the background

  // User roles enum
  const ROLES = {
    PARENT: 'parent',
    ADMIN: 'admin'
  };

  // Default user profile structure
  const createDefaultProfile = (user) => ({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || '',
    role: ROLES.PARENT, // Default role
    profile: {
      firstName: '',
      lastName: '',
      phone: '',
      profilePicture: user.photoURL || '',
      preferences: {
        notifications: true,
        language: 'en',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    },
    subscription: {
      plan: 'free',
      status: 'inactive',
      startDate: null,
      endDate: null
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastLogin: serverTimestamp(),
    emailVerified: user.emailVerified
  });

  // Create or update user profile in Firestore
  const createUserProfile = async (user) => {
    try {
      console.log('🔐 createUserProfile starting for user:', user.uid);
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Profile creation timeout')), 5000);
      });
      
      const profilePromise = (async () => {
        const userRef = doc(db, 'users', user.uid);
        console.log('🔐 Getting user document...');
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          // Create new profile
          console.log('🔐 Creating new user profile...');
          const defaultProfile = createDefaultProfile(user);
          console.log('🔐 Setting document in Firestore...');
          await setDoc(userRef, defaultProfile);
          console.log('🔐 Document set successfully');
          setUserProfile(defaultProfile);
          return defaultProfile;
        } else {
          // Update existing profile with latest auth info
          console.log('🔐 Updating existing user profile...');
          const existingProfile = userSnap.data();
          const updatedProfile = {
            ...existingProfile,
            email: user.email,
            displayName: user.displayName || existingProfile.displayName,
            profilePicture: user.photoURL || existingProfile.profile?.profilePicture,
            emailVerified: user.emailVerified,
            lastLogin: serverTimestamp(),
            updatedAt: serverTimestamp()
          };
          
          console.log('🔐 Updating document in Firestore...');
          await updateDoc(userRef, updatedProfile);
          console.log('🔐 Document updated successfully');
          setUserProfile(updatedProfile);
          return updatedProfile;
        }
      })();

      const result = await Promise.race([profilePromise, timeoutPromise]);
      return result;
    } catch (error) {
      console.error('🔐 Error in createUserProfile:', error);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    try {
      if (!currentUser) throw new Error('No user logged in');
      
      const userRef = doc(db, 'users', currentUser.uid);
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(userRef, updateData);
      
      // Update local state
      setUserProfile(prev => ({
        ...prev,
        ...updateData
      }));
      
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      setError('Failed to update profile');
      throw error;
    }
  };

  // Update user role (admin only)
  const updateUserRole = async (uid, newRole) => {
    try {
      if (!currentUser || userProfile?.role !== ROLES.ADMIN) {
        throw new Error('Insufficient permissions');
      }
      
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        role: newRole,
        updatedAt: serverTimestamp()
      });
      
      return true;
    } catch (error) {
      console.error('Error updating user role:', error);
      setError('Failed to update user role');
      throw error;
    }
  };

      // Promote user to admin (for development)
  const promoteToAdmin = async (uid) => {
    try {
      if (!currentUser) throw new Error('No user logged in');
      
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        role: ROLES.ADMIN,
        updatedAt: serverTimestamp()
      });
      
      // Update local state if it's the current user
      if (uid === currentUser.uid) {
        setUserProfile(prev => ({
          ...prev,
          role: ROLES.ADMIN
        }));
      }
      
      return true;
    } catch (error) {
      console.error('Error promoting user to admin:', error);
      setError('Failed to promote user to admin');
      throw error;
    }
  };

  // Demote admin to parent (admin only)
  const demoteToParent = async (uid) => {
    try {
      if (!currentUser || userProfile?.role !== ROLES.ADMIN) {
        throw new Error('Insufficient permissions');
      }
      
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        role: ROLES.PARENT,
        updatedAt: serverTimestamp()
      });
      
      return true;
    } catch (error) {
      console.error('Error demoting user to parent:', error);
      setError('Failed to demote user to parent');
      throw error;
    }
  };

  // Send email verification
  const sendVerificationEmail = async () => {
    try {
      if (!currentUser) throw new Error('No user logged in');
      
      await sendEmailVerification(currentUser);
      return true;
    } catch (error) {
      console.error('Error sending verification email:', error);
      setError('Failed to send verification email');
      throw error;
    }
  };

  // Send password reset email with retry logic
  const sendPasswordReset = async (email) => {
    const maxRetries = 3;
    let lastError = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔐 Attempting password reset (attempt ${attempt}/${maxRetries})`);
        
        // Ensure Firebase is initialized
        if (!auth) {
          console.warn('🔐 Auth not initialized, waiting...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          if (!auth) {
            throw new Error('Firebase Auth not available');
          }
        }
        
        await sendPasswordResetEmail(auth, email);
        console.log('🔐 Password reset email sent successfully');
        return true;
      } catch (error) {
        lastError = error;
        console.error(`🔐 Password reset attempt ${attempt} failed:`, error);
        
        // Don't retry for certain errors
        if (error.code === 'auth/user-not-found' || 
            error.code === 'auth/invalid-email' ||
            error.code === 'auth/too-many-requests') {
          break;
        }
        
        // Wait before retrying (exponential backoff)
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
          console.log(`🔐 Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    console.error('🔐 All password reset attempts failed:', lastError);
    setError('Failed to send password reset email. Please check your internet connection and try again.');
    throw lastError;
  };

  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
      setError(null);
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Failed to sign out');
    }
  };

  // Check if user has specific role
  const hasRole = (requiredRole) => {
    return userProfile?.role === requiredRole;
  };

  // Check if user has admin permissions
  const isAdmin = () => hasRole(ROLES.ADMIN);

  // Check if user has parent permissions
  const isParent = () => hasRole(ROLES.PARENT);

  // Check if user can access admin features
  const canAccessAdmin = () => isAdmin();

  // Check if user can access parent features
  const canAccessParent = () => isParent() || isAdmin();

  useEffect(() => {
    console.log('🔐 AuthProvider useEffect running...');
    
    // Check if Firebase is available
    if (!auth) {
      console.warn('🔐 Firebase auth not available yet, skipping auth check');
      setFirebaseReady(false);
      setLoading(false);
      return;
    }

    setFirebaseReady(true);
    setLoading(true); // Start loading when checking auth state
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔐 Auth state changed:', user ? user.email : 'No user');
      console.log('🔐 Setting loading to true...');
      setLoading(true); // Start loading when checking auth state
      
      // Add a timeout to prevent hanging
      const timeoutId = setTimeout(() => {
        console.log('🔐 Auth timeout reached, forcing loading to false');
        setLoading(false);
      }, 10000); // 10 second timeout
      
      try {
        console.log('🔐 Setting current user...');
        setCurrentUser(user);
        
        if (user) {
          console.log('🔐 Creating/updating user profile...');
          try {
            await createUserProfile(user);
            console.log('🔐 User profile completed successfully');
          } catch (profileError) {
            console.warn('🔐 Profile creation failed, continuing without profile:', profileError);
            // Continue without profile - user can still access basic features
            setUserProfile(null);
          }
        } else {
          console.log('🔐 No user, clearing profile...');
          setUserProfile(null);
        }
      } catch (error) {
        console.error('🔐 Error in auth state change:', error);
        setError(error.message);
      } finally {
        clearTimeout(timeoutId);
        console.log('🔐 Setting loading to false...');
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    ROLES,
    // Actions
    updateUserProfile,
    updateUserRole,
    promoteToAdmin,
    demoteToParent,
    sendVerificationEmail,
    sendPasswordReset,
    signOut,
    // Permissions
    hasRole,
    isAdmin,
    isParent,
    canAccessAdmin,
    canAccessParent,
    // Utility
    setError
  };

  // Always render children immediately - no blocking
  console.log('🔐 AuthProvider rendering children...');
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
