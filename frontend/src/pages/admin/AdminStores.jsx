import React, { useEffect, useState } from 'react';
import api from '../../lib/api.js';

export default function AdminStores(){
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [stores, setStores] = useState([]);
  const [form, setForm] = useState({ name:'', email:'', address:'', ownerId:'' });
  async function load(){
    const { data } = await api.get('/admin/stores', { params: { search, sortBy, order } });
    setStores(data.stores);
  }
  useEffect(()=>{ load(); }, [sortBy, order]);
  async function createStore(){
    await api.post('/admin/stores', { ...form, ownerId: form.ownerId || null });
    setForm({ name:'', email:'', address:'', ownerId:'' });
    load();
  }
  return (
    <div className="card">
      <h2>Stores</h2>
      <div className="row">
        <input placeholder="Filter by Name, Email, Address" value={search} onChange={e=>setSearch(e.target.value)} />
        <button onClick={load}>Apply</button>
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
        <thead><tr><th>Name</th><th>Email</th><th>Address</th><th>Rating</th></tr></thead>
        <tbody>{stores.map(s => (<tr key={s.id}><td>{s.name}</td><td>{s.email||'—'}</td><td>{s.address}</td><td>{s.rating ?? '—'}</td></tr>))}</tbody>
      </table>
      <div className="space" />
      <h3>Add New Store</h3>
      <div className="grid">
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        <input placeholder="Email (optional)" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        <input placeholder="Address" value={form.address} onChange={e=>setForm({...form, address:e.target.value})} />
        <input placeholder="Owner ID (optional)" value={form.ownerId} onChange={e=>setForm({...form, ownerId:e.target.value})} />
        <button onClick={createStore}>Create Store</button>
      </div>
    </div>
  );
}
