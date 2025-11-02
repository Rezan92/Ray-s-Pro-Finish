import './RequestQuoteSection.css';
// Using a relative path to fix the import error
import { Button } from '@/components/common/button/Button';

export const RequestQuoteSection = () => {
	return (
		<section className='request-quote-section'>
			{/* The background image and dark overlay are handled by the CSS */}
			<div className='request-quote-content'>
				<h2 className='request-quote-title'>Ready to Transform Your Space?</h2>
				<p className='request-quote-description'>
					Let's talk about your project. Whether it's a single wall patch or a
					full interior paint job, we provide fast, free, and no-obligation
					estimates.
				</p>
				<Button
					variant='primary'
					to='/contact'
				>
					GET A FREE ESTIMATE
				</Button>
			</div>
		</section>
	);
};
