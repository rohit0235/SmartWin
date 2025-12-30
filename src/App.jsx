import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000');

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [room, setRoom] = useState('General');
  const scrollRef = useRef(null);

  useEffect(() => {
    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => socket.off('message');
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const payload = {
        text: input,
        sender: 'Me',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      socket.emit('message', payload);
      setMessages((prev) => [...prev, payload]);
      setInput('');
    }
  };

  const styles = {
    container: {
      display: 'flex',
      height: '100vh',
      width: '100vw',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      backgroundColor: '#f0f2f5',
      margin: 0,
    },
    sidebar: {
      width: '300px',
      backgroundColor: '#111b21',
      color: '#e9edef',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid #313d45',
    },
    sidebarHeader: {
      padding: '20px',
      backgroundColor: '#202c33',
      fontSize: '20px',
      fontWeight: 'bold',
    },
    roomList: {
      flex: 1,
      overflowY: 'auto',
    },
    roomItem: (isActive) => ({
      padding: '15px 20px',
      cursor: 'pointer',
      backgroundColor: isActive ? '#2a3942' : 'transparent',
      borderBottom: '1px solid #202c33',
      transition: 'background 0.2s',
    }),
    main: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#0b141a',
    },
    chatHeader: {
      padding: '15px 25px',
      backgroundColor: '#202c33',
      color: '#e9edef',
      display: 'flex',
      alignItems: 'center',
      boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
    },
    messageArea: {
      flex: 1,
      padding: '20px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',
    },
    bubble: (isMe) => ({
      alignSelf: isMe ? 'flex-end' : 'flex-start',
      backgroundColor: isMe ? '#005c4b' : '#202c33',
      color: '#e9edef',
      padding: '8px 12px',
      borderRadius: '8px',
      maxWidth: '60%',
      position: 'relative',
      boxShadow: '0 1px 1px rgba(0,0,0,0.2)',
    }),
    time: {
      fontSize: '10px',
      color: '#8696a0',
      display: 'block',
      marginTop: '4px',
      textAlign: 'right',
    },
    footer: {
      padding: '10px 20px',
      backgroundColor: '#202c33',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    input: {
      flex: 1,
      padding: '12px 15px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: '#2a3942',
      color: '#e9edef',
      outline: 'none',
    },
    sendBtn: {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#8696a0',
      cursor: 'pointer',
      fontSize: '24px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>ChatRooms</div>
        <div style={styles.roomList}>
          {['General', 'Coding', 'Random'].map((r) => (
            <div 
              key={r} 
              style={styles.roomItem(room === r)}
              onClick={() => setRoom(r)}
            >
              # {r}
            </div>
          ))}
        </div>
      </div>

      <div style={styles.main}>
        <div style={styles.chatHeader}>
          <h3 style={{ margin: 0 }}>{room}</h3>
        </div>

        <div style={styles.messageArea}>
          {messages.map((msg, i) => (
            <div key={i} style={styles.bubble(msg.sender === 'Me')}>
              <div style={{ fontSize: '14px' }}>{msg.text}</div>
              <span style={styles.time}>{msg.time}</span>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>

        <form style={styles.footer} onSubmit={handleSend}>
          <input
            style={styles.input}
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" style={styles.sendBtn}>
            ➤
          </button>
        </form>
      </div>
    </div>
  );
}