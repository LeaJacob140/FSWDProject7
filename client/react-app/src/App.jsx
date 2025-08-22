import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import AddProduct from './pages/AddProduct';
import { useState, useEffect } from 'react';
import { CartProvider } from "./pages/CartContext.jsx";
// import AdminPanel from './pages/AdminPanel';

function App() {
    const [user, setUser] = useState(null);
    useEffect(() => {
      const fetchUser = async () => {
        const token = localStorage.getItem('token'); // your JWT
        console.log('Token:', token);
        if (!token){
          console.log('No token found');
          return;
        } 

        try {
          const res = await fetch('http://localhost:5001/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (res.ok) {
            const data = await res.json();
            console.log('User data:', data);
            setUser(data); // backend returns the user object directly
          } else {
            setUser(null);
            console.error('Failed to fetch user:', res.statusText);
          }
        } catch (err) {
          console.error('Failed to fetch user:', err);
          
          setUser(null);
        }
      };

      fetchUser();
    }, []);

  return (
    <BrowserRouter>
        <CartProvider user={user}>

      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/home" element={<Home user={user} setUser={setUser}/>} />
        <Route path="/admin" element={<AddProduct user={user} />} /> 
      </Routes>
    </CartProvider>

  </BrowserRouter>

  );
}

export default App;
// new
