import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';

export default function SignupFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState('choice'); // choice | create | join
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    weddingName: '',
    invitationCode: '',
    role: 'VIEWER'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Step 1: Create New Wedding
  const handleCreateWedding = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          weddingName: formData.weddingName
        })
      });

      const data = await response.json();

      if (data.success) {
        // Auto login
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        const loginData = await loginRes.json();
        if (loginData.success) {
          localStorage.setItem('token', loginData.data.token);
          navigate('/app');
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to create wedding');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Join Existing Wedding
  const handleJoinWedding = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/join-wedding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          invitationCode: formData.invitationCode.toUpperCase(),
          role: formData.role
        })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.data.token);
        navigate('/app');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to join wedding');
    } finally {
      setLoading(false);
    }
  };

  // Step: Choice
  if (step === 'choice') {
    return (
      <div className="signup-flow">
        <div className="auth-container">
          <h1>Wedding Event Management</h1>
          <p className="subtitle">Plan your perfect day together</p>

          <div className="choice-buttons">
            <button
              className="choice-btn create-btn"
              onClick={() => setStep('create')}
            >
              <div className="icon">🎉</div>
              <h3>Create New Wedding</h3>
              <p>You're the organizer</p>
            </button>

            <button
              className="choice-btn join-btn"
              onClick={() => setStep('join')}
            >
              <div className="icon">👥</div>
              <h3>Join Existing Wedding</h3>
              <p>You have an invitation code</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step: Create Wedding
  if (step === 'create') {
    return (
      <div className="signup-flow">
        <div className="auth-container">
          <button className="back-btn" onClick={() => setStep('choice')}>← Back</button>
          
          <h2>Create Your Wedding</h2>
          
          {error && <div className="error-message">{error}</div>}

          <form className="auth-form">
            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Wedding Name</label>
              <input
                type="text"
                name="weddingName"
                placeholder="e.g., Sarah & John's Wedding"
                value={formData.weddingName}
                onChange={handleInputChange}
                required
              />
            </div>

            <button
              type="button"
              className="submit-btn"
              onClick={handleCreateWedding}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Wedding'}
            </button>
          </form>

          <p className="info-text">
            You'll be the owner and can invite others to help plan
          </p>
        </div>
      </div>
    );
  }

  // Step: Join Wedding
  if (step === 'join') {
    return (
      <div className="signup-flow">
        <div className="auth-container">
          <button className="back-btn" onClick={() => setStep('choice')}>← Back</button>
          
          <h2>Join Wedding</h2>
          
          {error && <div className="error-message">{error}</div>}

          <form className="auth-form">
            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Invitation Code</label>
              <input
                type="text"
                name="invitationCode"
                placeholder="e.g., WEDDING2024"
                value={formData.invitationCode}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Your Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
              >
                <option value="VIEWER">👁️ Viewer - View only (no edits)</option>
                <option value="EDITOR">✏️ Editor - Create & edit (no delete)</option>
              </select>
              <small>
                {formData.role === 'VIEWER' && 'You can view all data but cannot make changes'}
                {formData.role === 'EDITOR' && 'You can create and edit items but cannot delete them'}
              </small>
            </div>

            <button
              type="button"
              className="submit-btn"
              onClick={handleJoinWedding}
              disabled={loading}
            >
              {loading ? 'Joining...' : 'Join Wedding'}
            </button>
          </form>

          <p className="info-text">
            Ask the organizer for the invitation code
          </p>
        </div>
      </div>
    );
  }
}
