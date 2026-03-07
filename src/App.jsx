import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SattvaLanding from './SattvaLanding'
import SattvaAuth from './SattvaAuth'
import HowItWorks from './HowItWorks'
import About from './About'
import NotFound from './NotFound'
import Team from './Team'
import Consult from './Consult'


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SattvaLanding />} />
        <Route path="/signup" element={<SattvaAuth defaultTab="signup" />} />
        <Route path="/login" element={<SattvaAuth defaultTab="login" />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/team" element={<Team />} />
        <Route path="/consult" element={<Consult />} />
      </Routes>
    </BrowserRouter>
  )
}