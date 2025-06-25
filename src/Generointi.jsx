import { useState, useEffect, useRef } from 'react'
import favicon from '/favicon.png'
import './App.css'

const ratioOptions = ['16:9', '1:1', '9:16'];
const voiceOptions = ['Ääni 1', 'Ääni 2', 'Ääni 3', 'Ääni 4', 'Ääni 5'];
const moveOptions = ['Tyyppi 1', 'Tyyppi 2', 'Tyyppi 3', 'Tyyppi 4', 'Tyyppi 5'];

function Generointi() {
  const [mode, setMode] = useState('puhe');
  const [ratio, setRatio] = useState(ratioOptions[0]);
  const [voice, setVoice] = useState(voiceOptions[0]);
  const [move, setMove] = useState(moveOptions[0]);
  const [prompt, setPrompt] = useState('');
  const [chat, setChat] = useState('');
  const [sidebarContentHeight, setSidebarContentHeight] = useState(window.innerHeight - 72);
  const navbarRef = useRef(null);

  // Airtable webhook data
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    function handleResize() {
      const navbarHeight = navbarRef.current ? navbarRef.current.offsetHeight : 72;
      setSidebarContentHeight(window.innerHeight - navbarHeight);
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('https://samikiias.app.n8n.cloud/webhook/finlf-get-posts')
      .then(res => {
        if (!res.ok) throw new Error('Virhe haussa');
        return res.json();
      })
      .then(json => setData(json))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw', padding: 0 }}>
      {/* Menu aivan yläreunaan */}
      <nav className="navbar" ref={navbarRef} style={{ width: '100%', marginBottom: 0 }}>
        <div className="navbar-left">
          <img src={favicon} alt="Favicon" className="favicon" />
          <span className="brand">Finfluenser</span>
        </div>
        <div className="navbar-right">
          <a href="/">Etusivu</a>
        </div>
      </nav>
      {/* Varsinainen sisältö: sidebar + keskialue */}
      <div style={{ display: 'flex', flex: 1, width: '100%' }}>
        {/* Sidebar */}
        <nav className="sidebar" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: `${sidebarContentHeight}px`, 
          minHeight: 0, 
          position: 'relative' 
        }}>
          <div className="sidebar-content" style={{ 
            width: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            flex: 1,
            minHeight: 0, 
            overflowY: 'auto',
            paddingBottom: '1.5rem'
          }}>
            <h3>Valikko</h3>
            {/* Moodin valinta */}
            <div className="moodi-row" style={{ flexDirection: 'row', gap: '1rem', width: '100%', margin: '2rem 0 0.5rem 0' }}>
              <button
                className={mode === 'puhe' ? 'mode-btn active' : 'mode-btn'}
                onClick={() => setMode('puhe')}
                style={{ flex: 1 }}
              >
                Puhe
              </button>
              <button
                className={mode === 'liike' ? 'mode-btn active' : 'mode-btn'}
                onClick={() => setMode('liike')}
                style={{ flex: 1 }}
              >
                Liike
              </button>
            </div>
            {/* Dropdown valinta moodinapin alla */}
            <div style={{ width: '100%', margin: '0 0 1.5rem 0' }}>
              {mode === 'puhe' ? (
                <>
                  <div style={{ marginBottom: '0.5rem', fontWeight: 500 }}>Ääni:</div>
                  <select
                    value={voice}
                    onChange={e => setVoice(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 8, border: '1px solid #ccc', fontSize: '1rem' }}
                  >
                    {voiceOptions.map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </>
              ) : (
                <>
                  <div style={{ marginBottom: '0.5rem', fontWeight: 500 }}>Tyyppi:</div>
                  <select
                    value={move}
                    onChange={e => setMove(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 8, border: '1px solid #ccc', fontSize: '1rem' }}
                  >
                    {moveOptions.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </>
              )}
            </div>
            {/* Kuvasuhdevalinnat */}
            <div style={{ width: '100%', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ marginBottom: '0.5rem', fontWeight: 500 }}>Kuvasuhde:</div>
              {ratioOptions.map(r => (
                <button
                  key={r}
                  className={ratio === r ? 'ratio-btn active' : 'ratio-btn'}
                  onClick={() => setRatio(r)}
                  style={{ width: '100%' }}
                >
                  {r}
                </button>
              ))}
            </div>
            {/* Spacer to push button to bottom */}
            <div style={{ flex: 1 }}></div>
            <button className="cta" style={{ 
              width: '100%', 
              borderRadius: 8, 
              marginTop: '1rem',
              flexShrink: 0
            }}>
              Generoi
            </button>
          </div>
        </nav>
        {/* Keskialue: generoidut tiedot ja chat */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', width: '100%', padding: '2rem 0 0 0', position: 'relative', minHeight: 'calc(100vh - 72px)', maxHeight: 'calc(100vh - 72px)', overflow: 'auto' }}>
          <div className="generointi-content" style={{ width: '100%', maxWidth: 900, margin: '0 auto 1.5rem auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(100, 108, 255, 0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
            {(() => {
              let arr = [];
              if (Array.isArray(data)) {
                console.log('data[0]:', data[0]);
                if (data.length > 0 && Array.isArray(data[0].allResults)) {
                  console.log('data[0].allResults:', data[0].allResults);
                  console.log('data[0].allResults.length:', data[0].allResults.length);
                  arr = data[0].allResults;
                } else if (data.some(obj => Array.isArray(obj.allResults))) {
                  arr = data.flatMap(obj => Array.isArray(obj.allResults) ? obj.allResults : []);
                } else {
                  arr = data;
                }
              } else if (data && typeof data === 'object') {
                if (Array.isArray(data.allResults)) {
                  console.log('data.allResults:', data.allResults);
                  console.log('data.allResults.length:', data.allResults.length);
                  arr = data.allResults;
                } else {
                  arr = [data];
                }
              }
              // Debug: tulosta data ja arr konsoliin
              console.log('Webhook data:', data);
              console.log('Renderöitävät itemit:', arr, 'määrä:', arr.length);
              if (loading) return <span style={{ color: '#888', fontSize: 20 }}>Ladataan...</span>;
              if (error) return <span style={{ color: 'red', fontSize: 20 }}>{error}</span>;
              if (arr.length > 0) return (
                <>
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '2rem',
                      maxHeight: '70vh',
                      overflowY: 'auto',
                      width: '100%',
                      maxWidth: 1100,
                      padding: '1rem'
                    }}>
                      {arr.map((item, idx) => (
                        <div key={item.id || idx} style={{ maxWidth: 350, width: '100%', border: '1px solid #eee', borderRadius: 16, padding: 24, background: '#fafbff', boxShadow: '0 2px 12px rgba(100,108,255,0.07)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
                          {/* Media ylhäällä */}
                          {item.Avatar && item.Avatar.length > 0 && (
                            <video
                              src={item.Avatar[0].url}
                              controls
                              style={{ width: '100%', maxWidth: 300, borderRadius: 10, background: '#000', objectFit: 'cover', marginBottom: 16 }}
                            />
                          )}
                          {/* VoiceOver-teksti */}
                          <div style={{ fontSize: 18, color: '#333', textAlign: 'center', wordBreak: 'break-word' }}>{item.VoiceOver || '-'}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ color: '#aaa', fontSize: 12, marginTop: 8 }}>Debug: arr.length = {arr.length}</div>
                </>
              );
              return <span style={{ color: '#888' }}>Ei tietoja</span>;
            })()}
          </div>
          <div style={{ width: '100%', maxWidth: 900, margin: '0 auto', background: '#f5f6fa', borderRadius: 16, border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 100 }}>
            <textarea
              placeholder="Kirjoita viesti..."
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              disabled={mode !== 'puhe'}
              style={{ width: '100%', minHeight: 80, border: 'none', background: 'transparent', fontSize: '1rem', padding: '1rem', resize: 'vertical', outline: 'none' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Generointi; 