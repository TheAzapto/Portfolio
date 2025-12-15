import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Projects from './pages/Projects'
import NotFound from './pages/NotFound'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project" element={<Projects />} />
          <Route path="/project/:id" element={<Projects />} />
          {/* <Route path="/contact" element={<Contact />} /> */}

          <Route path="*" element={<NotFound/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
