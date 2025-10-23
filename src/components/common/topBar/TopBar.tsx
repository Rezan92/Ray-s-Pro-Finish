import { Phone, MapPin } from 'lucide-react';
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
							icon={Phone}
              bold = 'Free Call: '
							title='+1 234 456 78910'
							subtitle='Call Us Now 24/7 Customer Support'
						/>
					</div>
					<div className='contact-wrapper'>
						<ContactInfoBlock
							icon={MapPin}
							title='Our Location'
							subtitle='198 West 21th Street, Suite 721 New York NY 10016'
						/>
					</div>
				</div>
			</header>
		</>
	);
}

export default TopBar;
