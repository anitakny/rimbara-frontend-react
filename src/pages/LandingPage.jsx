import GuestNavbar from '../components/GuestNavbar'
import Hero from '../components/LandingPage/Hero'
import AboutSection from '../components/LandingPage/AboutSection'
import FeaturesSection from '../components/LandingPage/FeaturesSection'
import EtalasePreview from '../components/LandingPage/EtalasePreview'
import MapPreview from '../components/LandingPage/MapPreview'
import ContributorShowcase from '../components/LandingPage/ContributorShowcase'
import LoginCTA from '../components/LandingPage/LoginCTA'
import Footer from '../components/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bone">
      <GuestNavbar />
      <main>
        <Hero />
        <AboutSection />
        <FeaturesSection />
        <EtalasePreview />
        <MapPreview />
        <ContributorShowcase />
        <LoginCTA />
      </main>
      <Footer />
    </div>
  )
}
