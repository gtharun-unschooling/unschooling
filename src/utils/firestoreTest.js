/**
 * Simple Firestore connection test
 * Run this to verify Firestore is accessible and children can be loaded
 */

import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export const testFirestoreConnection = async () => {
  try {
    console.log('🔍 Testing Firestore connection...');
    
    // Test 1: Check if we can access the users collection
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    
    console.log(`✅ Users collection accessible. Found ${usersSnapshot.size} users.`);
    
    if (usersSnapshot.empty) {
      console.log('⚠️ No users found in database');
      return { success: false, message: 'No users found' };
    }
    
    // Test 2: Check each user for children
    let totalChildren = 0;
    const userDetails = [];
    
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const userData = userDoc.data();
      
      console.log(`🔍 Checking user: ${userId} (${userData.email || 'no email'})`);
      
      // Get children for this user
      const childrenRef = collection(db, `users/${userId}/children`);
      const childrenSnapshot = await getDocs(childrenRef);
      
      const userChildren = [];
      childrenSnapshot.forEach((childDoc) => {
        const childData = childDoc.data();
        userChildren.push({
          id: childDoc.id,
          name: childData.child_name || childDoc.id,
          age: childData.child_age || childData.age || 'unknown'
        });
        totalChildren++;
      });
      
      userDetails.push({
        userId,
        email: userData.email || 'no email',
        childrenCount: childrenSnapshot.size,
        children: userChildren
      });
      
      console.log(`  👶 Found ${childrenSnapshot.size} children for user ${userId}`);
    }
    
    console.log(`✅ Firestore test completed successfully!`);
    console.log(`📊 Summary:`);
    console.log(`   - Total users: ${usersSnapshot.size}`);
    console.log(`   - Total children: ${totalChildren}`);
    
    return {
      success: true,
      totalUsers: usersSnapshot.size,
      totalChildren,
      userDetails
    };
    
  } catch (error) {
    console.error('❌ Firestore connection test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Auto-run test when imported (for debugging)
if (typeof window !== 'undefined') {
  window.testFirestoreConnection = testFirestoreConnection;
  console.log('🔧 Firestore test function available as window.testFirestoreConnection()');
}
