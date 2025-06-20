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
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(value)
        ? prev.categories.filter(cat => cat !== value)
        : [...prev.categories, value]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8000/companyform.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid server response: " + text);
      }

      if (!response.ok) {
        throw new Error(data.message || "Submission failed");
      }

      alert("✅ Company profile submitted successfully!");
      setFormData({
        logoUrl: '',
        companyName: '',
        tagline: '',
        story: '',
        deals: '',
        categories: []
      });
    } catch (err) {
      console.error(err);
      alert("❌ " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="profile-container">
      <section className="form-section">
        <h2 className="form-title">Submit Your Company Profile</h2>
        <form onSubmit={handleSubmit} className="company-form">
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
              {categories.map(cat => (
                <label key={cat} className="checkbox-item" htmlFor={`cat-${cat}`}>
                  <input
                    id={`cat-${cat}`}
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
