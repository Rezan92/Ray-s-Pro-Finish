import React, { useMemo } from 'react';
import { PaintingRoomCard } from './PaintingRoomCard';
import type { FormData } from './EstimatorTypes';
import styles from './styles/PaintingForm.module.css';

// Define the props it will receive from EstimatorPage
interface PaintingFormProps {
	formData: FormData;
	onRoomTypeToggle: (type: string, isChecked: boolean) => void;
	onRoomChange: (roomId: string, field: string, value: any) => void;
	onRoomAdd: (type: string) => void;
	onRoomRemove: (roomId: string) => void;
	onGlobalChange: (field: string, value: string) => void;
}

// Define our room types and labels
const ROOM_TYPES = [
	{ key: 'livingRoom', label: 'Living Room' },
	{ key: 'diningRoom', label: 'Dining Room' },
	{ key: 'kitchen', label: 'Kitchen' },
	{ key: 'bedroom', label: 'Bedroom' },
	{ key: 'bathroom', label: 'Bathroom' },
	{ key: 'office', label: 'Office / Study' },
	{ key: 'basement', label: 'Basement' },
	{ key: 'hallway', label: 'Hallway' },
	{ key: 'stairwell', label: 'Stairwell' },
	{ key: 'laundryRoom', label: 'Laundry Room' },
	{ key: 'garage', label: 'Garage' },
	{ key: 'closet', label: 'Closet' },
	{ key: 'other', label: 'Other' },
];

// Helper to determine if a room type is multi-room
const isMultiRoom = (type: string) => type === 'bedroom' || type === 'bathroom';

export const PaintingForm: React.FC<PaintingFormProps> = ({
	formData,
	onRoomTypeToggle,
	onRoomChange,
	onRoomAdd,
	onRoomRemove,
	onGlobalChange,
}) => {
	const { painting } = formData;

	// Helper to hide "Add Another" button if limit reached
	const getRoomCount = (type: string) =>
		painting.rooms.filter((r) => r.type === type).length;
	// Create a map of which room types are checked
	const checkedTypes = useMemo(() => {
		const typeMap = new Map<string, boolean>();
		painting.rooms.forEach((room) => {
			typeMap.set(room.type, true);
		});
		return typeMap;
	}, [painting.rooms]);

	return (
		<div className={styles.serviceFormBox}>
			<h3 className={styles.serviceFormTitle}>Interior Painting</h3>

			{/* --- A. The Room Builder --- */}
			<div className={styles.formGroupBox}>
				<div className={styles.formGroup}>
					<label>Please add the spaces you'd like us to paint.</label>
					<div className={styles.checkboxGroupTwoColumn}>
						{ROOM_TYPES.map((type) => {
							const isChecked = checkedTypes.get(type.key) || false;
							return (
								<label
									key={type.key}
									className={styles.checkboxLabel}
								>
									<input
										type='checkbox'
										checked={isChecked}
										onChange={(e) =>
											onRoomTypeToggle(type.key, e.target.checked)
										}
									/>
									{type.label}
								</label>
							);
						})}
					</div>
				</div>
			</div>

			{/* --- B. The Generated Room Cards --- */}
			{painting.rooms.map((room) => {
				const multi = isMultiRoom(room.type);
				// Logic to hide add button if at limit (e.g. 8)
				const isAtLimit = getRoomCount(room.type) >= 8;
				return (
					<PaintingRoomCard
						key={room.id}
						room={room}
						onRoomChange={onRoomChange}
						// Update this line: Only pass onRoomAdd if multi-room AND not at limit
						onRoomAdd={
							multi && room.id.endsWith('_0') && !isAtLimit
								? onRoomAdd
								: undefined
						}
						// Only show "Remove" if it's NOT the first of its type
						onRoomRemove={
							multi && !room.id.endsWith('_0') ? onRoomRemove : undefined
						}
					/>
				);
			})}

			{/* --- C. Global Painting Questions --- */}
			<div className={`${styles.formGroupBox} ${styles.globalQuestions}`}>
				<div className={styles.formGroup}>
					<label>Who will provide the paint?</label>
					<select
						name='paintProvider'
						value={painting.paintProvider}
						onChange={(e) => onGlobalChange('paintProvider', e.target.value)}
					>
						<option value=''>Please select...</option>
						<option value='Customer'>I will provide all paint</option>
						<option value='Standard'>
							Please include standard quality paint
						</option>
						<option value='Premium'>
							Please include premium quality paint
						</option>
					</select>
				</div>
				<div className={styles.formGroup}>
					<label>What about furniture?</label>
					<select
						name='furniture'
						value={painting.furniture}
						onChange={(e) => onGlobalChange('furniture', e.target.value)}
					>
						<option value=''>Please select...</option>
						<option value='Empty'>The home will be empty</option>
						<option value='Customer'>
							I will move and cover all my furniture
						</option>
						<option value='Contractor'>
							I need the painter to move and cover furniture
						</option>
					</select>
				</div>

				{/* NEW Additional Details Section */}
				<div
					className={styles.formGroup}
					style={{ marginTop: '1rem' }}
				>
					<label>
						Additional Details{' '}
						<span
							style={{
								fontWeight: 'normal',
								fontSize: '0.85rem',
								color: '#666',
							}}
						>
							(Optional - Max 600 characters)
						</span>
					</label>
					<textarea
						name='additionalDetails'
						value={painting.additionalDetails || ''}
						onChange={(e) =>
							onGlobalChange('additionalDetails', e.target.value)
						}
						maxLength={600} // Enforce the limit natively
						rows={4}
						placeholder='Tell us about specific damage, color changes (e.g. dark red to white), or high ceilings...'
					/>
					<div
						style={{ textAlign: 'right', fontSize: '0.8rem', color: '#999' }}
					>
						{(painting.additionalDetails || '').length} / 600
					</div>
				</div>
			</div>
		</div>
	);
};