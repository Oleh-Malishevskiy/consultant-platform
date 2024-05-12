import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../../firebase-config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import '../Navbar/Navbar.css';
import { useNavigate } from 'react-router-dom';
import Logo from "../../assets/images/site-logo.png";

function Navbar() {

  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({});
  let navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } else {
        setUserData({});
      }
    });

    return () => unsubscribe();  
  }, []);
   
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <div className="header_wrapper">
      {user ? (
        <div className='header'>
            <section>
                <div>
                <img className='logoImage' src={Logo}></img>
                <p>Savy Finance</p>
                </div>
            <p><a href="/">Home</a></p>
                <p><a href="/main">Get Advisor</a></p>
                <p><a href="contracts">Contracts</a></p>
                <p><a href="contact">Contact</a></p>
                </section>
                <section>
                    <div className='containAvatar'></div>
                  <section>  
          <p>{userData.email}</p>
          <p>(Role: {userData.role})</p>
          </section>
          <button onClick={handleLogout}>Logout</button>
          {userData.role === 'consultant' && (<button onClick={() => navigate('/mail')}>Mail</button>)}
          </section>
        </div>
      ) : (
         <div className='header'>
         <section>
         <div>
                <img className='logoImage' src={Logo}></img>
                <p>Savy Finance</p>
                </div>
         <p><a href="/">Home</a></p>
             <p><a href="/main">Get Advisor</a></p>
             <p><a href="/contracts">Contracts</a></p>
             <p><a href="/contact">Contact</a></p>
             </section>
             <section>
                
               <section>  
      
       </section>
       <button onClick={() => navigate('/singin')}>Login</button>
       {userData.role === 'consultant' && (<button onClick={() => navigate('/mail')}>Mail</button>)}
       </section>
     </div>
      )}
    </div>
  );
}

export default Navbar;
