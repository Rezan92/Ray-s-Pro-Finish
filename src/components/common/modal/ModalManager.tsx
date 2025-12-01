import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { closeModal } from '@/store/slices/uiSlice';
import { ProjectModal } from '../projectModal/ProjectModal';
import { ServiceModal } from '../serviceModal/ServiceModal';
import type { Project } from '../projectCard/ProjectCard';
import type { Service } from '../serviceModal/ServiceModal';

export const ModalManager = () => {
	const dispatch = useAppDispatch();
	const { isOpen, type, data } = useAppSelector((state) => state.ui.modal);

	if (!isOpen) return null;

	const handleClose = () => {
		dispatch(closeModal());
	};

	return (
		<>
			{type === 'project' && data && (
				<ProjectModal
					project={data as Project}
					onClose={handleClose}
				/>
			)}
			{type === 'service' && data && (
				<ServiceModal
					service={data as Service}
					onClose={handleClose}
				/>
			)}
		</>
	);
};
