import React, { useMemo } from 'react';
import { PaintingRoomCard } from './PaintingRoomCard';
import type { FormData } from './EstimatorTypes';
import styles from './styles/PaintingForm.module.css';

// Define the props it will receive from EstimatorPage
interface PaintingFormProps {
	formData: FormData;
	onRoomTypeToggle: (type: string, isChecked: boolean) => void;
	onRoomChange: (roomId: string, field: string, value: unknown) => void;
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
				<div className={styles.formGroupGrid}>
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
						<label>Occupancy & Furniture</label>
						<select
							name='occupancy'
							value={formData.painting.occupancy || 'Empty'}
							onChange={(e) => onGlobalChange('occupancy', e.target.value)}
						>
							<option value='Empty'>Empty / New Construction</option>
							<option value='Light Furniture'>Occupied - Light Furniture (Owner moves small items)</option>
							<option value='Heavy Furniture'>Occupied - Full Furniture (Painter moves/covers all)</option>
						</select>
					</div>
				</div>

				<h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Global Room Defaults</h4>
				<p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
					These settings apply to all rooms unless you check "Customize this area" on a specific card.
				</p>

				<div className={styles.formGroup}>
					<label>What needs painting (Default)?</label>
					<div className={styles.checkboxGroupHorizontal}>
						<label className={styles.checkboxLabel}>
							<input
								type='checkbox'
								checked={painting.globalDefaults?.surfaces.walls ?? true}
								onChange={(e) => onGlobalChange('updateGlobalDefaults', { field: 'surfaces', value: { ...painting.globalDefaults.surfaces, walls: e.target.checked } })}
							/> Walls
						</label>
						<label className={styles.checkboxLabel}>
							<input
								type='checkbox'
								checked={painting.globalDefaults?.surfaces.ceiling ?? false}
								onChange={(e) => onGlobalChange('updateGlobalDefaults', { field: 'surfaces', value: { ...painting.globalDefaults.surfaces, ceiling: e.target.checked } })}
							/> Ceiling
						</label>
						<label className={styles.checkboxLabel}>
							<input
								type='checkbox'
								checked={painting.globalDefaults?.surfaces.trim ?? false}
								onChange={(e) => onGlobalChange('updateGlobalDefaults', { field: 'surfaces', value: { ...painting.globalDefaults.surfaces, trim: e.target.checked } })}
							/> Trim
						</label>
						<label className={styles.checkboxLabel}>
							<input
								type='checkbox'
								checked={painting.globalDefaults?.surfaces.doors ?? false}
								onChange={(e) => onGlobalChange('updateGlobalDefaults', { field: 'surfaces', value: { ...painting.globalDefaults.surfaces, doors: e.target.checked } })}
							/> Doors
						</label>
					</div>
				</div>

				<div className={styles.formGroupGrid}>
					<div className={styles.formGroup}>
						<label>Surface Condition (Default)</label>
						<select
							value={painting.globalDefaults?.wallCondition || 'Good'}
							onChange={(e) => onGlobalChange('updateGlobalDefaults', { field: 'wallCondition', value: e.target.value })}
						>
							<option value='Good'>Good (Few nail holes)</option>
							<option value='Fair'>Fair (Dings, scuffs)</option>
							<option value='Poor'>Poor (Cracks, stains)</option>
						</select>
					</div>
					<div className={styles.formGroup}>
						<label>Color Change (Default)</label>
						<select
							value={painting.globalDefaults?.colorChange || 'Similar'}
							onChange={(e) => onGlobalChange('updateGlobalDefaults', { field: 'colorChange', value: e.target.value })}
						>
							<option value='Similar'>Refresh (Same Color)</option>
							<option value='Change'>Color Change (2 Coats)</option>
							<option value='Dark-to-Light'>Dark-to-Light (Primer + 2 Coats)</option>
						</select>
					</div>
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