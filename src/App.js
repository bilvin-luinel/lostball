import { Route, Routes } from 'react-router-dom';
import './App.css';
import AppLayout from './layout/AppLayout/AppLayout';
import Home from './page/Home/Home';
import Admin from './page/Admin/Admin';
import NotFound from './page/NotFound/NotFound'
import AdminLayout from './layout/AdminLayout/AdminLayout'
import AdminProducts from './page/AdminProducts/AdminProducts';
import AdminAddProduct from './page/AdminAddProduct/AdminAddProduct';
import Product from './page/Product/Product';
import Products from './page/Products/Products';
import Inquiry from './page/Inquiry/Inquiry';
import AboutUs from './page/AboutUs/AboutUs';
import Contact from './page/Contact/Contact';
import AfterInquiry from './page/AfterInquiry/AfterInquiry';
import AdminCategory from './page/AdminCategory/AdminCategory';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path='about-us' element={<AboutUs />} />
          <Route path='products' element={<Products />} />
          <Route path='contact' element={<Contact />} />
          <Route path='product/:id' element={<Product />} />
          <Route path='inquiry' element={<Inquiry />} />
        </Route>
        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<Admin />} />
          <Route path='products' element={<AdminProducts />} />
          <Route path='add-product' element={<AdminAddProduct />} />
          <Route path='category' element={<AdminCategory />} />
        </Route>

        <Route path='/after-inquiry' element={<AfterInquiry />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
