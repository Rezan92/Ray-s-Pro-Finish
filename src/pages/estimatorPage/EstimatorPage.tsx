import { useState } from 'react';
import { PageHeader } from '@/components/common/pageHeader/PageHeader';
import { Button } from '@/components/common/button/Button';
import './EstimatorPage.css';

// Import our new, smaller components
import type {
	FormData,
	Estimate,
	PaintingRoom,
} from '@/components/common/estimator/EstimatorTypes';
import { EstimatorStep1 } from '@/components/common/estimator/EstimatorStep1';
import { EstimatorStep2 } from '@/components/common/estimator/EstimatorStep2';
import { EstimatorStep3 } from '@/components/common/estimator/EstimatorStep3';

// Import the API utility
import { getGeminiEstimate } from '@/utils/estimator/getGeminiEstimate';

// --- Helper function to create a blank room object ---
const createRoom = (id: string, name: string): PaintingRoom => ({
	id,
	name,
	dimensions: { length: '', width: '' },
	ceilingHeight: '8ft',
	scope: {
		walls: true,
		ceiling: false,
		trim: false,
		doors: false,
		doorCount: '',
	},
	condition: {
		currentColor: 'Light',
		newColor: 'Light',
		prep: 'Good',
	},
	furniture: 'Empty',
});

// --- Main Page Component ---
const EstimatorPage = () => {
	const [step, setStep] = useState(1);
	const [formData, setFormData] = useState<FormData>({
		services: { painting: false, patching: false, installation: false },
		painting: {
			spaces: {
				livingRoom: false,
				kitchen: false,
				hallway: false,
				stairwell: false,
				closets: false,
				bedroomCount: 0,
				bathroomCount: 0,
			},
			rooms: [],
			materials: 'Customer',
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
	});

	const [estimation, setEstimation] = useState<Estimate | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// --- Dynamic Room Generation Logic ---
	const updatePaintingRooms = (newSpaces: FormData['painting']['spaces']) => {
		let newRooms: PaintingRoom[] = [];

		if (newSpaces.livingRoom)
			newRooms.push(
				formData.painting.rooms.find((r) => r.id === 'livingRoom') ||
					createRoom('livingRoom', 'Living Room'),
			);
		if (newSpaces.kitchen)
			newRooms.push(
				formData.painting.rooms.find((r) => r.id === 'kitchen') ||
					createRoom('kitchen', 'Kitchen'),
			);
		if (newSpaces.hallway)
			newRooms.push(
				formData.painting.rooms.find((r) => r.id === 'hallway') ||
					createRoom('hallway', 'Hallway'),
			);
		if (newSpaces.stairwell)
			newRooms.push(
				formData.painting.rooms.find((r) => r.id === 'stairwell') ||
					createRoom('stairwell', 'Stairwell'),
			);
		if (newSpaces.closets)
			newRooms.push(
				formData.painting.rooms.find((r) => r.id === 'closets') ||
					createRoom('closets', 'Closets'),
			);

		// Handle Bedrooms
		for (let i = 1; i <= newSpaces.bedroomCount; i++) {
			const id = `bedroom-${i}`;
			newRooms.push(
				formData.painting.rooms.find((r) => r.id === id) ||
					createRoom(id, `Bedroom #${i}`),
			);
		}

		// Handle Bathrooms
		for (let i = 1; i <= newSpaces.bathroomCount; i++) {
			const id = `bathroom-${i}`;
			newRooms.push(
				formData.painting.rooms.find((r) => r.id === id) ||
					createRoom(id, `Bathroom #${i}`),
			);
		}

		return newRooms;
	};

	// --- Form Change Handlers ---
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
		path: 'painting' | 'patching' | 'installation',
		field: string,
		value: any,
	) => {
		setFormData((prev) => {
			const newFormData = { ...prev };
			(newFormData[path] as any)[field] = value;

			// If we changed the painting spaces, regenerate the rooms
			if (path === 'painting' && field === 'spaces') {
				newFormData.painting.rooms = updatePaintingRooms(
					value as FormData['painting']['spaces'],
				);
			}
			return newFormData;
		});
	};

	const onRoomCountChange = (
		roomType: 'bedroom' | 'bathroom',
		count: number,
	) => {
		const newSpaces = { ...formData.painting.spaces };
		if (roomType === 'bedroom') newSpaces.bedroomCount = count;
		if (roomType === 'bathroom') newSpaces.bathroomCount = count;

		setFormData((prev) => ({
			...prev,
			painting: {
				...prev.painting,
				spaces: newSpaces,
				rooms: updatePaintingRooms(newSpaces),
			},
		}));
	};

	const onRoomChange = (roomId: string, field: string, value: any) => {
		setFormData((prev) => ({
			...prev,
			painting: {
				...prev.painting,
				rooms: prev.painting.rooms.map((room) =>
					room.id === roomId ? { ...room, [field]: value } : room,
				),
			},
		}));
	};

	const onRoomScopeChange = (
		roomId: string,
		field: string,
		value: boolean,
	) => {
		setFormData((prev) => ({
			...prev,
			painting: {
				...prev.painting,
				rooms: prev.painting.rooms.map((room) =>
					room.id === roomId
						? { ...room, scope: { ...room.scope, [field]: value } }
						: room,
				),
			},
		}));
	};

	// --- Form Submission ---
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);
		setEstimation(null);

		try {
			// Call the imported function
			const estimate = await getGeminiEstimate(formData);
			setEstimation(estimate);
			setStep(2); // Move to result step
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
			<div className='estimator-container'>
				<form onSubmit={handleSubmit}>
					{/* --- Step 1: Service Selection --- */}
					<EstimatorStep1
						services={formData.services}
						handleServiceChange={handleServiceChange}
					/>

					{/* --- Step 2: Dynamic Detail Forms --- */}
					{isStep1Complete && (
						<EstimatorStep2
							formData={formData}
							onNestedChange={onNestedChange}
							onRoomChange={onRoomChange}
							onRoomScopeChange={onRoomScopeChange}
							onRoomCountChange={onRoomCountChange}
						/>
					)}

					{/* --- Step 3: Result (Shown on new step) --- */}
					{step === 2 && (
						<EstimatorStep3
							estimation={estimation}
							isLoading={isLoading}
							error={error}
							onBack={() => setStep(1)}
						/>
					)}

					{/* --- Main Submit Button --- */}
					{step === 1 && isStep1Complete && (
						<div className='estimator-actions'>
							<Button
								type='submit'
								variant='primary'
								disabled={isLoading}
								className='estimator-submit-btn'
							>
								{isLoading ? 'Calculating...' : 'Get My Estimate'}
							</Button>
						</div>
					)}
				</form>
			</div>
		</div>
	);
};

export default EstimatorPage;