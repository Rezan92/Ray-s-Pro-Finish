import './AboutSection.css';
import { HardHat, Check } from 'lucide-react';
// Import the image using the @ alias we set up
import aboutImage from '@/assets/hero/Hero.png'; // Assuming you want to reuse the hero image, as per the design similarity.
// If it's a different image, update the path:
// import aboutImage from '@/assets/about/about-image.png';

export const AboutSection = () => {
  return (
    <section className="about-section">
      <div className="container">
        {/* Image Column */}
        <div className="image-column">
          <img src={aboutImage} alt="Construction worker" className="about-image" />
          {/* Orange floating icon box */}
          <div className="floating-icon-box">
            <HardHat size={40} color="var(--color-brand-dark)" />
          </div>
        </div>

        {/* Text Column */}
        <div className="text-column">
          <span className="about-section-subtitle">WELCOME TO WILCON</span>
          <h2 className="title">Wilcon A Construction Company</h2>

          <div className="intro-text">
            <Check size={24} className="intro-icon" />
            <p>
              We're in this business since 1975 and We provide the best
              industrial services
            </p>
          </div>

          <p className="description">
            Far far away, behind the word mountains, far from the countries
            Vokalia and Consonantia, there live the blind texts. Separated they
            live in Bookmarksgrove right at the coast of the Semantics, a large
            language ocean.
          </p>
          
          {/* Video part removed as requested */}
        </div>
      </div>
    </section>
  );
};

