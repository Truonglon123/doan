import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import MainLayout from './Layouts/MainLayout.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './Context/AuthContext.tsx'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { CartProvider } from './Context/CartContext.tsx'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <CartProvider>
      <AuthProvider>
        <BrowserRouter>
          <MainLayout>
            <App />
            <ToastContainer position='top-center' />
          </MainLayout>
        </BrowserRouter>
      </AuthProvider>
    </CartProvider>
  // </StrictMode>,
)
