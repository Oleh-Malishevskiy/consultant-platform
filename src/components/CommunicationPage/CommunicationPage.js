// src/components/ChatPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase-config';
import { doc, getDoc,collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { fetchUserProfile } from '../../components/GetProfiles';
import './CommunicationPage.css';


function ChatPage({ authUser }) {
 
    const { chatSessionId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [participants, setParticipants] = useState({});

    useEffect(() => {
        const fetchParticipants = async (sessionId) => {
            const sessionRef = doc(db, "chat_sessions", sessionId);
            const docSnap = await getDoc(sessionRef);
            if (docSnap.exists()) {
                const participantIds = docSnap.data().participants;
                const participantDetails = {};
                for (let id of participantIds) {
                    const profile = await fetchUserProfile(id);
                    if (profile) {
                        participantDetails[id] = profile;
                    }
                }
                setParticipants(participantDetails);
            }
        };

        if (chatSessionId) {
            fetchParticipants(chatSessionId);

            const messagesRef = collection(db, "chat_sessions", chatSessionId, "messages");
            const q = query(messagesRef, orderBy("createdAt", "asc"));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const loadedMessages = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setMessages(loadedMessages);
            });

            return () => unsubscribe();
        }
    }, [chatSessionId]);

    const handleSendMessage = async () => {
        if (newMessage.trim() !== "") {
            const messagesRef = collection(db, "chat_sessions", chatSessionId, "messages");
            try {
                await addDoc(messagesRef, {
                    text: newMessage,
                    createdAt: new Date(),
                    userId: authUser.uid
                });
                setNewMessage("");
            } catch (error) {
                console.error("Error sending message: ", error);
            }
        }
    };

    const handleInputChange = (e) => {
        setNewMessage(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            handleSendMessage();
            e.preventDefault();
        }
    };

    return (
        <div className="chat-page">
           
            <h2>Chat</h2>
            <div className="messages-list">
                {messages.map(message => (
                    <div key={message.id} className={`message ${message.userId === authUser.uid ? 'mine' : 'theirs'}`}>
                        <span className="message-name">{participants[message.userId]?.firstName} {participants[message.userId]?.lastName}</span>
                        <p className="message-text">{message.text}</p>
                    </div>
                ))}
            </div>
            <textarea
                className="message-input"
                value={newMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
            />
            <button className="send-button" onClick={handleSendMessage}>Send</button>
        </div>
    );
}

export default ChatPage;


