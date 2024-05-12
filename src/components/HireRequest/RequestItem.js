import React, { useState, useEffect } from 'react';
import { doc, updateDoc, getDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase-config'; // Adjust the import path as necessary
import './RequestItem.css';
async function createChatSession(participants) {
  try {
    const docRef = await addDoc(collection(db, "chat_sessions"), {
      participants: participants,
      createdAt: new Date()
    });
    return docRef.id; // Returns the newly created chat session ID
  } catch (e) {
    console.error("Error creating chat session:", e);
    return null; // Handle errors appropriately
  }
}

export const fetchUserProfile = async (userId) => {
  const userRef = doc(db, "users", userId);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
      return {
          firstName: docSnap.data().firstName,
          lastName: docSnap.data().lastName,
          email: docSnap.data().email,
          phone: docSnap.data().phone, 
         
      };
  } else {
      return null;
  }
};

function RequestItem({ request, authUser }) {
  const [clientProfile, setClientProfile] = useState({});

  useEffect(() => {
    if (request.clientId) {
      fetchUserProfile(request.clientId).then(profile => {
        setClientProfile(profile);
      });
    }
  }, [request.clientId]);

  const handleAccept = async () => {
    const requestRef = doc(db, "hiring_requests", request.id);
    try {
      await updateDoc(requestRef, { status: 'accepted' });
      const chatSessionId = await createChatSession([authUser.uid, request.clientId]);
      if (chatSessionId) {
        console.log('Chat session created with ID:', chatSessionId);
        // Additional logic can be implemented here if needed
      }
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleDecline = async () => {
    const requestRef = doc(db, "hiring_requests", request.id);
    try {
      await updateDoc(requestRef, { status: 'declined' });
      console.log("Request declined.");
    } catch (error) {
      console.error("Error declining request:", error);
    }
  };

  return (
    <div className='mail-inside'>
      <div>
      <p>Client Name: {clientProfile.firstName} {clientProfile.lastName}</p>
      <p>Client Email: {clientProfile.email}</p>
      </div>
    
      <div>
      <p>Client phone: {clientProfile.phone}</p>
      <p>Status: {request.status}</p>
      </div>
      {request.status !== 'accepted' && (
        <div className='button-wrapper'>
      <button onClick={handleAccept}>Accept</button>
      <button onClick={handleDecline}>Decline</button>
      </div>
      )}

    </div>
  );
}

export default RequestItem;

