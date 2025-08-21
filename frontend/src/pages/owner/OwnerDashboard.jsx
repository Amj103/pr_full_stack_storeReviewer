import React, { useEffect, useState } from 'react';
import api from '../../lib/api.js';

export default function OwnerDashboard(){
  const [data, setData] = useState({ store:null, average:null, raters:[] });
  useEffect(()=>{ (async()=>{ const { data } = await api.get('/owner/dashboard'); setData(data); })(); },[]);
  if (!data.store) return <div className="card"><h2>Owner Dashboard</h2><p>No store is linked to your account yet.</p></div>;
  return (
    <div className="card">
      <h2>{data.store.name} — Ratings</h2>
      <div className="row"><strong>Average:</strong> {data.average ?? '—'}</div>
      <div className="space" />
      <table>
        <thead><tr><th>User</th><th>Email</th><th>Address</th><th>Score</th></tr></thead>
        <tbody>{data.raters.map(r => (<tr key={r.id}><td>{r.name}</td><td>{r.email}</td><td>{r.address}</td><td>{r.score}</td></tr>))}</tbody>
      </table>
    </div>
  );
}
