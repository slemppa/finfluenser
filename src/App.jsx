import { Routes, Route } from 'react-router-dom'
import LandingPage from './LandingPage'
import Generointi from './Generointi'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/generointi" element={<Generointi />} />
    </Routes>
  )
}

export default App
