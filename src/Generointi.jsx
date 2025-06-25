import { useState } from 'react'
import favicon from '/favicon.png'
import './App.css'

const ratioOptions = ['16:9', '1:1', '9:16'];
const voiceOptions = ['Ääni 1', 'Ääni 2', 'Ääni 3', 'Ääni 4', 'Ääni 5'];
const moveOptions = ['Liike 1', 'Liike 2', 'Liike 3', 'Liike 4', 'Liike 5'];

function Generointi() {
  const [active, setActive] = useState(0); // sidebar
  const [mode, setMode] = useState('puhe');
  const [ratio, setRatio] = useState(ratioOptions[0]);
  const [voice, setVoice] = useState(voiceOptions[0]);
  const [move, setMove] = useState(moveOptions[0]);
  const [prompt, setPrompt] = useState('');
  const valinnat = [
    'Newsletter',
    'Blog',
    'Video',
  ];
  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh' }}>
      <nav className="sidebar">
        <div className="sidebar-content">
          <h3>Valikko</h3>
          <ul>
            {valinnat.map((v, i) => (
              <li
                key={v}
                className={active === i ? 'active' : ''}
                onClick={() => setActive(i)}
              >
                {v}
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <nav className="navbar">
          <div className="navbar-left">
            <img src={favicon} alt="Favicon" className="favicon" />
            <span className="brand">Finfluenser</span>
          </div>
          <div className="navbar-right">
            <a href="/">Etusivu</a>
          </div>
        </nav>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', position: 'relative' }}>
          {/* Mode valinta */}
          <div style={{ display: 'flex', gap: '1rem', margin: '2rem 0 1rem 0' }}>
            <button
              className={mode === 'puhe' ? 'mode-btn active' : 'mode-btn'}
              onClick={() => setMode('puhe')}
            >
              Puhe
            </button>
            <button
              className={mode === 'liike' ? 'mode-btn active' : 'mode-btn'}
              onClick={() => setMode('liike')}
            >
              Liike
            </button>
          </div>
          {/* Kuvasuhdevalinnat */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            {ratioOptions.map(r => (
              <button
                key={r}
                className={ratio === r ? 'ratio-btn active' : 'ratio-btn'}
                onClick={() => setRatio(r)}
              >
                {r}
              </button>
            ))}
          </div>
          {/* Vaihtoehdot */}
          {mode === 'puhe' ? (
            <div style={{ width: '100%', maxWidth: 500, marginBottom: '1.5rem' }}>
              <div style={{ marginBottom: '1rem', fontWeight: 500 }}>Ääni:</div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {voiceOptions.map(v => (
                  <button
                    key={v}
                    className={voice === v ? 'option-btn active' : 'option-btn'}
                    onClick={() => setVoice(v)}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ width: '100%', maxWidth: 500, marginBottom: '1.5rem' }}>
              <div style={{ marginBottom: '1rem', fontWeight: 500 }}>Liike:</div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {moveOptions.map(m => (
                  <button
                    key={m}
                    className={move === m ? 'option-btn active' : 'option-btn'}
                    onClick={() => setMove(m)}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Generoinnin eteneminen ja tulokset */}
          <div className="generointi-content" style={{ width: '100%', maxWidth: 600, margin: '0 auto' }}>
            <h2>Generoinnin tila</h2>
            <p>Tähän tulee generoinnin eteneminen ja tulokset.</p>
          </div>
          {/* Prompt-laatikko */}
          {mode === 'puhe' && (
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
              <input
                type="text"
                placeholder="Kirjoita prompt..."
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                style={{ width: 400, maxWidth: '90%', padding: '0.75rem 1rem', borderRadius: 8, border: '1px solid #ccc', fontSize: '1rem' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Generointi; 