import './ProjectsPage.css'; // <-- Import the new CSS file
import { PageHeader } from '@/components/common/pageHeader/PageHeader';
import { ProjectGallerySection } from '@/components/common/projectGallerySection/ProjectGallerySection';
import { OurProcessSection } from '@/components/common/ourProcessSection/OurProcessSection';
import { TestimonialSection } from '@/components/common/testimonialSection/TestimonialSection';
import { RequestQuoteSection } from '@/components/common/requestQuoteSection/RequestQuoteSection';

const ProjectsPage = () => {
	return (
		<div className='projects-page-wrapper'>
			{' '}
			{/* <-- Add the wrapper class */}
			{/* 1. Page Title */}
			<PageHeader title='Our Work' />
			{/* 2. The new Filterable Project Gallery */}
			<ProjectGallerySection />
			{/* 3. How We Work (Crucial for high-value clients) */}
			<OurProcessSection />
			{/* 4. Social Proof (Reinforces quality) */}
			<TestimonialSection />
			{/* 5. Call to Action (The final step) */}
			<RequestQuoteSection />
		</div>
	);
};

export default ProjectsPage;
