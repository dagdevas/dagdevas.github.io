import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Services from './pages/Services';
import About from './pages/About';
import Contacts from './pages/Contacts';
import AdminLogin from './pages/Admin/Login';
import AdminLayout from './pages/Admin/Layout';
import AdminNews from './pages/Admin/News/List';
import AdminNewsEdit from './pages/Admin/News/Edit';
import AdminProducts from './pages/Admin/Products/List';
import AdminProductsEdit from './pages/Admin/Products/Edit';
import AdminCerts from './pages/Admin/Certifications/List';
import AdminCertsEdit from './pages/Admin/Certifications/Edit';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<Protected><AdminLayout /></Protected>}>
                <Route path="news" element={<AdminNews />} />
                <Route path="news/:id" element={<AdminNewsEdit />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/:id" element={<AdminProductsEdit />} />
                <Route path="certifications" element={<AdminCerts />} />
                <Route path="certifications/:id" element={<AdminCertsEdit />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

function Protected({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <AdminLogin />;
}

export default App;

