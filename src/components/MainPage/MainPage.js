// src/components/MainPage/MainPage.js
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import '../MainPage/MainPage.css';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import ChatSessionsList from '../CommunicationPage/GetChatsList';
function MainPage({ authUser }) {
  const [user, loading] = useAuthState(auth);
  const [role, setRole] = useState('');
  const [profiles, setProfiles] = useState([]);

    useEffect(() => {
        const fetchProfiles = async () => {
            const querySnapshot = await getDocs(collection(db, "consultant_profile"));
            const profileData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProfiles(profileData);
        };

        fetchProfiles();
    }, []);
  let navigate = useNavigate();

  useEffect(() => {
    if (loading) return; 
    if (!user) return; 

    const fetchUserRole = async () => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setRole(docSnap.data().role); 
      } else {
        console.log("No such document!");
      }
    };

    fetchUserRole();
  }, [user, loading]);

  return (
    <div>
        
               
            
        <div  className='hero_line'>
        <div>
            <h1>Get Professional Advisor</h1>
            <p>Transform challenges into opportunities with expert insights</p>
        </div>
        </div>
        <ChatSessionsList authUser={authUser} />
      
      <div className='cadr-wrapper'>

      {role === 'consultant' && (
        <section className='card'>
            <section className='left-section'>
                <div className='image'></div>
                <p>About info</p>
            </section>
            <section className='right-section'>
                <div>
                <div className='label'>
                    
                    <p>Full Name</p>
                    <p>Title</p>
                    </div>
                    <div className='value'>
                   
                    <p>John Doe</p>
                    <p>Senior IT Consultant</p>
                </div>
                </div>
                <div>
                <div className='label'>
                    <p>Phone</p>
                    <p>Email</p>
                    <p>LinkedIn</p>
                    <p>Website</p>
                    </div>
                    <div className='value'>
                    <p>+123 456 7890</p>
                    <p>john.doe@example.com</p>
                    <p>linkedin.com/in/johndoe</p>
                    <p>www.johndoewebsite.com</p>
                </div>
                </div>
                <div className='moreInfo'>
                <p>More info:</p>
                    <p>Experience: 5 years</p>
                    <p>Services: Stock market analytics</p>
                    <p>Success cases: 6</p>
                </div>
                <button onClick={() => navigate('/profile')} className='card-button'>Create Card</button>
            </section>
        </section>
        )}

{profiles.map(profile => ( 
        <section key={profile.id} className='card'>
            <section className='left-section'>
                <img className='image' src={profile.imageUrl || 'default-profile.png'} alt={`${profile.firstName} ${profile.lastName}`} />
                <p>{profile.about}</p>
            </section>
            <section className='right-section'>
                <div>
                <div className='label'>
                    
                    <p>Full Name</p>
                    <p>Title</p>
                    </div>
                    <div className='value'>
                   
                    <p>{profile.firstName} {profile.lastName}</p>
                    <p>{profile.role}</p>
                </div>
                </div>
                <div>
                <div className='label'>
                    <p>Phone</p>
                    <p>Email</p>
                    <p>LinkedIn</p>
                    <p>Website</p>
                    </div>
                    <div className='value'>
                    <p>+380 {profile.phone}</p>
                    <p>{profile.email}</p>
                    <p>{profile.linkedin}</p>
                    <p>{profile.website}</p>
                </div>
                </div>
                <div className='moreInfo'>
                <p>More info:</p>
                    <p>Experience: {profile.experience} years</p>
                    <p>Services: {profile.services}</p>
                    <p>Success cases: {profile.successCases}</p>
                </div>
                <button onClick={() => navigate(`/profile/${profile.id}`)}  className='card-button'>Choose consultant</button>
            </section>
        </section>
        ))}
      </div>
      </div>
   
  );
}

export default MainPage;
