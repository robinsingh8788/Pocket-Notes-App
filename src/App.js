import React, { useState, useEffect } from 'react';
import './App.css';
import { getGroups, saveGroups, getNotes, saveNotes } from './utils/storage';

function App() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#f06292');

  useEffect(() => {
    const savedGroups = getGroups();
    setGroups(savedGroups);
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      const savedNotes = getNotes(selectedGroup);
      setNotes(savedNotes);
    }
  }, [selectedGroup]);

  const handleAddGroup = () => {
    if (newGroupName.length < 2 || groups.includes(newGroupName)) return;
    const updatedGroups = [...groups, newGroupName];
    setGroups(updatedGroups);
    saveGroups(updatedGroups);

    const colorMap = JSON.parse(localStorage.getItem('group-color-map') || '{}');
    colorMap[newGroupName] = selectedColor;
    localStorage.setItem('group-color-map', JSON.stringify(colorMap));

    setNewGroupName('');
    setSelectedColor('#f06292');
    setShowPopup(false);
  };

  const handleNoteSave = () => {
    if (!newNote.trim()) return;
    const now = new Date();
    const newNoteObj = {
      id: Date.now(),
      content: newNote,
      createdAt: now.toLocaleString(),
      updatedAt: now.toLocaleString(),
    };
    const updatedNotes = [...notes, newNoteObj];
    setNotes(updatedNotes);
    saveNotes(selectedGroup, updatedNotes);
    setNewNote('');
  };

  const handleDeleteNote = (id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    saveNotes(selectedGroup, updatedNotes);
  };

  function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 70%)`;
    return color;
  }

  function getGroupColor(group) {
    const colorMap = JSON.parse(localStorage.getItem('group-color-map') || '{}');
    return colorMap[group] || stringToColor(group);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <h2 className="sidebar-title">Pocket Notes</h2>
        <ul>
          {groups.map((group, i) => (
            <li
              key={i}
              className={group === selectedGroup ? 'active' : ''}
              onClick={() => setSelectedGroup(group)}>
              <span className="avatar" style={{ backgroundColor: getGroupColor(group) }}>
                {group.slice(0, 2).toUpperCase()}
              </span>
              {group}
            </li>
          ))}
        </ul>
        <button onClick={() => setShowPopup(true)}>+</button>
      </div>

      <div className="main">
        {selectedGroup ? (
          <>
            <div className="top-bar">
              <div className="group-header">
                <div
                  className="group-avatar"
                  style={{ backgroundColor: getGroupColor(selectedGroup) }}
                >
                  {selectedGroup.slice(0, 2).toUpperCase()}
                </div>
                <h2>{selectedGroup}</h2>
              </div>
            </div>

            <div className="notes-display">
              {notes.map(note => (
                <div key={note.id} className="note">
                  <p>{note.content}</p>
                  <div className="timestamps">
                    <small>Created: {note.createdAt}</small>
                    <small>Updated: {note.updatedAt}</small>
                  </div>
                  <button className="delete-btn" onClick={() => handleDeleteNote(note.id)}>🗑️</button>
                </div>
              ))}
            </div>

            <div className="note-input">
              <input
                type="text"
                placeholder="Enter your text here"
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleNoteSave()}
              />
              <button className={newNote ? 'active' : ''} onClick={handleNoteSave}>➤</button>
            </div>
          </>
        ) : (
          <div className="placeholder">
            <img src={`${process.env.PUBLIC_URL}/welcome.png`} alt="Welcome" />

            <h1>Pocket Notes</h1>
            <p>Send and receive messages without keeping your phone online.</p>
            <p>Use Pocket Notes on up to 4 linked devices and 1 mobile phone.</p>
            <p style={{ fontSize: "12px", marginTop: "10px" }}>🔒 end-to-end encrypted</p>
          </div>
        )}
      </div>

      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup" onClick={e => e.stopPropagation()}>
            <h3>Create New Group</h3>

            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '20px' }}>
              <label style={{
                marginRight: '10px',
                minWidth: '100px',
                fontWeight: '500',
                paddingTop: '10px'
              }}>
                Group Name
              </label>
              <input
                type="text"
                value={newGroupName}
                onChange={e => setNewGroupName(e.target.value)}
                placeholder="Enter group name"
                style={{
                  padding: '10px',
                  fontSize: '14px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  flex: 1
                }}
              />
            </div>

            <div className="color-row">
              <label>Choose colour</label>
              <div className="color-options">
                {['#f06292', '#ba68c8', '#64b5f6', '#4db6ac', '#ffd54f'].map((color) => (
                  <span
                    key={color}
                    className="color-dot"
                    style={{
                      backgroundColor: color,
                      border: selectedColor === color ? '2px solid black' : '1px solid gray'
                    }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>

            <button onClick={handleAddGroup} disabled={newGroupName.length < 2}>Create</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
