// src/components/FirestoreTest.jsx
import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

function FirestoreTest() {
  const [name, setName] = useState('');

  const handleSave = async () => {
    try {
      await addDoc(collection(db, 'users'), { name });
      alert('Saved to Firestore!');
    } catch (e) {
      alert('Error saving to Firestore: ' + e.message);
    }
  };

  return (
    <div>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      /><br />
      <button onClick={handleSave}>Save to Firestore</button>
    </div>
  );
}

export default FirestoreTest;
