import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/invitations-simple.css';

export default function ShareWedding() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/me/permissions', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success && data.data.role === 'OWNER') {
        setIsOwner(true);
        fetchExistingCode();
        fetchUsers();
      } else {
        navigate('/app');
      }
    } catch (err) {
      console.error('Failed to check role:', err);
      navigate('/app');
    } finally {
      setCheckingRole(false);
    }
  };

  const fetchExistingCode = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/get-invitation-code', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success && data.data.code) {
        setCode(data.data.code);
      }
    } catch (err) {
      console.error('Failed to fetch code:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const generateCode = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/generate-code', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          maxUses: 100,
          expiryDays: 30
        })
      });

      const data = await response.json();

      if (data.success) {
        setCode(data.data.code);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to generate code');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'OWNER': return '#d4a373';
      case 'EDITOR': return '#4caf50';
      case 'VIEWER': return '#2196f3';
      default: return '#999';
    }
  };

  const getRoleEmoji = (role) => {
    switch(role) {
      case 'OWNER': return '👑';
      case 'EDITOR': return '✏️';
      case 'VIEWER': return '👁️';
      default: return '👤';
    }
  };

  if (checkingRole) {
    return (
      <div className="share-wedding-page">
        <p className="loading-text">Checking permissions...</p>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="share-wedding-page">
        <p className="error-message">Only the wedding owner can access this page.</p>
      </div>
    );
  }

  return (
    <div className="share-wedding-page">
      <div className="share-wedding-container">
        {/* Left Panel - Generate & Share Code */}
        <div className="share-card">
          <h2>Share Your Wedding</h2>
          <p>Invite others to help plan your wedding</p>

          {error && <div className="error-message">{error}</div>}

          {!code ? (
            <button
              className="generate-btn"
              onClick={generateCode}
              disabled={loading}
            >
              {loading ? 'Generating...' : '🔗 Generate Invitation Code'}
            </button>
          ) : (
            <div className="code-section">
              <p className="code-label">Share this code:</p>
              <div className="code-display">
                <code>{code}</code>
                <button
                  className="copy-btn"
                  onClick={copyToClipboard}
                >
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
              <p className="code-info">
                Valid for 30 days. Others can use this code to join your wedding and choose their role.
              </p>
              <button
                className="new-code-btn"
                onClick={() => setCode('')}
              >
                Generate New Code
              </button>
            </div>
          )}
        </div>

        {/* Right Panel - Users List */}
        <div className="users-card">
          <h2>Team Members ({users.length})</h2>
          <p>People with access to this wedding</p>

          {loadingUsers ? (
            <p className="loading-text">Loading team members...</p>
          ) : users.length === 0 ? (
            <p className="empty-text">No other members yet. Share the code to invite them!</p>
          ) : (
            <div className="users-list">
              {users.map((user) => (
                <div key={user._id} className="user-item">
                  <div className="user-info">
                    <div className="user-name">{user.name}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                  <div
                    className="user-role"
                    style={{ backgroundColor: getRoleColor(user.role) + '20', borderLeft: `4px solid ${getRoleColor(user.role)}` }}
                  >
                    <span className="role-emoji">{getRoleEmoji(user.role)}</span>
                    <span className="role-text">{user.role}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Roles Info */}
      <div className="roles-info-section">
        <h3>Role Descriptions</h3>
        <div className="roles-grid">
          <div className="role-card">
            <div className="role-icon">👑</div>
            <strong>OWNER</strong>
            <p>Full access - can manage everything and invite others</p>
          </div>
          <div className="role-card">
            <div className="role-icon">✏️</div>
            <strong>EDITOR</strong>
            <p>Can create and edit items but cannot delete</p>
          </div>
          <div className="role-card">
            <div className="role-icon">👁️</div>
            <strong>VIEWER</strong>
            <p>Can view everything but cannot make changes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
