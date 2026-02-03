import logoImage from '@/assets/logo/Ray Drywall 1.png'; 
import styles from './Logo.module.css';

function Logo() {
  return (
    <a href="/" className={styles.logoLink}>
      <img 
        src={logoImage} 
        alt="Ray Drywall Logo" 
        className={styles.logoImage} 
      />
    </a>
  )
}

export default Logo