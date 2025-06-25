import favicon from '/favicon.png'
import reactLogo from './assets/react.svg'
import { useNavigate } from 'react-router-dom'
import './App.css'

function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="app-container">
      {/* Ylävalikko */}
      <nav className="navbar">
        <div className="navbar-left">
          <img src={favicon} alt="Favicon" className="favicon" />
          <span className="brand">Finfluenser</span>
        </div>
        <div className="navbar-right">
          <a href="#">Etusivu</a>
          <a href="#">Ominaisuudet</a>
          <a href="#">Yhteystiedot</a>
        </div>
      </nav>
      {/* Hero-osio */}
      <section className="hero">
        <div className="hero-text">
          <h1>Tervetuloa Finfluenseriin</h1>
          <p>Luo vaikuttavia videoita tekoälyn avulla helposti ja nopeasti.</p>
          <button className="cta" onClick={() => navigate('/generointi')}>Aloita nyt</button>
        </div>
        <div className="hero-image">
          <img src={favicon} alt="Hero kuva" style={{ width: '100%', height: '100%' }} />
        </div>
      </section>
    </div>
  )
}

export default LandingPage; 