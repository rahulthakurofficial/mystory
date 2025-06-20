import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:8000/Adminlogin.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: adminEmail, password: adminPassword }),
    });

    const result = await response.json();

    if (result.success) {
      navigate('/dashboard');
    } else {
      alert(result.message || 'Invalid credentials');
    }
  };

  return (
    <div className="admin-wrapper">
      <div className="admin-container">
        <div className="admin-form-section">
          <h2>Admin Login</h2>
          <form onSubmit={handleLogin} className="admin-form">
            <input
              type="email"
              placeholder="Admin Email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              required
            />
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: 'pointer', marginLeft: '5px' }}
              >
                {showPassword ? '' : ''}
              </span>
            </div>

            <button type="submit" className="admin-login-button">Login</button>
          </form>
        </div>

        <div className="admin-image-section">
          <img src="/admin-bro.png" alt="Admin background" />
        </div>
      </div>
    </div>
  );
};

export default Admin;
