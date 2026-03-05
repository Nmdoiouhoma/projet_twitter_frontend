import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import NavBar from './ui/layout/NavBar';
import CurrentUserBadge from './ui/layout/CurrentUserBadge';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import ForYou from './pages/ForYou';
import Following from './pages/Following';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Error404 from './pages/Error404';
import './index.css';

const Layout = () => {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f5f8fa',
      }}
    >
      <NavBar />
      <main
        style={{
          marginLeft: '230px', // largeur de la sidebar
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '650px',
            borderLeft: '1px solid #e1e8ed',
            borderRight: '1px solid #e1e8ed',
            backgroundColor: '#ffffff',
            minHeight: '100vh',
          }}
        >
          <Outlet />
        </div>
      </main>
      <CurrentUserBadge />
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
          <Route path="notifications" element={<Notifications />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="profile/:userName" element={<Profile />} />
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