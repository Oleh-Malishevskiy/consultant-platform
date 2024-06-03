import React from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
export default function HomePage() {
    let navigate = useNavigate();
  return (
    <div className="homePage">
      <div className="HeroBanner">
    <main>
        <section class="welcome-section">
            <h1>Welcome</h1>
            <p>This is a brief introduction to our consulting services.</p>
            <section class="buttons">
                <button>Get more Info</button>
                <button onClick={() => navigate('/singup')} >Get Started</button>
            </section>
        </section>
       
        <section class="services-section">
            <div class="service">
                
                <h5>Strategic Consulting</h5>
                <p>Empower your business with expert insights </p>
            </div>
            <div class="service">
                
            <h5>Profesional Advisory</h5>
            <p>Get highly professional help for your enrichment</p>
            </div>
            <div class="service">
                
            <h5>Digital Solutions</h5>
            <p>Drive your digital success with our tech solutions</p>
            </div>
            <div class="service">
                
            <h5>Market Insights</h5>
                <p>Get market analysis to gain a competitive edge</p>
            </div>
            <div class="service">
                
            <h5>Risk Minimize</h5>
                <p>Minimize risks with our consultants</p>
            </div>
        </section>
    </main>
   
    </div>
    </div>
  );
}