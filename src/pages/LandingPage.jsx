import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import AboutSection from '../components/AboutSection'
import FeaturesSection from '../components/FeaturesSection'
import EtalasePreview from '../components/EtalasePreview'
import MapPreview from '../components/MapPreview'
import ContributorShowcase from '../components/ContributorShowcase'
import LoginCTA from '../components/LoginCTA'
import Footer from '../components/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bone">
      <Navbar />
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
