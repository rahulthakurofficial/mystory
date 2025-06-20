// import "./App.css";
// import { useParams } from 'react-router-dom';
// import NavBar from "./components/NavBar";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Home from "./components/Pages/Home";
// import Profile from "./components/Pages/Profile";
// import { Blog } from "./components/Pages/Blog";
// import Dashboard from "./components/Pages/Dashboard";
// import LoginPage from "./components/Pages/LoginPage";
// import SignupPage from "./components/Pages/SignupPage";
// import CompanyForm from "./components/Pages/CompanyForm";
// import Admin from "./components/Pages/Admin";

// function App() {
//   return (
//     <Router>
//       <NavBar />
//       <div className="pages">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/profile/:id" element={<Profile />} />
        

//           <Route path="/blog" element={<Blog />} />
//           <Route path="/loginPage" element={<LoginPage />} />
//           <Route path="/signup" element={<SignupPage />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/companyForm" element={<CompanyForm />} />
//           <Route path="/admin" element={<Admin />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// const ProfileWrapper = () => {
//   const { profileId } = useParams();
//   return <Profile profileId={profileId} />;
// };

// export default App;



import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./components/Pages/Home";
import Profile from "./components/Pages/Profile";
import { Blog } from "./components/Pages/Blog";
import Dashboard from "./components/Pages/Dashboard";
import LoginPage from "./components/Pages/LoginPage";
import SignupPage from "./components/Pages/SignupPage";
import CompanyForm from "./components/Pages/CompanyForm";
import Admin from "./components/Pages/Admin";


const ProfileWrapper = () => {
  const { id } = useParams(); 
  return <Profile profileId={id} />;
};

function App() {
  return (
    <Router>
      <NavBar />
      <div className="pages">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile/:id" element={<ProfileWrapper />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/loginPage" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/companyForm" element={<CompanyForm />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
