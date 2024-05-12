import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc ,collection,addDoc} from 'firebase/firestore';
import { db } from '../../firebase-config';

function HirePage({authUser}) {
  const { consultantId } = useParams();
  const [consultant, setConsultant] = useState(null);

  useEffect(() => {
    const fetchConsultant = async () => {
      const docRef = doc(db, "consultant_profile", consultantId);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setConsultant(docSnap.data());
        } else {
          console.log("No such consultant found!");
        }
      } catch (error) {
        console.error("Error fetching consultant data:", error);
      }
    };

    if (consultantId) {
      fetchConsultant();
    }
  }, [consultantId]);
  const handleSendRequest = async () => {
    try {
    
      await addDoc(collection(db, "hiring_requests"), {
        consultantId: consultantId,
        clientId: authUser.uid, 
        status: 'pending', 
        createdAt: new Date() 
      });
      console.log("Hiring request sent.");
    } catch (error) {
      console.error("Error sending hiring request:", error);
    }
  };
  return (
    <div>
      {consultant ? (
        <div>
          <h1>{consultant.firstName} {consultant.lastName}</h1>
          <p>Email: {consultant.email}</p>
          <button onClick={handleSendRequest}>Hire This Consultant</button>
        </div>
      ) : (
        <p>Loading consultant details...</p>
      )}
    </div>
  );
}

export default HirePage;
