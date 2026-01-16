import { Routes, Route, useLocation } from 'react-router-dom'
import Home from "./pages/Home"
import Favourites from './pages/Favourites'
import NavBar from './components/NavBar'
import Watch from './components/Watch'
import { MovieProvider } from './contexts/MovieContext'
import './css/App.css'

function App() {
  const location = useLocation();
  const isWatchPage = location.pathname.startsWith('/watch');

  return (
    <MovieProvider>
      {!isWatchPage && <NavBar />}
      <main className='main-content'>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/favourites' element={<Favourites/>} />
          <Route path="/watch/:id" element={<Watch />} />
        </Routes>
      </main>
    </MovieProvider>
  )
}

export default App