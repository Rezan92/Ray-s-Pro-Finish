import './Hero.css';
import { Button } from '../button/Button';
// Use the @ alias for a clean path to assets
import heroImage from '@/assets/hero/Hero.png';

const Hero = () => {
	// We apply the background image via inline style for dynamic import
	const heroStyle = {
		backgroundImage: `url(${heroImage})`,
	};

	return (
		<div className='hero-container-wrapper'>
			<section
				className='hero'
				style={heroStyle}
			>
				<div className='hero-overlay'></div> {/* Dark overlay */}
				<div className='hero-container'>
					<div className='hero-content'>
						<h1 className='hero-title'>
							EXPERT DRYWALL REPAIR
							<br />& INTERIOR PAINTING
						</h1>
						<p className='hero-subtitle'>
							From seamless drywall patching and installation to a flawless,
							high-quality paint finish, we make your walls look perfect.
						</p>
						<div className='hero-actions'>
							<Button
								to='/services'
								variant='primary'
								className='hero-button'
							>
								Our Services
							</Button>
							<Button
								to='/estimator'
								variant='light'
								className='hero-button'
							>
								Get an Instant Estimate
							</Button>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Hero;