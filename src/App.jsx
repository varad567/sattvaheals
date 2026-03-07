import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SattvaLanding from './SattvaLanding'
import SattvaAuth from './SattvaAuth'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SattvaLanding />} />
        <Route path="/signup" element={<SattvaAuth defaultTab="signup" />} />
        <Route path="/login" element={<SattvaAuth defaultTab="login" />} />
      </Routes>
    </BrowserRouter>
  )
}