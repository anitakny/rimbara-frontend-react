import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ActivatePage from './pages/auth/ActivatePage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import FeedPage from './pages/FeedPage'
import ProfilePage from './pages/ProfilePage'
import DisplayPage from './pages/DisplayPage'
import LeaderboardPage from './pages/LeaderboardPage'
import DisplayCategoryPage from './pages/display/DisplayCategoryPage'
import SettingsPage from './pages/SettingsPage'
import MyArticlePage from './pages/article/MyArticlePage'
import ArticleUploadPage from './pages/article/ArticleUploadPage'
import ArticleEditPage from './pages/article/ArticleEditPage'
import ArticleDetailPage from './pages/article/ArticleDetailPage'
import ArticlePage from './pages/ArticlePage'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/activate" element={<ActivatePage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/home" element={<FeedPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/display" element={<DisplayPage />} />
        <Route path="/display/:pubType" element={<DisplayCategoryPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/articles/my"  element={<MyArticlePage />} />
        <Route path="/articles/new" element={<ArticleUploadPage />} />
        <Route path="/articles/:id/edit" element={<ArticleEditPage />} />
        <Route path="/articles/:id" element={<ArticleDetailPage />} />
        <Route path="/review" element={<ArticlePage />} />
      </Routes>
    </BrowserRouter>
  )
}
