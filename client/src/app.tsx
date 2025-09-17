import {BrowserRouter  as Router, Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        //PAGINA DE INICIO
        <Route path="/" element={<Home />} />

        //PAGINAS DE AUTENTICACION
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
