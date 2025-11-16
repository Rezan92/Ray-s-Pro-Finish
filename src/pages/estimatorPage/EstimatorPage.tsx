import { useState } from 'react';
import { PageHeader } from '@/components/common/pageHeader/PageHeader';
import { Button } from '@/components/common/button/Button';
import './EstimatorPage.css';

// Import all your components
import type {
	FormData,
	Estimate,
	PaintingRoom, // We need this type
} from '@/components/common/estimator/EstimatorTypes';
import { EstimatorStep1 } from '@/components/common/estimator/EstimatorStep1';
import { EstimatorStep2 } from '@/components/common/estimator/EstimatorStep2';
import { EstimatorStep3 } from '@/components/common/estimator/EstimatorStep3';
import { getGeminiEstimate } from '@/utils/estimator/getGeminiEstimate';
// We no longer need EstimatorStep2Nav or PaintingRoomDetails

// --- NEW HELPER to create a default room ---
const createNewRoom = (
	type: string,
	id: string,
	label: string
): PaintingRoom => {
	const isStairwell = type === 'stairwell';
	return {
		id,
		type,
		label,
		size: 'Medium',
		ceilingHeight: isStairwell ? '11ft+' : '8ft', // Auto-set for stairwell
		surfaces: { walls: true, ceiling: false, trim: false, doors: false },
		wallCondition: 'Good',
		colorChange: 'Similar',
		// Set defaults for conditional fields
		ceilingTexture: 'Flat',
		trimCondition: 'Good',
		doorCount: '1',
		doorStyle: 'Slab',
	};
};

// --- ADD THIS MAP RIGHT HERE ---
// Helper map for labels
const ROOM_LABELS: { [key: string]: string } = {
	livingRoom: 'Living Room',
	kitchen: 'Kitchen',
	bedroom: 'Bedroom',
	bathroom: 'Bathroom',
	hallway: 'Hallway',
	stairwell: 'Stairwell',
	closet: 'Closet',
};

// (EstimatorProgressBar and EstimatorStepContact components stay the same)
const EstimatorProgressBar: React.FC<{ currentStep: number }> = ({
	currentStep,
}) => {
	const steps = ['Services', 'Details', 'Contact', 'Estimate'];
	return (
		<div className='estimator-progress-bar'>
			{steps.map((label, index) => {
				const stepNum = index + 1;
				let status = '';
				if (stepNum < currentStep) status = 'completed';
				if (stepNum === currentStep) status = 'active';

				return (
					<div
						key={label}
						className={`step-item ${status}`}
					>
						{label}
					</div>
				);
			})}
		</div>
	);
};

const EstimatorStepContact: React.FC<{
	onFormChange: (field: string, value: string) => void;
}> = ({ onFormChange }) => {
	return (
		<div className='estimator-step'>
			<h2 className='estimator-title'>Your Information</h2>
			<p className='estimator-subtitle'>
				One last step. Please provide your contact info to see your instant
				estimate.
			</p>
			<div className='form-group-grid'>
				<div className='form-group'>
					<label htmlFor='name'>Full Name*</label>
					<input
						type='text'
						id='name'
						name='name'
						onChange={(e) => onFormChange('name', e.target.value)}
						required
					/>
				</div>
				<div className='form-group'>
					<label htmlFor='email'>Email*</label>
					<input
						type='email'
						id='email'
						name='email'
						onChange={(e) => onFormChange('email', e.target.value)}
						required
					/>
				</div>
			</div>
			<div className='form-group'>
				<label htmlFor='phone'>Phone</label>
				<input
					type='tel'
					id='phone'
					name='phone'
					onChange={(e) => onFormChange('phone', e.target.value)}
				/>
			</div>
			<p className='form-hint'>
				We'll use this to email you a copy of your estimate.
			</p>
		</div>
	);
};

// --- Main Page Component ---
const EstimatorPage = () => {
	const [currentStep, setCurrentStep] = useState(1);
	// We no longer need activeDetail

	const [formData, setFormData] = useState<FormData>({
		services: { painting: false, patching: false, installation: false },
		painting: {
			rooms: [], // Start with an empty array of rooms
			paintProvider: '',
			furniture: '',
		},
		patching: {
			quantity: '1-3',
			location: ['Wall'],
			largest_size: 'Fist-sized',
			texture: "I don't know",
			scope: 'Patch only',
		},
		installation: {
			project_type: 'New construction',
			sqft: '',
			ceilingHeight: '8 ft',
			scope: 'Hang, tape, finish',
			finish: 'Level 4',
		},
		contact: {
			name: '',
			email: '',
			phone: '',
		},
	});

	const [estimation, setEstimation] = useState<Estimate | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// --- NEW Painting Logic Handlers ---

	// Helper function to get a new unique ID for multi-rooms
	const getNewRoomIndex = (type: string) => {
		return formData.painting.rooms.filter((r) => r.type === type).length;
	};

	const handlePaintingRoomAdd = (type: string) => {
		setFormData((prev) => {
			const newIndex = getNewRoomIndex(type);
			const newId = `${type}_${newIndex}`;
			const newLabel =
				type === 'bedroom' || type === 'bathroom'
					? `${ROOM_LABELS[type]} ${newIndex + 1}`
					: ROOM_LABELS[type];

			const newRoom = createNewRoom(type, newId, newLabel);

			return {
				...prev,
				painting: {
					...prev.painting,
					rooms: [...prev.painting.rooms, newRoom],
				},
			};
		});
	};

	const handlePaintingRoomTypeToggle = (type: string, isChecked: boolean) => {
		setFormData((prev) => {
			let newRooms = [...prev.painting.rooms];

			if (isChecked) {
				// Add the *first* room of this type (e.g., "Bedroom 1")
				const newIndex = getNewRoomIndex(type);
				if (newIndex === 0) {
					// Only add if it doesn't exist
					const newId = `${type}_0`;
					const newLabel =
						type === 'bedroom' || type === 'bathroom'
							? `${ROOM_LABELS[type]} 1`
							: ROOM_LABELS[type];
					const newRoom = createNewRoom(type, newId, newLabel);
					newRooms.push(newRoom);
				}
			} else {
				// Remove *all* rooms of this type
				newRooms = newRooms.filter((room) => room.type !== type);
			}

			return {
				...prev,
				painting: {
					...prev.painting,
					rooms: newRooms,
				},
			};
		});
	};

	const handlePaintingRoomRemove = (roomId: string) => {
		setFormData((prev) => ({
			...prev,
			painting: {
				...prev.painting,
				rooms: prev.painting.rooms.filter((room) => room.id !== roomId),
			},
		}));
	};

	// Updates a field inside a specific room card
	const handlePaintingRoomChange = (
		roomId: string,
		field: string,
		value: any
	) => {
		setFormData((prev) => ({
			...prev,
			painting: {
				...prev.painting,
				rooms: prev.painting.rooms.map((room) =>
					room.id === roomId ? { ...room, [field]: value } : room
				),
			},
		}));
	};

	// Updates the global painting questions
	const handlePaintingGlobalChange = (field: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			painting: {
				...prev.painting,
				[field]: value,
			},
		}));
	};

	// --- Other Form Handlers ---
	const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			services: {
				...prev.services,
				[name]: checked,
			},
		}));
	};

	const onNestedChange = (
		path: 'patching' | 'installation',
		field: string,
		value: any
	) => {
		setFormData((prev) => ({
			...prev,
			[path]: {
				...prev[path],
				[field]: value,
			},
		}));
	};

	const handleContactChange = (field: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			contact: {
				...prev.contact,
				[field]: value,
			},
		}));
	};

	// (handleSubmit, handleNext, handleBack are simplified)
	const handleNext = () => {
		setCurrentStep((prev) => prev + 1);
		window.scrollTo(0, 0); // Scroll to top on step change
	};

	const handleBack = () => {
		setCurrentStep((prev) => prev - 1);
		window.scrollTo(0, 0);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setCurrentStep(4);
		window.scrollTo(0, 0);
		setIsLoading(true);
		setError(null);
		setEstimation(null);

		try {
			// Call the imported function
			const estimate = await getGeminiEstimate(formData);
			setEstimation(estimate);
		} catch (err) {
			let message =
				'There was an error generating your estimate. Please try again or contact us directly.';
			if (err instanceof Error) {
				message = err.message; // Pass along specific errors
			}
			setError(message);
		} finally {
			setIsLoading(false);
		}
	};

	const { services } = formData;
	const isStep1Complete =
		services.painting || services.patching || services.installation;

	return (
		<div className='estimator-page-wrapper'>
			<PageHeader title='Instant Estimator' />
			{/* No more 'wide' class needed */}
			<div className='estimator-container'>
				<EstimatorProgressBar currentStep={currentStep} />

				<form onSubmit={handleSubmit}>
					{/* --- Step 1 --- */}
					{currentStep === 1 && (
						<>
							<EstimatorStep1
								services={formData.services}
								handleServiceChange={handleServiceChange}
							/>
							{isStep1Complete && (
								<div className='estimator-actions'>
									<Button
										type='button'
										variant='primary'
										onClick={handleNext}
										className='estimator-submit-btn'
									>
										Next: Project Details
									</Button>
								</div>
							)}
						</>
					)}

					{/* --- Step 2 --- */}
					{currentStep === 2 && (
						<>
							<EstimatorStep2
								formData={formData}
								onNestedChange={onNestedChange}
								// Pass all the new painting handlers
								onPaintingRoomTypeToggle={handlePaintingRoomTypeToggle}
								onPaintingRoomAdd={handlePaintingRoomAdd}
								onPaintingRoomRemove={handlePaintingRoomRemove}
								onPaintingRoomChange={handlePaintingRoomChange}
								onPaintingGlobalChange={handlePaintingGlobalChange}
							/>
							<div className='estimator-actions space-between'>
								<Button
									type='button'
									variant='dark'
									onClick={handleBack}
									className='result-back-btn'
								>
									Back
								</Button>
								<Button
									type='button'
									variant='primary'
									onClick={handleNext}
								>
									Next: Your Info
								</Button>
							</div>
						</>
					)}

					{/* --- Step 3 --- */}
					{currentStep === 3 && (
						<>
							<EstimatorStepContact onFormChange={handleContactChange} />
							<div className='estimator-actions space-between'>
								<Button
									type='button'
									variant='dark'
									onClick={handleBack}
									className='result-back-btn'
								>
									Back
								</Button>
								<Button
									type='submit'
									variant='primary'
									disabled={isLoading}
								>
									{isLoading ? 'Calculating...' : 'See My Estimate'}
								</Button>
							</div>
						</>
					)}

					{/* --- Step 4 --- */}
					{currentStep === 4 && (
						<EstimatorStep3
							estimation={estimation}
							isLoading={isLoading}
							error={error}
							onBack={() => setCurrentStep(3)}
						/>
					)}
				</form>
			</div>
		</div>
	);
};

export default EstimatorPage;
