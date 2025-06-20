import React, { useState, useEffect } from "react";
import "./Profile.css";

const Profile = ({ profileId = null }) => {
  
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState({});

  const API_BASE = "http://localhost:8000";

  useEffect(() => {
    fetchProfileData();

    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

   
    setTimeout(() => {
      const sections = document.querySelectorAll("[data-animate]");
      sections.forEach((section) => observer.observe(section));
    }, 100);

    return () => observer.disconnect();
  }, [profileId]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);

      const url = profileId
        ? `${API_BASE}/profile.php?id=${profileId}`
        : `${API_BASE}/profile.php`;

      console.log("Fetching from:", url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      console.log("Raw response:", responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (jsonError) {
        console.error("Invalid JSON response:", responseText);
        throw new Error("Server returned invalid response");
      }

      if (result.success) {
        setProfileData(result.data);
      } else {
        setError(result.message || "Failed to load profile");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Error loading profile data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const defaultProfile = {
    logo_url: "https://via.placeholder.com/150x150?text=LOGO",
    company_name: "Awesome Tech Co.",
    tagline: "Building the future of AI and Automation",
    story:
      "Our company started with a simple vision: to make technology accessible and powerful for everyone. We believe in innovation, creativity, and the power of teamwork to solve complex problems. Over the years, we've grown from a small startup to a leading technology company, always maintaining our core values of excellence, integrity, and customer satisfaction.",
    deals:
      "Get 50% off on our premium services, First month free for new customers, Free consultation for enterprise clients, 24/7 priority support included",
    categories: [
      "Technology",
      "Sales",
      "HR",
      "Marketing",
      "Consulting",
      "Innovation",
      "Operation",
    ],
  };

  const currentProfile =
    profileData && profileData.length > 0 ? profileData[0] : defaultProfile;

  if (loading) {
    return (
      <div className="enhanced-loading-container">
        <div className="enhanced-loading-overlay"></div>
        <div className="enhanced-loading-content">
          <div className="enhanced-loading-spinner"></div>
          <div className="enhanced-loading-text">Loading profile...</div>
          <div className="enhanced-loading-subtitle">
            Please wait while we fetch your data
          </div>
        </div>
        <div className="enhanced-loading-shimmer"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="enhanced-error-container">
        <div className="enhanced-error-content">
          <div className="enhanced-error-icon">⚠️</div>
          <div className="enhanced-error-title">Oops! Something went wrong</div>
          <p className="enhanced-error-message">{error}</p>
          <button onClick={fetchProfileData} className="enhanced-retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const dealsArray = currentProfile.deals
    ? currentProfile.deals.split(",").map((deal) => deal.trim())
    : [];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getCategoryIcon = (category) => {
    const images = {
      Technology: "technology",
      Tech: "tech",
      Sales: "sales",
      HR: "Humanresouce",
      Marketing: "Marketing",
      Consulting: "Consulting",
      Innovation: "innovation",
      Finance: "Finance",
      Design: "Designer",
      Support: "support",
    };

    const imageName = images[category] || "default";
    return (
      <img
        src={`/${imageName}.png`}
        alt={category}
        style={{ width: "300px", height: "300px", marginRight: "8px" }}
      />
    );
  };

  return (
    <div className="enhanced-profile-container">
    
      <section className="enhanced-hero-section">
        <div className="enhanced-hero-background"></div>
        <div className="enhanced-hero-overlay"></div>

        
        <div className="enhanced-floating-elements">
          <div className="enhanced-float-1"></div>
          <div className="enhanced-float-2"></div>
          <div className="enhanced-float-3"></div>
          <div className="enhanced-float-4"></div>
        </div>

        <div className="enhanced-hero-content">
        
          <div className="enhanced-logo-section">
            <div className="enhanced-logo-wrapper">
              <div className="enhanced-logo-frame">
                <img
                  className="enhanced-company-logo"
                  src={currentProfile.logo_url || defaultProfile.logo_url}
                  alt="Company Logo"
                  onError={(e) => {
                    e.target.src = defaultProfile.logo_url;
                  }}
                />
                <div className="enhanced-logo-overlay"></div>
              </div>
            </div>
          </div>

        
          <h1 className="enhanced-company-name">
            {currentProfile.company_name}
          </h1>

          <p className="enhanced-company-tagline">{currentProfile.tagline}</p>

          
          <div className="enhanced-hero-buttons">
            <button
              className="enhanced-cta-button enhanced-primary-btn"
              onClick={() => scrollToSection("story-section")}
            >
              <span className="enhanced-btn-text">Discover Our Story</span>
              <div className="enhanced-btn-overlay"></div>
            </button>

            <button
              className="enhanced-cta-button enhanced-secondary-btn"
              onClick={() => scrollToSection("deals-section")}
            >
              <span className="enhanced-btn-text">View Exclusive Deals</span>
              <div className="enhanced-btn-overlay"></div>
            </button>
          </div>

        
          <div className="enhanced-scroll-indicator">
            <div className="enhanced-scroll-mouse">
              <div className="enhanced-scroll-wheel"></div>
            </div>
          </div>
        </div>
      </section>

     
      <section
        id="categories-section"
        data-animate
        className={`enhanced-categories-section ${
          isVisible["categories-section"] ? "enhanced-visible" : ""
        }`}
      >
        <div className="enhanced-section-container">
          <div className="enhanced-section-header">
            <h2 className="enhanced-section-title">Our Expertise</h2>
            <div className="enhanced-title-underline"></div>
            <p className="enhanced-section-subtitle">
              Areas where we make a difference and drive innovation
            </p>
          </div>

          <div className="enhanced-categories-grid">
            {currentProfile.categories?.map((category, index) => (
              <div
                key={index}
                className="enhanced-category-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="enhanced-category-bg"></div>

                <div className="enhanced-category-content">
                  <div className="enhanced-category-icon">
                    {getCategoryIcon(category)}
                  </div>
                  <h3 className="enhanced-category-name">{category}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    
      <section
        id="story-section"
        data-animate
        className={`enhanced-story-section ${
          isVisible["story-section"] ? "enhanced-visible" : ""
        }`}
      >
        <div className="enhanced-story-bg-pattern"></div>

        <div className="enhanced-section-container">
          <div className="enhanced-section-header">
            <h2 className="enhanced-section-title">Our Story</h2>
            <div className="enhanced-title-underline"></div>
          </div>

          <div className="enhanced-story-content">
            <div className="enhanced-story-card-bg"></div>
            <div className="enhanced-story-card">
              <div className="enhanced-story-accent"></div>
              <p className="enhanced-story-text">{currentProfile.story}</p>
            </div>
          </div>
        </div>
      </section>

      
      <section
        id="deals-section"
        data-animate
        className={`enhanced-deals-section ${
          isVisible["deals-section"] ? "enhanced-visible" : ""
        }`}
      >
        <div className="enhanced-deals-background"></div>
        <div className="enhanced-deals-overlay"></div>

       
        <div className="enhanced-deals-floating">
          <div className="enhanced-deals-float-1"></div>
          <div className="enhanced-deals-float-2"></div>
        </div>

        <div className="enhanced-section-container">
          <div className="enhanced-section-header">
            <h2 className="enhanced-section-title enhanced-white-title">
              Exclusive Deals
            </h2>
            <div className="enhanced-title-underline enhanced-white-underline"></div>
            <p className="enhanced-section-subtitle enhanced-white-subtitle">
              Limited time offers crafted just for you
            </p>
          </div>

          <div className="enhanced-deals-grid">
            {dealsArray.map((deal, index) => (
              <div
                key={index}
                className="enhanced-deal-card"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="enhanced-deal-bg"></div>

                <div className="enhanced-deal-content">
                  <div className="enhanced-deal-icon">✨</div>
                  <p className="enhanced-deal-text">{deal}</p>
                  <button className="enhanced-deal-button">
                    <span className="enhanced-deal-btn-text">Claim Offer</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    
      {process.env.NODE_ENV === "development" && (
        <div className="enhanced-debug-info">
          <strong>Debug Info:</strong>
          <br />
          Profiles loaded: {profileData ? profileData.length : "none"}
          <br />
          Using: {profileData ? "API data" : "default data"}
          <br />
          Categories: {currentProfile.categories?.length || 0}
        </div>
      )}
    </div>
  );
};

export default Profile;
