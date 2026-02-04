import styles from './ContactPage.module.css';
import { PageHeader } from '@/components/common/pageHeader/PageHeader';
import { ContactDetails } from '@/components/common/contactDetails/ContactDetails';
import { ContactForm } from '@/components/common/contactForm/ContactForm';

const ContactPage = () => {
	return (
		<div className={styles.contactPageWrapper}>
			{/* 1. Page Title */}
			<PageHeader title='Contact Us' />

			{/* 2. Main Content Grid */}
			<div className={styles.contactPageGrid}>
				{/* Column 1: Direct Contact Info */}
				<ContactDetails />

				{/* Column 2: Contact Form */}
				<ContactForm />
			</div>

			{/* You could optionally add the TestimonialSection here
          to add one last piece of social proof before the footer
      */}
			{/* <TestimonialSection /> */}
		</div>
	);
};

export default ContactPage;