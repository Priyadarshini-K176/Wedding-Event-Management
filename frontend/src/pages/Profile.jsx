import { useState, useEffect } from "react";
import { getProfileApi, updateProfileApi } from "../services/profile.api";
import "../styles/profile.css";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    weddingDate: "",
    venue: "",
    partnerName: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getProfileApi();
      const profileData = res.data?.data || {};
      
      // Format date for input field
      if (profileData.weddingDate) {
        profileData.weddingDate = new Date(profileData.weddingDate).toISOString().split('T')[0];
      }
      
      setProfile({
        name: profileData.name || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        weddingDate: profileData.weddingDate || "",
        venue: profileData.venue || "",
        partnerName: profileData.partnerName || ""
      });
      
      // Also save to localStorage for other components
      localStorage.setItem("userProfile", JSON.stringify(profileData));
    } catch (error) {
      console.error("Error loading profile:", error);
      // Fallback to localStorage if API fails
      const savedProfile = localStorage.getItem("userProfile");
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateProfileApi(profile);
      
      if (res.data?.success) {
        // Save to localStorage for other components
        localStorage.setItem("userProfile", JSON.stringify(profile));
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        throw new Error(res.data?.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("userProfile");
      window.location.href = "/";
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-state">
          <h2>Loading profile...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h1 className="page-title">Profile</h1>
      
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <span>{profile.name ? profile.name.charAt(0).toUpperCase() : "U"}</span>
          </div>
          <div className="profile-info">
            <h2>{profile.name || "Your Name"}</h2>
            <p>{profile.email || "your.email@example.com"}</p>
          </div>
          <button 
            className="edit-btn"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>

        <div className="profile-details">
          <div className="detail-group">
            <label>Full Name</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
              />
            ) : (
              <span>{profile.name || "Not set"}</span>
            )}
          </div>

          <div className="detail-group">
            <label>Email</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
              />
            ) : (
              <span>{profile.email || "Not set"}</span>
            )}
          </div>

          <div className="detail-group">
            <label>Phone</label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
            ) : (
              <span>{profile.phone || "Not set"}</span>
            )}
          </div>

          <div className="detail-group">
            <label>Wedding Date</label>
            {isEditing ? (
              <input
                type="date"
                name="weddingDate"
                value={profile.weddingDate}
                onChange={handleInputChange}
              />
            ) : (
              <span>{profile.weddingDate ? new Date(profile.weddingDate).toLocaleDateString() : "Not set"}</span>
            )}
          </div>

          <div className="detail-group">
            <label>Venue</label>
            {isEditing ? (
              <input
                type="text"
                name="venue"
                value={profile.venue}
                onChange={handleInputChange}
                placeholder="Enter wedding venue"
              />
            ) : (
              <span>{profile.venue || "Not set"}</span>
            )}
          </div>

          <div className="detail-group">
            <label>Partner's Name</label>
            {isEditing ? (
              <input
                type="text"
                name="partnerName"
                value={profile.partnerName}
                onChange={handleInputChange}
                placeholder="Enter partner's name"
              />
            ) : (
              <span>{profile.partnerName || "Not set"}</span>
            )}
          </div>

          {isEditing && (
            <div className="profile-actions">
              <button 
                className="primary-btn" 
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        <div className="profile-footer">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;