import { Phone, MapPin, MessageSquare } from 'lucide-react'; // Added MessageSquare
import ContactInfoBlock from '../contactInfoBlock/ContactInfoBlock';
import Logo from '../logo/Logo';
import './TopBar.css';

function TopBar() {
	return (
		<>
			<header className='top-bar'>
				<div className='container'>
					<div className='logo-wrapper'>
						<Logo />
					</div>
					<div className='contact-wrapper'>
						<ContactInfoBlock
							icon={Phone} // You can also use MessageSquare here if you prefer
							bold='Call or Text: '
							title='773-799-0006'
							subtitle='Mon-Fri, 8:00 AM - 6:00 PM'
						/>
					</div>
					<div className='contact-wrapper'>
						<ContactInfoBlock
							icon={MapPin}
							title='Our Service Area'
							subtitle='Serving Wheaton, Lombard & Chicagoland Suburbs'
						/>
					</div>
				</div>
			</header>
		</>
	);
}

export default TopBar;
