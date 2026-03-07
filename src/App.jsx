import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SattvaLanding from './SattvaLanding'
import SattvaAuth from './SattvaAuth'
import HowItWorks from './HowItWorks'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SattvaLanding />} />
        <Route path="/signup" element={<SattvaAuth defaultTab="signup" />} />
        <Route path="/login" element={<SattvaAuth defaultTab="login" />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
      </Routes>
    </BrowserRouter>
  )
}