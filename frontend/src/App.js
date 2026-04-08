import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000';

function App() {
  const [tab, setTab] = useState('add');
  const [students, setStudents] = useState([]);
  const [msg, setMsg] = useState('');

  // Add form
  const [form, setForm] = useState({
    firstName: '', lastName: '', rollNo: '', password: '', confirmPassword: '', contact: ''
  });

  // Delete
  const [delRoll, setDelRoll] = useState('');

  // Update
  const [searchRoll, setSearchRoll] = useState('');
  const [found, setFound] = useState(null);
  const [newContact, setNewContact] = useState('');

  const showMsg = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(''), 3000);
  };

  const loadStudents = useCallback(() => {
    axios.get(`${API}/students`)
      .then(res => setStudents(res.data))
      .catch(() => showMsg('Could not load students'));
  }, []);

  useEffect(() => {
    if (tab === 'view') loadStudents();
  }, [tab, loadStudents]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return showMsg('Passwords do not match!');
    const { confirmPassword, ...data } = form;
    axios.post(`${API}/add`, data)
      .then(res => {
        showMsg(res.data.message);
        setForm({ firstName: '', lastName: '', rollNo: '', password: '', confirmPassword: '', contact: '' });
      })
      .catch(err => showMsg(err.response?.data?.message || 'Error adding student'));
  };

  const handleDelete = (e) => {
    e.preventDefault();
    axios.delete(`${API}/delete/${delRoll}`)
      .then(res => { showMsg(res.data.message); setDelRoll(''); })
      .catch(err => showMsg(err.response?.data?.message || 'Student not found'));
  };

  const handleSearch = () => {
    axios.get(`${API}/student/${searchRoll}`)
      .then(res => { setFound(res.data); setNewContact(res.data.contact); })
      .catch(() => { showMsg('Student not found'); setFound(null); });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    axios.put(`${API}/update/${searchRoll}`, { contact: newContact })
      .then(res => { showMsg(res.data.message); setFound(null); setSearchRoll(''); setNewContact(''); })
      .catch(err => showMsg(err.response?.data?.message || 'Error updating'));
  };

  const s = {
    app: { fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' },
    header: { backgroundColor: '#1a73e8', color: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' },
    tabs: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' },
    tabBtn: (active) => ({ padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', backgroundColor: active ? '#1a73e8' : '#e0e0e0', color: active ? 'white' : '#333' }),
    card: { backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
    label: { display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' },
    input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', marginBottom: '14px', boxSizing: 'border-box' },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
    btn: (color) => ({ padding: '10px 24px', backgroundColor: color, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', marginTop: '6px' }),
    msg: { backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontWeight: 'bold' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
    th: { backgroundColor: '#f5f5f5', padding: '10px', border: '1px solid #ddd', textAlign: 'left', fontSize: '13px' },
    td: { padding: '10px', border: '1px solid #ddd', fontSize: '14px' },
    preview: { backgroundColor: '#f0f4ff', border: '1px solid #c5d0f0', borderRadius: '8px', padding: '14px', marginBottom: '16px' }
  };

  return (
    <div style={s.app}>
      <div style={s.header}>
        <h1 style={{ margin: 0 }}>🎓 Student Registration System</h1>
        <p style={{ margin: '6px 0 0', opacity: 0.85 }}>MERN Stack CRUD Application</p>
      </div>

      {msg && <div style={s.msg}>✅ {msg}</div>}

      <div style={s.tabs}>
        {[['add','➕ Add Student'],['delete','🗑️ Delete'],['update','✏️ Update'],['view','📋 View All']].map(([key, label]) => (
          <button key={key} style={s.tabBtn(tab === key)} onClick={() => setTab(key)}>{label}</button>
        ))}
      </div>

      <div style={s.card}>

        {/* ADD */}
        {tab === 'add' && (
          <form onSubmit={handleAdd}>
            <h2>Student Registration</h2>
            <div style={s.row}>
              <div>
                <label style={s.label}>First Name</label>
                <input style={s.input} required placeholder="John" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
              </div>
              <div>
                <label style={s.label}>Last Name</label>
                <input style={s.input} required placeholder="Doe" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
              </div>
            </div>
            <div style={s.row}>
              <div>
                <label style={s.label}>Roll No / ID</label>
                <input style={s.input} required placeholder="CS2024001" value={form.rollNo} onChange={e => setForm({...form, rollNo: e.target.value})} />
              </div>
              <div>
                <label style={s.label}>Contact Number</label>
                <input style={s.input} required placeholder="9876543210" value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} />
              </div>
            </div>
            <div style={s.row}>
              <div>
                <label style={s.label}>Password</label>
                <input style={s.input} required type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
              </div>
              <div>
                <label style={s.label}>Confirm Password</label>
                <input style={s.input} required type="password" placeholder="••••••••" value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} />
              </div>
            </div>
            <button type="submit" style={s.btn('#1a73e8')}>Register Student</button>
          </form>
        )}

        {/* DELETE */}
        {tab === 'delete' && (
          <form onSubmit={handleDelete}>
            <h2>Delete Student</h2>
            <label style={s.label}>Roll No / ID</label>
            <input style={s.input} required placeholder="Enter Roll No to delete" value={delRoll} onChange={e => setDelRoll(e.target.value)} />
            <button type="submit" style={s.btn('#e53935')}>Delete Student</button>
          </form>
        )}

        {/* UPDATE */}
        {tab === 'update' && (
          <div>
            <h2>Update Student Contact</h2>
            <label style={s.label}>Search by Roll No / ID</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <input style={{...s.input, marginBottom: 0, flex: 1}} placeholder="Enter Roll No" value={searchRoll} onChange={e => { setSearchRoll(e.target.value); setFound(null); }} />
              <button style={s.btn('#555')} onClick={handleSearch}>Search</button>
            </div>
            {found && (
              <form onSubmit={handleUpdate}>
                <div style={s.preview}>
                  <p><b>Name:</b> {found.firstName} {found.lastName}</p>
                  <p><b>Roll No:</b> {found.rollNo}</p>
                  <p><b>Current Contact:</b> {found.contact}</p>
                </div>
                <label style={s.label}>New Contact Number</label>
                <input style={s.input} required placeholder="New number" value={newContact} onChange={e => setNewContact(e.target.value)} />
                <button type="submit" style={s.btn('#1a73e8')}>Update Contact</button>
              </form>
            )}
          </div>
        )}

        {/* VIEW */}
        {tab === 'view' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: 0 }}>All Students ({students.length})</h2>
              <button style={s.btn('#555')} onClick={loadStudents}>↻ Refresh</button>
            </div>
            {students.length === 0 ? (
              <p style={{ color: '#888', textAlign: 'center', padding: '30px' }}>No students found. Add some records first.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      <th style={s.th}>#</th>
                      <th style={s.th}>First Name</th>
                      <th style={s.th}>Last Name</th>
                      <th style={s.th}>Roll No / ID</th>
                      <th style={s.th}>Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s, i) => (
                      <tr key={s._id}>
                        <td style={{padding:'10px',border:'1px solid #ddd'}}>{i + 1}</td>
                        <td style={{padding:'10px',border:'1px solid #ddd'}}>{s.firstName}</td>
                        <td style={{padding:'10px',border:'1px solid #ddd'}}>{s.lastName}</td>
                        <td style={{padding:'10px',border:'1px solid #ddd'}}>{s.rollNo}</td>
                        <td style={{padding:'10px',border:'1px solid #ddd'}}>{s.contact}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;