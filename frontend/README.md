password of admin : $2y$10$7ZG.y9K3Qg0sYHT9mOQzEO1F5P3gCqHlRPe2b2ZkI0n3wMGcyvWVa

-- Use your existing 'mystory' database
USE mystory;

-- Table for storing company profiles
CREATE TABLE company_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    logo_url VARCHAR(500),
    company_name VARCHAR(255) NOT NULL,
    tagline VARCHAR(500),
    story TEXT,
    deals TEXT,
    categories JSON,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for storing users (for login functionality)
CREATE TABLE loginusers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255),
    role ENUM('user', 'admin') DEFAULT 'user',
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for categories
CREATE TABLE categoriees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for deals and discounts
CREATE TABLE deals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    expiry_date DATE,
    status ENUM('active', 'inactive', 'expired') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO categories (name) VALUES 
('Tech'), ('Sales'), ('HR'), ('Marketing'), ('Finance'), ('Operations');

-- Insert some sample deals
INSERT INTO deals (title, description, expiry_date) VALUES 
('New Deal', 'Special discount offer', '2025-05-23'),
('Summer Sale', 'Limited time offer', '2025-06-30');

-- Insert sample admin user (password: admin123)
INSERT INTO users (name, email, phone, password, role) VALUES 
('Admin', 'admin@mystory.com', '1234567890', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Insert some sample users
INSERT INTO users (name, email, phone) VALUES 
('Ravi', 'ravi@example.com', '9876543210'),
('Abhishek', 'abhishek@example.com', '9876543211');





import React, { useState } from "react";
import './CompanyForm.css';

const categories = ["Tech", "Sales", "HR", "Marketing", "Finance", "Operations"];

const CompanyForm = () => {
  const [formData, setFormData] = useState({
    logoUrl: '',
    companyName: '',
    tagline: '',
    story: '',
    deals: '',
    categories: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(value)
        ? prev.categories.filter((cat) => cat !== value)
        : [...prev.categories, value]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // First, try to submit to your backend
      const response = await fetch("http://localhost:8000/companyform.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      // Check if the response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the response text first
      const responseText = await response.text();
      console.log('Raw response:', responseText); // For debugging

      // Try to parse as JSON
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('Invalid JSON response:', responseText);
        throw new Error('Server returned invalid response. Check console for details.');
      }

      if (result.success) {
        // If backend submission is successful, also add to dashboard
        if (window.addCompanyToDashboard && typeof window.addCompanyToDashboard === 'function') {
          window.addCompanyToDashboard(formData);
        }

        alert("Company profile submitted successfully!");
        
        // Reset form
        setFormData({
          logoUrl: '',
          companyName: '',
          tagline: '',
          story: '',
          deals: '',
          categories: []
        });
      } else {
        alert("Submission failed: " + result.message);
      }
    } catch (err) {
      console.error('Submission error:', err);
      
      // If backend fails, still try to add to dashboard for demo purposes
      if (window.addCompanyToDashboard && typeof window.addCompanyToDashboard === 'function') {
        window.addCompanyToDashboard(formData);
        alert("Company profile added to dashboard (backend connection failed)");
        
        // Reset form
        setFormData({
          logoUrl: '',
          companyName: '',
          tagline: '',
          story: '',
          deals: '',
          categories: []
        });
      } else {
        alert("An error occurred while submitting the form: " + err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="profile-container">
      <section className="form-section">
        <h2 className="form-title">Submit Your Company Profile</h2>
        <form className="company-form">
          <input 
            type="text" 
            name="logoUrl" 
            placeholder="Logo URL" 
            value={formData.logoUrl} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="text" 
            name="companyName" 
            placeholder="Company Name" 
            value={formData.companyName} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="text" 
            name="tagline" 
            placeholder="Company Tagline" 
            value={formData.tagline} 
            onChange={handleChange} 
            required 
          />
          <textarea 
            name="story" 
            placeholder="Company Story" 
            rows={4} 
            value={formData.story} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="text" 
            name="deals" 
            placeholder="Deals & Discounts" 
            value={formData.deals} 
            onChange={handleChange} 
          />

          <div className="category-section">
            <label className="category-label">Select Categories:</label>
            <div className="checkbox-group">
              {categories.map((cat) => (
                <label key={cat} className="checkbox-item">
                  <input
                    type="checkbox"
                    value={cat}
                    checked={formData.categories.includes(cat)}
                    onChange={handleCategoryChange}
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Profile'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default CompanyForm;