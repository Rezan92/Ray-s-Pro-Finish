import logoImage from '@/assets/logo/Ray Drywall 1.png'; 
import './Logo.css';

function Logo() {
  return (
    <a href="/" className="logo-link">
      <img 
        src={logoImage} 
        alt="Ray Drywall Logo" 
        className="logo-image" 
      />
    </a>
  )
}

export default Logo