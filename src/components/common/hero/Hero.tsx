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
		<section
			className='hero'
			style={heroStyle}
		>
			<div className='hero-overlay'></div> {/* Dark overlay */}
			<div className='hero-container'>
				<div className='hero-content'>
					<h1 className='hero-title'>
						WE BUILD
						<br />
						GREAT PROJECTS
					</h1>
					<p className='hero-subtitle'>
						Far far away, behind the word mountains, far from the countries
						Vokalia and Consonantia, there live the blind texts. Separated they
						live in Bookmarksgrove.
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
							to='/contact'
							variant='light'
							className='hero-button'
						>
							Request a Quote
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Hero;
