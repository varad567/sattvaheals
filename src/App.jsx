import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SattvaLanding from './SattvaLanding'
import SattvaAuth from './SattvaAuth'
import HowItWorks from './HowItWorks'
import About from './About'
import Team from './Team'
import Consult from './Consult'
import Privacy from './Privacy'
import Admin from './Admin'
import NotFound from './NotFound'

export default function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Get current session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Listen for login/logout changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SattvaLanding user={user} />} />
        <Route path="/signup" element={<SattvaAuth defaultTab="signup" />} />
        <Route path="/login" element={<SattvaAuth defaultTab="login" />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />
        <Route path="/team" element={<Team />} />
        <Route path="/consult" element={<Consult />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}