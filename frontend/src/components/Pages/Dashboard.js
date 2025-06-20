import React, { useState, useEffect } from "react";
import './Dashboard.css';
import { Eye, X } from "lucide-react";

const Dashboard = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState(null);

  // Mock data for stories
  const mockStories = [
    { id: 1, title: "Amazing Customer Service Experience", author: "John Doe", status: "pending", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
    { id: 2, title: "Quick Delivery Story", author: "Jane Smith", status: "approved", content: "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam." },
    { id: 3, title: "Product Quality Review", author: "Mike Johnson", status: "pending", content: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation." },
    { id: 4, title: "Great Support Team", author: "Sarah Wilson", status: "rejected", content: "Ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip." },
    { id: 5, title: "Smooth Shopping Experience", author: "Tom Brown", status: "approved", content: "Aliqua enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." }
  ];

  // Load data on component mount
  useEffect(() => {
    const loadData = () => {
      setTimeout(() => {
        setStories(mockStories);
        setLoading(false);
      }, 1000);
    };
    loadData();
  }, []);

  const handleApprove = async (id) => {
    try {
      setStories(stories.map(story => 
        story.id === id ? { ...story, status: 'approved' } : story
      ));
      alert('Story approved successfully!');
    } catch (error) {
      console.error('Error approving story:', error);
      alert('Error approving story');
    }
  };

  const handleReject = async (id) => {
    try {
      setStories(stories.map(story => 
        story.id === id ? { ...story, status: 'rejected' } : story
      ));
      alert('Story rejected successfully!');
    } catch (error) {
      console.error('Error rejecting story:', error);
      alert('Error rejecting story');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Admin Dashboard</h2>
          <div className="dashboard-date">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Recent Stories */}
        <div className="content-card">
          <h3 className="section-title">Recent Stories</h3>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr className="table-header">
                  <th className="table-cell">Title</th>
                  <th className="table-cell">Author</th>
                  <th className="table-cell">Status</th>
                  <th className="table-cell">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stories.map((story) => (
                  <tr key={story.id} className="table-row">
                    <td className="table-cell">
                      <div className="story-title">{story.title}</div>
                    </td>
                    <td className="table-cell story-author">{story.author}</td>
                    <td className="table-cell">
                      <span className={`status-badge status-${story.status}`}>
                        {story.status.charAt(0).toUpperCase() + story.status.slice(1)}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="action-buttons">
                        <button
                          onClick={() => setSelectedStory(story)}
                          className="action-btn view-btn"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        {story.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(story.id)}
                              className="action-btn approve-btn"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(story.id)}
                              className="action-btn reject-btn"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Story View Modal */}
      {selectedStory && (
        <div className="modal-overlay">
          <div className="modal modal-large">
            <div className="modal-header">
              <h3 className="modal-title">Story Details</h3>
              <button
                onClick={() => setSelectedStory(null)}
                className="modal-close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="story-details">
              <div className="story-field">
                <label className="story-label">Title</label>
                <p className="story-value">{selectedStory.title}</p>
              </div>
              <div className="story-field">
                <label className="story-label">Author</label>
                <p className="story-value">{selectedStory.author}</p>
              </div>
              <div className="story-field">
                <label className="story-label">Status</label>
                <span className={`status-badge status-${selectedStory.status}`}>
                  {selectedStory.status.charAt(0).toUpperCase() + selectedStory.status.slice(1)}
                </span>
              </div>
              <div className="story-field">
                <label className="story-label">Content</label>
                <p className="story-content">{selectedStory.content}</p>
              </div>
            </div>
            {selectedStory.status === 'pending' && (
              <div className="modal-actions">
                <button
                  onClick={() => {
                    handleApprove(selectedStory.id);
                    setSelectedStory(null);
                  }}
                  className="modal-btn modal-btn-success"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    handleReject(selectedStory.id);
                    setSelectedStory(null);
                  }}
                  className="modal-btn modal-btn-danger"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;