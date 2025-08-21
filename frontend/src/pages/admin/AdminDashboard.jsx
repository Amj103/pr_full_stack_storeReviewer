import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api.js';

export default function AdminDashboard(){
  const [stats, setStats] = useState({ totalUsers:0, totalStores:0, totalRatings:0 });
  useEffect(()=>{ (async()=>{ const { data } = await api.get('/admin/dashboard'); setStats(data); })(); },[]);
  return (
    <div className="grid">
      <div className="card"><h2>Admin Dashboard</h2>
        <div className="row"><strong>Total Users:</strong> {stats.totalUsers}</div>
        <div className="row"><strong>Total Stores:</strong> {stats.totalStores}</div>
        <div className="row"><strong>Total Ratings:</strong> {stats.totalRatings}</div>
        <div className="row" style={{marginTop:12}}>
          <Link to="/admin/users"><button>Manage Users</button></Link>
          <Link to="/admin/stores"><button>Manage Stores</button></Link>
        </div>
      </div>
    </div>
  );
}
