import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Projects from './pages/Projects'
import Test from './pages/Test'
import NotFound from './pages/NotFound'
import Chat from './pages/Chat'

import FloatingLines from './components/FloatingLines';



function App() {
  return (
    <div className="app" >
      <FloatingLines
        enabledWaves={['top', 'middle', 'bottom']}
        // Array - specify line count per wave; Number - same count for all waves
        lineCount={[10, 15, 20]}
        // Array - specify line distance per wave; Number - same distance for all waves
        lineDistance={[8, 6, 4]}
        bendRadius={5.0}
        bendStrength={-0.5}
        interactive={true}
        parallax={true}
      />
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
