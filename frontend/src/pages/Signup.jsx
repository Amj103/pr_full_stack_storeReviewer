import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth.jsx';

const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

export default function Signup() {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  function validate(){
    if (name.length < 20 || name.length > 60) return 'Name must be 20-60 chars';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return 'Invalid email';
    if (address.length > 400) return 'Address too long';
    if (!passwordRegex.test(password)) return 'Password 8-16, include uppercase + special';
    return null;
  }
  async function submit(e){ e.preventDefault(); setError('');
    const v = validate(); if (v) return setError(v);
    try { await signup({ name, email, address, password }); navigate('/'); } catch(err){ setError(err?.response?.data?.error || 'Signup failed'); }}
  return (
    <div className="card">
      <h2>Sign up (Normal User)</h2>
      <form onSubmit={submit} className="grid">
        <input placeholder="Full Name (20-60 chars)" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Address (<=400 chars)" value={address} onChange={e=>setAddress(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <div style={{color:'#f87171'}}>{error}</div>}
        <button>Create Account</button>
      </form>
    </div>
  );
}
