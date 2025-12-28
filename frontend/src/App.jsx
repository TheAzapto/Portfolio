import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Projects from './pages/Projects'
import Test from './pages/Test'
import NotFound from './pages/NotFound'
import Chat from './pages/Chat'

import Beams from './components/Beams';

function App() {
  return (
    <div className="app" >
      <div className="beams-container">
        <Beams
          beamWidth={4}
          beamHeight={15}
          beamNumber={12}
          lightColor="#ae00ff"
          speed={5}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={45}
        />
      </div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project" element={<Projects />} />
          <Route path="/project/:id" element={<Projects />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/test" element={<Test />} />
          {/* <Route path="/contact" element={<Contact />} /> */}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
