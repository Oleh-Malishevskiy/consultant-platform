import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc ,collection,addDoc} from 'firebase/firestore';
import { db } from '../../firebase-config';
import '../HirePage/HirePage.css';
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
    <div className='hire-page-wrapper'>
      {consultant ? (
        
          <div className='consultant-info'>

            <section className='leftside'>
              <h1>Consultant</h1>
              <img  src={consultant.imageUrl || 'default-profile.png'} alt={`${consultant.firstName} ${consultant.lastName}`} />
                <h4>Something About:</h4>
                <p className='about_text'>{consultant.about}</p></section>



            <section>
              <section className='contain'>
              <section className='rigth-side'>
                <h1>Consultant Info</h1>
                <section>
                <div>
                  <div className='image_card_info' style={{backgroundImage: `url(${consultant.imageUrl})`,backgroundRepeat:'no-repeat',backgroundSize:'contain'}} />
                  </div>
                <div>

                  <div>
                  <p>{consultant.firstName} {consultant.lastName}</p>
                  <p>Email: {consultant.email}</p>
                  <p>Title: {consultant.role}</p>
                  </div>
                </div>
                </section>


              </section>
              <section className='side_second'>
                <h1>Organizational  Info</h1>
                <section>
                
                <div>

                  <div>
                  <p>{consultant.firstName} {consultant.lastName}</p>
                  <p>Email: {consultant.email}</p>
                  <p>Title: {consultant.role}</p>
                  </div>
                </div>
                </section>


              </section>
              <section className='side_second'>
                <h1>More Info</h1>
                <section>
                
                 
                <div>

                  <div>
                  <p>{consultant.firstName} {consultant.lastName}</p>
                  <p>Email: {consultant.email}</p>
                  <p>Title: {consultant.role}</p>
                  </div>
                </div>
                </section>


              </section>

              </section>
              
             
          <button className='hire_button' onClick={handleSendRequest}>Hire This Consultant</button>
          
          </section>
          
        </div>




      ) : (
        <p>Loading consultant details...</p>
      )}

    </div>
  );
}

export default HirePage;
