import { Route, Routes } from 'react-router-dom'
import './css/App.css'
import Home from "./pages/Home"
import Favourites from './pages/Favourites'
import NavBar from './components/NavBar'
import { MovieProvider } from './contexts/MovieContext'
import Watch from './components/Watch'
function App() {
  return (
    <MovieProvider>
      <NavBar/>
      <main className='main-content'>
      <Routes>
        <Route path='/' element = {<Home/>}></Route>
        <Route path='/favourites' element = {<Favourites/>}></Route>
        <Route path="/watch/:id" element={<Watch />} />
      </Routes>
    </main>
    </MovieProvider>
  )
}

export default App
