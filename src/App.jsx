import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ActivatePage from './pages/auth/ActivatePage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import FeedPage from './pages/FeedPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import MyArticlePage from './pages/article/MyArticlePage'
import ArticleUploadPage from './pages/article/ArticleUploadPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/activate" element={<ActivatePage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/home" element={<FeedPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/articles/my"  element={<MyArticlePage />} />
        <Route path="/articles/new" element={<ArticleUploadPage />} />
      </Routes>
    </BrowserRouter>
  )
}
