import React, { useState, useEffect } from 'react';
import { db } from '../../firebase-config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import RequestItem from './RequestItem';
import './RequestItem.css';
function HireRequest({ authUser }) {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (authUser && authUser.uid) {
      const requestsRef = collection(db, "hiring_requests");
      const q = query(requestsRef, where("consultantId", "==", authUser.uid));

      const fetchRequests = async () => {
        try {
          const querySnapshot = await getDocs(q);
          const fetchedRequests = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setRequests(fetchedRequests);
        } catch (error) {
          console.error("Error fetching hiring requests:", error);
        }
      };

      fetchRequests();
    }
  }, [authUser]);

  return (
    <div className='mailwrapper' >
        <section className='mail'>
      <h2>Hiring Requests</h2>
      {requests.length > 0 ? (
        requests.map(request => (
          <RequestItem key={request.id} request={request} authUser={authUser} />
        ))
      ) : (
        <p>No hiring requests found.</p>
      )}
      </section>
    </div>
  );
}

export default HireRequest;



