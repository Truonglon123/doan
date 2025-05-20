import { Routes, Route } from 'react-router-dom'
import About from './Pages/About'
import NotFound from './Pages/NotFound'
import Home from './Pages/Home'
import Contact from './Pages/Contact'
import ProductDetail from './Pages/ProductDetail'
import Category from './Pages/Category'
import Login from './Pages/Login'
import Register from './Pages/Register'
import VerifyEmail from './Pages/VerifyEmail'
import Payment from './Pages/Payment'
import PrivateRoute from './routes/PrivateRoute'
import OrderSuccess from './Pages/OrderSuccess'

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/product/:slug" element={<ProductDetail />} />
      <Route path="/category/:slug" element={<Category />} />
      <Route path="/payment" element={<PrivateRoute />}>
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment/order-success" element={<OrderSuccess />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRouter
