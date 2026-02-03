import { Phone, MapPin } from 'lucide-react';
import ContactInfoBlock from '../contactInfoBlock/ContactInfoBlock';
import Logo from '../logo/Logo';
import styles from './TopBar.module.css';

function TopBar() {
	return (
		<>
			<header className={styles.topBar}>
				<div className={styles.container}>
					<div className={styles.logoWrapper}>
						<Logo />
					</div>
					<div className={styles.contactWrapper}>
						<ContactInfoBlock
							icon={Phone} // You can also use MessageSquare here if you prefer
							bold='Call or Text: '
							title='773-799-0006'
							subtitle='Mon-Fri, 8:00 AM - 6:00 PM'
						/>
					</div>
					<div className={styles.contactWrapper}>
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
