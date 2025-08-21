import React, { useEffect, useState } from 'react';
import api from '../lib/api.js';
import RatingStars from '../components/RatingStars.jsx';
import { useAuth } from '../lib/auth.jsx';

export default function Stores() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [stores, setStores] = useState([]);

  async function load(){
    const { data } = await api.get('/stores', { params: { search, sortBy, order } });
    setStores(data.stores);
  }

  useEffect(()=>{ load(); }, [sortBy, order]);

  async function rate(storeId, score){
    if (!user) return alert('Login to rate');
    await api.post('/ratings', { storeId, score });
    load();
  }

  return (
    <div className="card">
      <h2>Stores</h2>
      <div className="row">
        <input placeholder="Search by Name or Address" value={search} onChange={e=>setSearch(e.target.value)} />
        <button onClick={load}>Search</button>
        <select value={sortBy} onChange={e=>setSortBy(e.target.value)}>
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="address">Address</option>
          <option value="rating">Rating</option>
        </select>
        <select value={order} onChange={e=>setOrder(e.target.value)}>
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
      </div>
      <div className="space" />
      <table>
        <thead><tr><th>Name</th><th>Address</th><th>Overall Rating</th><th>Your Rating</th><th>Action</th></tr></thead>
        <tbody>
          {stores.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.address}</td>
              <td>{s.rating ?? '—'}</td>
              <td>{s.myRating ?? '—'}</td>
              <td><RatingStars value={s.myRating || 0} onChange={(n)=>rate(s.id,n)} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
