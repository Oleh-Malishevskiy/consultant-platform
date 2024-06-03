import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, realtimeDb } from '../../firebase-config';
import { doc, getDoc, collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { ref, set, remove, onValue } from "firebase/database";
import { fetchUserProfile } from '../utils/GetProfiles';
import MarketOverviewWidget from '../utils/FinanceApi';
import stockData from '../Data/stockData.json';
import './CommunicationPage.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Реєструємо компоненти Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function ChatPage({ authUser }) {
  const { chatSessionId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [participants, setParticipants] = useState({});
  const [selectedStock, setSelectedStock] = useState(null);
  const [savedStocks, setSavedStocks] = useState({});
  const [chartData, setChartData] = useState(null);

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

  const handleStockClick = (stock) => {
    setSelectedStock(stock);
    const stockRef = ref(realtimeDb, `selectedStocks/${stock.symbol}`);
    set(stockRef, stock);
  };

  const handleDeleteStock = (stock) => {
    const stockRef = ref(realtimeDb, `selectedStocks/${stock.symbol}`);
    remove(stockRef);
    setSelectedStock(null);
  };

  const handleMarkowitzModel = () => {
    const expectedReturn = selectedStock.expected_return;
    const variance = selectedStock.variance;
    setChartData({
      labels: ['Expected Return', 'Variance'],
      datasets: [{
        label: selectedStock.company,
        data: [expectedReturn, variance],
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1
      }]
    });
  };

  const handleBollingerBands = () => {
    const prices = selectedStock.historical_prices;
    const period = prices.length;
    const numStdDev = 2;

    const movingAvg = prices.reduce((a, b) => a + b, 0) / period;
    const variance = prices.reduce((a, b) => a + Math.pow(b - movingAvg, 2), 0) / period;
    const stdDev = Math.sqrt(variance);

    const upperBand = movingAvg + numStdDev * stdDev;
    const lowerBand = movingAvg - numStdDev * stdDev;

    setChartData({
      labels: prices.map((price, index) => `Day ${index + 1}`),
      datasets: [
        {
          label: 'Prices',
          data: prices,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1
        },
        {
          label: 'Upper Band',
          data: prices.map(() => upperBand),
          backgroundColor: 'rgba(192,75,75,0.4)',
          borderColor: 'rgba(192,75,75,1)',
          borderWidth: 1
        },
        {
          label: 'Lower Band',
          data: prices.map(() => lowerBand),
          backgroundColor: 'rgba(75,75,192,0.4)',
          borderColor: 'rgba(75,75,192,1)',
          borderWidth: 1
        }
      ]
    });
  };

  useEffect(() => {
    const savedStocksRef = ref(realtimeDb, 'selectedStocks');
    onValue(savedStocksRef, (snapshot) => {
      const stocks = snapshot.val() || {};
      setSavedStocks(stocks);
    });
  }, []);

  return (
    <div className="chat-page">
      <div className="market-overview">
        <MarketOverviewWidget />
      </div>
      <div className="sections-container">
        <section className="section">
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
          {chartData && (
            <div className="chart-container">
              <h2>Chart</h2>
              <Line data={chartData} />
            </div>
          )}
        </section>
        <section className="section">
          <h2>Stocks</h2>
          <ul className="stock-list">
            {stockData.map(stock => (
              <li key={stock.symbol} onClick={() => handleStockClick(stock)}>
                {stock.company}
              </li>
            ))}
          </ul>
          {selectedStock && (
            <div className='stock-info'> 
              <h3>{selectedStock.company} ({selectedStock.symbol})</h3>
              <p>{selectedStock.description}</p>
              <p>Initial Price: {selectedStock.initial_price}</p>
              <p>Price in 2002: {selectedStock.price_2002}</p>
              <p>Price in 2007: {selectedStock.price_2007}</p>
              <button onClick={handleMarkowitzModel}>Calculate Markowitz Model</button>
              <button onClick={handleBollingerBands}>Calculate Bollinger Bands</button>
              <button onClick={() => handleDeleteStock(selectedStock)}>Delete from Portfolio</button>
            </div>
          )}
          <h2>Portfolio</h2>
          <ul className="saved-stocks-list">
            {Object.values(savedStocks).map(stock => (
              <li key={stock.symbol}>
                {stock.company} ({stock.symbol})
                <button onClick={() => handleDeleteStock(stock)}>Delete</button>
              </li>
            ))}
          </ul>
          
        </section>
      </div>
    </div>
  );
}

export default ChatPage;













