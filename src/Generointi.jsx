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
  const [showSettings, setShowSettings] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState(null);
  const navbarRef = useRef(null);

  // Airtable webhook data
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Tarkista onko mobiili (max-width: 600px)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [firstFrame, setFirstFrame] = useState(null); // base64-kuva
  const [firstFramePreview, setFirstFramePreview] = useState(null); // preview-url

  useEffect(() => {
    function handleResize() {
      const navbarHeight = navbarRef.current ? navbarRef.current.offsetHeight : 72;
      setSidebarContentHeight(window.innerHeight - navbarHeight);
      setIsMobile(window.innerWidth <= 600);
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

  // Gallerian grid-tyyli responsiivisesti
  const galleryGridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: isMobile ? '1rem' : '2rem',
    maxHeight: '70vh',
    overflowY: 'auto',
    width: '100%',
    maxWidth: '100%',
    padding: isMobile ? '0.5rem' : '1rem',
    margin: '0 auto',
    justifyItems: 'center',
  };

  // DRAG & DROP HANDLERIT
  function handleFirstFrameDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFirstFrame(ev.target.result);
        setFirstFramePreview(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  }
  function handleFirstFrameChange(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFirstFrame(ev.target.result);
        setFirstFramePreview(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  }
  function handleFirstFrameDragOver(e) {
    e.preventDefault();
  }
  function handleFirstFrameRemove() {
    setFirstFrame(null);
    setFirstFramePreview(null);
  }

  // GENEROI-LOMAKKEEN LÄHETYS
  async function handleGenerate(e) {
    if (e) e.preventDefault();
    setGenerating(true);
    setGenerateError(null);
    try {
      const payload = {
        mode,
        ratio,
        ...(mode === 'puhe' ? { voice, prompt } : { move }),
        ...(firstFrame ? { firstFrame } : {}),
      };
      const res = await fetch('https://samikiias.app.n8n.cloud/webhook/generate-ai-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Virhe generoinnissa');
      setShowSettings(false);
      setPrompt('');
      setFirstFrame(null);
      setFirstFramePreview(null);
    } catch (err) {
      setGenerateError(err.message || 'Tuntematon virhe');
    } finally {
      setGenerating(false);
    }
  }

  // DRAG & DROP KOMPONENTTI (käytetään sekä modalissa että sidebarissa)
  const firstFrameInput = (
    <div
      onDrop={handleFirstFrameDrop}
      onDragOver={handleFirstFrameDragOver}
      style={{
        border: '2px dashed #646cff',
        borderRadius: 12,
        padding: '1rem',
        textAlign: 'center',
        background: '#f5f6fa',
        margin: isMobile ? '1rem auto' : '1.5rem auto',
        cursor: 'pointer',
        position: 'relative',
        minHeight: 120,
        width: '100%',
        maxWidth: isMobile ? 320 : 200,
      }}
      onClick={() => document.getElementById('firstFrameInput').click()}
    >
      {firstFramePreview ? (
        <div style={{ position: 'relative' }}>
          <img src={firstFramePreview} alt="First frame preview" style={{ maxWidth: '100%', maxHeight: 180, borderRadius: 8 }} />
          <button type="button" onClick={e => { e.stopPropagation(); handleFirstFrameRemove(); }} style={{ position: 'absolute', top: 8, right: 8, background: '#fff', border: '1px solid #646cff', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', fontWeight: 700, color: '#646cff' }}>×</button>
        </div>
      ) : (
        <>
          <div style={{ color: '#646cff', fontWeight: 600, marginBottom: 8 }}>First frame</div>
          <div style={{ color: '#888', fontSize: 14 }}>Raahaa kuva tähän tai valitse tiedosto</div>
        </>
      )}
      <input
        id="firstFrameInput"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFirstFrameChange}
      />
    </div>
  );

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
      {/* Mobiilissa asetukset-nappi */}
      {isMobile && (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '0.5rem 1rem 0.5rem 1rem', background: '#f5f6fa', borderBottom: '1px solid #e0e0e0' }}>
          <button className="cta" style={{ width: 'auto', minWidth: 120 }} onClick={() => setShowSettings(true)}>
            Generointi
          </button>
        </div>
      )}
      {/* Varsinainen sisältö: sidebar + keskialue */}
      <div style={{ display: 'flex', flex: 1, width: '100%' }}>
        {/* Sidebar vain desktopilla */}
        {!isMobile && (
          <nav className="sidebar" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: `${sidebarContentHeight}px`, 
            minHeight: 0, 
            position: 'relative', 
            boxSizing: 'border-box',
            padding: '1.5rem 1rem 0 1rem',
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
              {/* First frame input */}
              {firstFrameInput}
              {/* Spacer to push button to bottom */}
              <div style={{ flex: 1 }}></div>
              <button className="cta" style={{ 
                width: '100%', 
                borderRadius: 8, 
                marginTop: '1rem',
                flexShrink: 0
              }} onClick={handleGenerate} disabled={generating}>
                {generating ? 'Generoidaan...' : 'Generoi'}
              </button>
            </div>
          </nav>
        )}
        {/* Keskialue: generoidut tiedot ja chat */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start', width: '100%', height: '100%', padding: 0, position: 'relative', minHeight: 'calc(100vh - 72px)', maxHeight: 'calc(100vh - 72px)', overflow: 'hidden' }}>
          {/* MODAL: mobiiliasetukset */}
          {isMobile && showSettings && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.25)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }} onClick={() => setShowSettings(false)}>
              <div style={{
                background: '#fff',
                borderRadius: 16,
                boxShadow: '0 4px 24px rgba(100, 108, 255, 0.18)',
                padding: '2rem 1.2rem 1.2rem 1.2rem',
                minWidth: 0,
                width: '90vw',
                maxWidth: 400,
                position: 'relative',
              }} onClick={e => e.stopPropagation()}>
                <button onClick={() => setShowSettings(false)} style={{ position: 'absolute', top: 10, right: 16, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#646cff' }}>&#10005;</button>
                <h3 style={{ marginTop: 0, marginBottom: 18, color: '#646cff', fontWeight: 700 }}>Generointi</h3>
                {/* Moodin valinta */}
                <div className="moodi-row" style={{ flexDirection: 'row', gap: '1rem', width: '100%', margin: '1rem 0 1rem 0' }}>
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
                {/* First frame input */}
                {firstFrameInput}
                {/* CHATBOX MODALIN SISÄÄN */}
                {mode === 'puhe' && (
                  <div style={{ width: '100%', margin: '1.5rem 0 0 0', background: '#f5f6fa', borderRadius: 12, border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 80 }}>
                    <textarea
                      placeholder="Kirjoita viesti..."
                      value={prompt}
                      onChange={e => setPrompt(e.target.value)}
                      style={{ width: '100%', minHeight: 60, border: 'none', background: 'transparent', fontSize: '1rem', padding: '1rem', resize: 'vertical', outline: 'none', borderRadius: 12 }}
                    />
                  </div>
                )}
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <button className="cta"
                    style={{ minWidth: 140, maxWidth: 200, borderRadius: 8, display: 'block', margin: '1.2rem 0 0 0' }}
                    onClick={handleGenerate} disabled={generating}>
                    {generating ? 'Generoidaan...' : 'Generoi'}
                  </button>
                </div>
                {generateError && (
                  <div style={{ color: 'red', textAlign: 'center', marginTop: 8 }}>{generateError}</div>
                )}
              </div>
            </div>
          )}
          <div className="generointi-content" style={{ flex: 1, width: '100%', maxWidth: '100vw', height: '100%', margin: 0, background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start', boxSizing: 'border-box', overflow: 'hidden', padding: 0, position: 'relative' }}>
            <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', minHeight: 0, overflow: 'auto' }}>
              {(() => {
                let arr = [];
                if (Array.isArray(data)) {
                  if (data.length > 0 && Array.isArray(data[0].allResults)) {
                    arr = data[0].allResults;
                  } else if (data.some(obj => Array.isArray(obj.allResults))) {
                    arr = data.flatMap(obj => Array.isArray(obj.allResults) ? obj.allResults : []);
                  } else {
                    arr = data;
                  }
                } else if (data && typeof data === 'object') {
                  if (Array.isArray(data.allResults)) {
                    arr = data.allResults;
                  } else {
                    arr = [data];
                  }
                }
                if (loading) return <span style={{ color: '#888', fontSize: 20 }}>Ladataan...</span>;
                if (error) return <span style={{ color: 'red', fontSize: 20 }}>{error}</span>;
                if (arr.length > 0) return (
                  <>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', flex: 1 }}>
                      <div style={{ ...galleryGridStyle, flex: 1, width: '100%', maxWidth: '100%', minHeight: 0, padding: '2rem 2vw' }}>
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
                  </>
                );
                return <span style={{ color: '#888' }}>Ei tietoja</span>;
              })()}
            </div>
            {/* Chatbox aina gallerian alareunassa */}
            <div style={{ width: '100%', background: '#f5f6fa', borderRadius: 0, border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 100, margin: 0, boxSizing: 'border-box', position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 2 }}>
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
    </div>
  )
}

export default Generointi; 