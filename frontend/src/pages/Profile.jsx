import React, { useState } from 'react';
import { useAuth } from '../lib/auth.jsx';

export default function Profile() {
  const { changePassword } = useAuth();
  const [oldPassword, setOld] = useState('');
  const [newPassword, setNew] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  async function submit(e){ e.preventDefault(); setErr(''); setMsg('');
    try { await changePassword(oldPassword, newPassword); setMsg('Password updated'); } catch (e){ setErr(e?.response?.data?.error || 'Failed'); } }
  return (
    <div className="card">
      <h2>Update Password</h2>
      <form onSubmit={submit} className="grid">
        <input placeholder="Old Password" type="password" value={oldPassword} onChange={e=>setOld(e.target.value)} />
        <input placeholder="New Password (8-16, uppercase + special)" type="password" value={newPassword} onChange={e=>setNew(e.target.value)} />
        {msg && <div style={{color:'#34d399'}}>{msg}</div>}
        {err && <div style={{color:'#f87171'}}>{err}</div>}
        <button>Update</button>
      </form>
    </div>
  );
}
