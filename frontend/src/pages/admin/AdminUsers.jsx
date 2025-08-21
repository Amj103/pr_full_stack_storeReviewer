import React, { useEffect, useState } from 'react';
import api from '../../lib/api.js';

function validateUser(user) {
  if (user.name.length < 20 || user.name.length > 60) {
    return "Name must be between 20 and 60 characters";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
    return "Invalid email format";
  }
  if (user.address.length > 400) {
    return "Address cannot exceed 400 characters";
  }
  if (
    user.password.length < 8 ||
    user.password.length > 16 ||
    !/[A-Z]/.test(user.password) ||
    !/[!@#$%^&*(),.?":{}|<>]/.test(user.password)
  ) {
    return "Password must be 8-16 chars, include an uppercase and a special character";
  }
  return null; 
}


export default function AdminUsers(){
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name:'', email:'', address:'', password:'', role:'USER' });
  async function load(){
    const { data } = await api.get('/admin/users', { params: { search, sortBy, order } });
    setUsers(data.users);
  }
  useEffect(()=>{ load(); }, [sortBy, order]);
  async function createUser() {
  const error = validateUser(form);
  if (error) {
    alert(error); // stop here if invalid
    return;
  }

  try {
    await api.post('/admin/users', form);
    alert("User created successfully!");
    setForm({ name:'', email:'', address:'', password:'', role:'USER' });
    load(); // refresh users table
  } catch (err) {
    console.error(err);
    alert("Failed to create user");
  }
}

  return (
    <div className="card">
      <h2>Users</h2>
      <div className="row">
        <input placeholder="Filter by Name, Email, Address, Role" value={search} onChange={e=>setSearch(e.target.value)} />
        <button onClick={load}>Apply</button>
        <select value={sortBy} onChange={e=>setSortBy(e.target.value)}>
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="address">Address</option>
          <option value="role">Role</option>
        </select>
        <select value={order} onChange={e=>setOrder(e.target.value)}>
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
      </div>
      <div className="space" />
      <table>
        <thead><tr><th>Name</th><th>Email</th><th>Address</th><th>Role</th></tr></thead>
        <tbody>{users.map(u => (<tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.address}</td><td>{u.role}</td></tr>))}</tbody>
      </table>
      <div className="space" />
      <h3>Add New User</h3>
      <div className="grid">
        <input placeholder="Name (20-60)" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        <input placeholder="Address (<=400)" value={form.address} onChange={e=>setForm({...form, address:e.target.value})} />
        <input placeholder="Password (8-16, uppercase + special)" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
        <select value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
          <option value="USER">Normal User</option>
          <option value="OWNER">Store Owner</option>
          <option value="ADMIN">System Administrator</option>
        </select>
        <button onClick={createUser}>Create User</button>
      </div>
    </div>
  );
}
