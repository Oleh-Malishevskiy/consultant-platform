import { useEffect, useState } from 'react';
import { db } from '../../firebase-config';
import { collection, query, where, getDocs } from 'firebase/firestore';

import './CommunicationPage.css';
import { useNavigate } from 'react-router-dom';

function ChatSessionsList({ authUser }) {
    const [sessions, setSessions] = useState([]);
    let navigate = useNavigate();
    useEffect(() => {
        if (authUser) {
            const sessionsRef = collection(db, "chat_sessions");
            const q = query(sessionsRef, where("participants", "array-contains", authUser.uid));
            getDocs(q).then(querySnapshot => {
                const sessionsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setSessions(sessionsData);
            }).catch(error => {
                console.error("Error fetching chat sessions:", error);
            });
        }
    }, [authUser]);

    return (
        
        <div >
            {sessions.map(session => (
            <div className='start_comm'>
           
                <div key={session.id}>
                    <button onClick={() => navigate(`/chat/${session.id}`)}>
                    Go to Room
                    </button>
                </div>
           </div>
            ))}
        </div>
        
    );
}

export default ChatSessionsList;
