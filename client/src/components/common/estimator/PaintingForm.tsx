import React, { useMemo, useState } from 'react';
import { PaintingRoomCard } from './PaintingRoomCard';
import type { FormData } from './EstimatorTypes';
import styles from './styles/PaintingForm.module.css';
import { InfoTooltip } from '@/components/common/infoTooltip/InfoTooltip';
import { ChevronDown } from 'lucide-react';

// Define the props it will receive from EstimatorPage
interface PaintingFormProps {
	formData: FormData;
	onRoomTypeToggle: (type: string, isChecked: boolean) => void;
	onRoomChange: (roomId: string, field: string, value: unknown) => void;
	onRoomAdd: (type: string) => void;
	onRoomRemove: (roomId: string) => void;
	onGlobalChange: (field: string, value: any) => void;
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
	const [isConfigOpen, setIsConfigOpen] = useState(true);

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

			{/* --- A. The Room Builder (Moved to Top) --- */}
			<div className={styles.formGroupBox}>
				<div className={styles.formGroup}>
					<label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
						Add Rooms & Spaces
						<InfoTooltip message="Select the spaces you'd like us to paint. Each selected room will appear as a separate card below the 'Project Configuration' section. Tip: You can collapse these cards to keep your view organized as you build your estimate." />
					</label>
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

			{/* --- C. Global Painting Questions (Card Style & Collapsible) --- */}
			<div className={styles.configCard}>
				<button
					type="button"
					className={styles.configHeader}
					onClick={() => setIsConfigOpen(!isConfigOpen)}
				>
					<span className={styles.configTitle}>
						Project Configuration & Defaults
					</span>
					<ChevronDown 
						size={20} 
						style={{ 
							transform: isConfigOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
							transition: 'transform 0.3s',
							color: 'var(--color-primary)'
						}} 
					/>
				</button>
				
				{isConfigOpen && (
					<div className={styles.configContent}>
						{/* Basic Project Configuration */}
						<div className={styles.formGroupBox}>
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
											Ray's Pro (Standard Quality)
										</option>
										<option value='Premium'>
											Ray's Pro (Premium Quality)
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
						</div>

						{/* Global Scope Defaults */}
						<h4 style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', marginTop: '0.5rem' }}>
							Global Room Defaults
							<InfoTooltip message="These settings apply to all rooms unless you check 'Customize this area' on a specific card." />
						</h4>

						<div className={styles.formGroupBox}>
							<div className={styles.formGroup}>
								<label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
									What needs painting (Default)?
									<InfoTooltip message="Select the surfaces to paint by default in every room. To add specific quantities (like number of doors or windows), use the 'Customize' option on the individual room cards." />
								</label>
								<div className={styles.checkboxGroupHorizontal} style={{ flexWrap: 'wrap', gap: '1rem', backgroundColor: 'transparent', padding: 0 }}>
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
									<label className={styles.checkboxLabel}>
										<input
											type='checkbox'
											checked={painting.globalDefaults?.surfaces.crownMolding ?? false}
											onChange={(e) => onGlobalChange('updateGlobalDefaults', { field: 'surfaces', value: { ...painting.globalDefaults.surfaces, crownMolding: e.target.checked } })}
										/> Crown Molding
									</label>
									<label className={styles.checkboxLabel}>
										<input
											type='checkbox'
											checked={painting.globalDefaults?.surfaces.windows ?? false}
											onChange={(e) => onGlobalChange('updateGlobalDefaults', { field: 'surfaces', value: { ...painting.globalDefaults.surfaces, windows: e.target.checked } })}
										/> Windows
									</label>
								</div>
							</div>
						</div>

						{/* Sub-questions for Global Surfaces */}
						{(painting.globalDefaults?.surfaces.ceiling || painting.globalDefaults?.surfaces.trim || painting.globalDefaults?.surfaces.crownMolding || painting.globalDefaults?.surfaces.doors) && (
							<div className={styles.formGroupBox}>
								<div className={styles.conditionalFieldsContainer}>
									{painting.globalDefaults?.surfaces.ceiling && (
										<div className={styles.formGroup}>
											<label>Ceiling Texture (Default)</label>
											<select
												value={painting.globalDefaults?.ceilingTexture || 'Flat'}
												onChange={(e) => onGlobalChange('updateGlobalDefaults', { field: 'ceilingTexture', value: e.target.value })}
											>
												<option value='Flat'>Flat/Smooth</option>
												<option value='Textured'>Textured</option>
												<option value='Popcorn'>Popcorn</option>
											</select>
										</div>
									)}
									{painting.globalDefaults?.surfaces.trim && (
										<>
											<div className={styles.formGroup}>
												<label>Trim Condition (Default)</label>
												<select
													value={painting.globalDefaults?.trimCondition || 'Good'}
													onChange={(e) => onGlobalChange('updateGlobalDefaults', { field: 'trimCondition', value: e.target.value })}
												>
													<option value='Good'>Good (Just needs paint)</option>
													<option value='Poor'>Poor (Needs re-caulking)</option>
												</select>
											</div>
											<div className={styles.formGroup}>
												<label>Trim Painting Style (Default)</label>
												<select
													value={painting.globalDefaults?.trimConversion ? 'Stained' : 'Standard'}
													onChange={(e) => onGlobalChange('updateGlobalDefaults', { field: 'trimConversion', value: e.target.value === 'Stained' })}
												>
													<option value='Standard'>Standard Painting</option>
													<option value='Stained'>Stained to Painted</option>
												</select>
											</div>
											<div className={styles.formGroup}>
												<label>Trim Profile (Default)</label>
												<select
													value={painting.globalDefaults?.trimStyle || 'Simple'}
													onChange={(e) => onGlobalChange('updateGlobalDefaults', { field: 'trimStyle', value: e.target.value })}
												>
													<option value='Simple'>Simple / Smooth</option>
													<option value='Detailed'>Detailed / Ornate</option>
												</select>
											</div>
										</>
									)}
									{painting.globalDefaults?.surfaces.crownMolding && (
										<div className={styles.formGroup}>
											<label>Crown Molding Style (Default)</label>
											<select
												value={painting.globalDefaults?.crownMoldingStyle || 'Simple'}
												onChange={(e) => onGlobalChange('updateGlobalDefaults', { field: 'crownMoldingStyle', value: e.target.value })}
											>
												<option value='Simple'>Simple / Smooth</option>
												<option value='Detailed'>Detailed / Ornate</option>
											</select>
										</div>
									)}
									{painting.globalDefaults?.surfaces.doors && (
										<div className={styles.formGroup}>
											<label>Door Style (Default)</label>
											<select
												value={painting.globalDefaults?.doorStyle || 'Slab'}
												onChange={(e) => onGlobalChange('updateGlobalDefaults', { field: 'doorStyle', value: e.target.value })}
											>
												<option value='Slab'>Flat / Slab</option>
												<option value='Paneled'>Paneled</option>
											</select>
										</div>
									)}
								</div>
							</div>
						)}

						{/* Global Prep and Color Change */}
						<div className={styles.formGroupBox}>
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
										<option value='Change'>Color Change (Light to Light or Dark)</option>
										<option value='Dark-to-Light'>Color Change (Dark to Light)</option>
									</select>
								</div>
							</div>
						</div>

						{/* Global Additional Details */}
						<div className={styles.formGroupBox}>
							<div className={styles.formGroup}>
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
									maxLength={600}
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
				)}
			</div>

			{/* --- B. The Generated Room Cards --- */}
			{painting.rooms.map((room) => {
				const multi = isMultiRoom(room.type);
				const isAtLimit = getRoomCount(room.type) >= 8;
				return (
					<PaintingRoomCard
						key={room.id}
						room={room}
						onRoomChange={onRoomChange}
						onRoomAdd={
							multi && room.id.endsWith('_0') && !isAtLimit
								? onRoomAdd
								: undefined
						}
						onRoomRemove={
							multi && !room.id.endsWith('_0') ? onRoomRemove : undefined
						}
					/>
				);
			})}
		</div>
	);
};
