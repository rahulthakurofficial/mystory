import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");
  const handleSearch = async () => {
    console.log("Search input:", search);

    try {
      const response = await fetch(
        `http://localhost:8000/search_companie.php?search=${search}`
      );
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        console.log("Search results:", data);
        if (data.success) {
          setResults(data.data);
        } else {
          alert(data.message || "Error in response");
        }
      } catch (jsonError) {
        console.error("JSON parse error, response text:", text);
        alert("Invalid response from server");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch companies");
    }
  };

  const handleSubmitClick = () => {
    navigate("/loginPage");
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <h1>Every Startup Has a Story</h1>
        <p>Real stories of India’s boldest founders</p>
        <div className="search-section">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company"
          />
          <button onClick={handleSearch}>Search</button>
          <ul>
            {results.map((c) => (
              <li key={c.id}>
                <Link to={`/profile/${c.id}`}>{c.companyName}</Link>console.log("Results to display:", results);

              </li>
            ))}
            
          </ul>
          
        </div>

        <div className="hero-buttons">
          <button className="btn-secondary" onClick={handleSubmitClick}>
            Submit Your Story
          </button>
        </div>
      </section>

      {/* Why MyStory */}
      <section className="why-section">
        <h2>Why MyStory?</h2>
        <div className="features">
          <div className="feature-item">
            <img
              src="/story.png"
              alt="Story Logo"
              style={{ width: "30px", height: "30px", marginRight: "5px" }}
            />
            <br />
            Trusted Stories
          </div>
          <div className="feature-item">
            <img
              src="/industry.png"
              alt="Story Logo"
              style={{ width: "30px", height: "30px", marginRight: "5px" }}
            />
            <br />
            Industry Insights
          </div>
          <div className="feature-item">
            <img
              src="/fund.png"
              alt="Story Logo"
              style={{ width: "30px", height: "30px", marginRight: "5px" }}
            />
            <br />
            Real-time Funding News
          </div>
          <div className="feature-item">
            <img
              src="/interview.png"
              alt="Story Logo"
              style={{ width: "30px", height: "30px", marginRight: "5px" }}
            />
            <br />
            Exclusive Interview
          </div>
        </div>
      </section>

      {/* Trending Stories */}
      <section className="trending-section">
        <h2>Trending Stories</h2>
        <div className="stories">
          <div
            className="story-card"
            style={{
              backgroundImage: `url("/Arti.jpg")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: "white",
            }}
          >
            <span className="tag">#AI</span>
            <h3>Story Title</h3>
            <p>Story description goes here.</p>
            <a href="/about">Read More</a>
          </div>
          <div
            className="story-card"
            style={{
              backgroundImage: `url("/sustainability-banner.jpg")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: "white",
            }}
          >
            <span className="tag">Agriculture</span>
            <h3>Story Title</h3>
            <p>Story description goes here.</p>
            <a href="/about">Read More</a>
          </div>
          <div
            className="story-card"
            style={{
              backgroundImage: `url("/oil.webp")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: "white",
            }}
          >
            <span className="tag">Transportation</span>
            <h3>Story Title</h3>
            <p>Story description goes here.</p>
            <a href="/about">Read More</a>
          </div>
        </div>
      </section>

      {/* Submit CTA */}
      <section
        className="submit-section"
        style={{
          backgroundImage: `url("/story_telling.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          padding: "80px 20px",
          textAlign: "center",
        }}
      >
        <h2>Got a Story? Let the world hear you.</h2>
        <button className="btn-submit">Submit Now</button>
      </section>

      {/* Founder of the Week */}
      <section className="founder-section">
        <div className="founder-content">
          <div className="founder-image">
            <img src="/ratan.jpeg" alt="Founder" />
          </div>
          <div>
            <h3>Founder of the Week</h3>
            <p>
              “I don’t believe in taking right decisions. I take decisions and
              then make them right.” <br />— Ratan Tata
            </p>
            <button className="btn-read">Read Story</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
