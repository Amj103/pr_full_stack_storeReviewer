import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth.jsx';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  async function submit(e){ e.preventDefault(); setError('');
    try { await login(email, password); navigate('/'); } catch(err){ setError(err?.response?.data?.error || 'Login failed'); }}
  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={submit} className="grid">
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <div style={{color:'#f87171'}}>{error}</div>}
        <button>Login</button>
      </form>
    </div>
  );
}
