import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import SingUpPage from './components/Signup/Signup';
import SingInPage from './components/Signin/Signin';
import MainPage from './components/MainPage/MainPage';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import AdvisorProfile from './components/ConsultantProfile/ConsultantProfile';
import useAuth from './components/utils/GetUser';
import HirePage from './components/HirePage/HirePage';
import HireRequest from './components/HireRequest/HireRequest';
import ChatPage from './components/CommunicationPage/CommunicationPage';
import Footer from './components/Footer/Footer';
function App() {
  const authUser = useAuth();
  const MainAppLayout = () => (
    <> 
    <Navbar/>
          <Outlet /> 
     <Footer/>        
    </>
  );
  const LoginPageLayout = () => (
    <>  
          <Outlet />     
    </>
  );
  return (
    <Router>
      <div>
      
        <Routes>
       
        <Route element={<MainAppLayout />} >
        
            <Route path="/" element={<HomePage/>} />
            <Route path="/main" element={<MainPage authUser={authUser}></MainPage>} />
            <Route path="/profile/:consultantId" element={<HirePage authUser={authUser}></HirePage>} />
            <Route path="/mail" element={<HireRequest authUser={authUser}></HireRequest>} />
            <Route path="/chat/:chatSessionId" element={<ChatPage authUser={authUser}></ChatPage>} />
            <Route  path="/profile" element={< AdvisorProfile authUser={authUser}></AdvisorProfile>} />
        </Route>

          <Route element={<LoginPageLayout/>} >
            <Route path="/singup" element={<SingUpPage/>} />
            <Route path="/singin" element={<SingInPage/>} />  
          </Route>

        </Routes>
        </div>
    </Router>
  );
}

export default App;
