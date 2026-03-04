import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import NavBar from './ui/layout/NavBar';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import ForYou from './pages/ForYou';
import Following from './pages/Following';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Error404 from './pages/Error404';
import './index.css';

const Layout = () => {
  return (
    <div>
      <NavBar />
      <Outlet />
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="foryou" element={<ForYou />} />
          <Route path="following" element={<Following />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<Error404 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

export default App;