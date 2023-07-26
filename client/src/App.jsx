import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Home } from './pages/home'
import { Account } from './pages/account'
import { Navbar } from './components/navbar'
import { Auth } from './pages/login'
import { CreateRecipe } from './pages/create-recipe';
import { Footer } from './components/footer'

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/create-recipe" element={<CreateRecipe />} />
        <Route path="/account" element={<Account />} />
      </Routes>
      <Footer />
    </Router>
  )
}