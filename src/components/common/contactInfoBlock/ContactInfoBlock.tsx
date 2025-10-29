import './ContactInfoBlock.css';

interface ContactInfoBlockProps {
	// We pass the icon component itself as a prop
	icon: React.ElementType;
	bold?: string;
	title: string;
	subtitle: string;
}

function ContactInfoBlock({
	icon: Icon,
	bold,
	title,
	subtitle,
}: ContactInfoBlockProps) {
	return (
		<div className='contact-block'>
			<div className='contactInfo-icon-wrapper'>
				<Icon size={30} />
			</div>
			<div className='text-wrapper'>
				<span className='title'>
					<span className='bold'>{bold}</span>
					{title}
				</span>
				<span className='subtitle'>{subtitle}</span>
			</div>
		</div>
	);
}

export default ContactInfoBlock;
