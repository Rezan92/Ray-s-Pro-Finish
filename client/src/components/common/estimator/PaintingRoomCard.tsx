import React, { useState } from 'react';
import type { PaintingRoom } from './EstimatorTypes';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import { ROOM_SIZE_OPTIONS } from './roomSizeData';
import styles from './styles/PaintingRoomCard.module.css';

interface PaintingRoomCardProps {
	room: PaintingRoom;
	onRoomChange: (roomId: string, field: string, value: unknown) => void;
	onRoomRemove?: (roomId: string) => void;
	onRoomAdd?: (type: string) => void;
}

export const PaintingRoomCard: React.FC<PaintingRoomCardProps> = ({
	room,
	onRoomChange,
	onRoomRemove,
	onRoomAdd,
}) => {
	const [isOpen, setIsOpen] = useState(true);

	const handleFieldChange = (
		e: React.ChangeEvent<
			HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
		>
	) => {
		onRoomChange(
			room.id,
			e.target.name,
			e.target.type === 'number' ? parseInt(e.target.value) : e.target.value
		);
	};

	const handleSurfaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = e.target;

		// Professional fix: Clear associated sub-data when unselecting a surface
		if (!checked) {
			if (name === 'ceiling') onRoomChange(room.id, 'ceilingTexture', 'Flat');
			if (name === 'trim') onRoomChange(room.id, 'trimCondition', 'Good');
			if (name === 'doors') {
				onRoomChange(room.id, 'doorCount', '1');
				onRoomChange(room.id, 'doorStyle', 'Slab');
			}
			if (name === 'crownMolding')
				onRoomChange(room.id, 'crownMoldingStyle', 'Simple');
			if (name === 'windows') onRoomChange(room.id, 'windowCount', 1);
		}

		const newSurfaces = { ...room.surfaces, [name]: checked };
		onRoomChange(room.id, 'surfaces', newSurfaces);
	};

	const isStairwell = room.type === 'stairwell';
	const ceilingHeightValue = isStairwell ? '11ft+' : room.ceilingHeight;
	const sizeOptions = ROOM_SIZE_OPTIONS[room.type] || [];

	// Updated showDetails to include windows
	const showDetails =
		room.surfaces.ceiling ||
		room.surfaces.trim ||
		room.surfaces.crownMolding ||
		room.surfaces.doors ||
		room.surfaces.windows; // Added windows check

	return (
		<div className={styles.roomCard}>
			{/* --- Card Header --- */}
			<button
				type='button'
				className={`${styles.accordionHeader} ${isOpen ? styles.open : ''}`}
				onClick={() => setIsOpen(!isOpen)}
			>
				<span className={styles.accordionTitle}>{room.label}</span>
				<div className={styles.accordionActions}>
					{onRoomRemove && (
						<button
							type='button'
							className={styles.btnRemove}
							onClick={(e) => {
								e.stopPropagation();
								onRoomRemove(room.id);
							}}
						>
							<Trash2 size={16} /> Remove
						</button>
					)}
					<ChevronDown
						size={20}
						className={styles.accordionIcon}
					/>
				</div>
			</button>

			{/* --- Collapsible Card Body --- */}
			{isOpen && (
				<div className={styles.accordionContent}>
					{/* 1. Description (Only for Other) */}
					{room.type === 'other' && (
						<div className={styles.formGroupBox}>
							<div className={styles.formGroup}>
								<label
									style={{ display: 'flex', justifyContent: 'space-between' }}
								>
									Description
									<span
										style={{
											fontWeight: 'normal',
											fontSize: '0.8rem',
											color: '#666',
										}}
									>
										Max 600 chars
									</span>
								</label>
								<textarea
									name='roomDescription'
									value={room.roomDescription || ''}
									onChange={handleFieldChange}
									placeholder='e.g. Sunroom, Library, Butler Pantry.'
									maxLength={600}
									rows={3}
								/>
							</div>
						</div>
					)}

					{/* 2. Dimensions */}
					<div className={styles.formGroupBox}>
						<div className={styles.formGroupGrid}>
							<div className={styles.formGroup}>
								<label>Approximate Size</label>
								<select
									name='size'
									value={room.size}
									onChange={handleFieldChange}
								>
									{sizeOptions.map((option) => (
										<option
											key={option.value}
											value={option.value}
										>
											{option.label}
										</option>
									))}
								</select>
							</div>
							<div className={styles.formGroup}>
								<label>Ceiling Height</label>
								<select
									name='ceilingHeight'
									value={ceilingHeightValue}
									onChange={handleFieldChange}
									disabled={isStairwell}
								>
									<option value='8ft'>8 ft (Standard)</option>
									<option value='9-10ft'>9-10 ft</option>
									<option value='11ft+'>11 ft+ / Vaulted</option>
								</select>
							</div>
						</div>
					</div>

					{/* 3. NEW: Closet Size (Only for Bedroom) */}
					{room.type === 'bedroom' && (
						<div className={styles.formGroupBox}>
							<div className={styles.formGroup}>
								<label>Does this bedroom have a closet to paint?</label>
								<select
									name='closetSize'
									value={room.closetSize || 'None'}
									onChange={handleFieldChange}
								>
									<option value='None'>No Closet</option>
									<option value='Standard'>Standard (2' x 4')</option>
									<option value='Medium'>Medium Walk-in (5' x 5')</option>
									<option value='Large'>Large Walk-in (6' x 10')</option>
								</select>
							</div>
						</div>
					)}

					{/* 4. Surfaces Selection (Added Windows checkbox) */}
					<div className={styles.formGroupBox}>
						<div className={styles.formGroup}>
							<label>What needs painting?</label>
							<div className={styles.checkboxGroupHorizontal}>
								<label className={styles.checkboxLabel}>
									<input
										type='checkbox'
										name='walls'
										checked={room.surfaces.walls}
										onChange={handleSurfaceChange}
									/>{' '}
									Walls
								</label>
								<label className={styles.checkboxLabel}>
									<input
										type='checkbox'
										name='ceiling'
										checked={room.surfaces.ceiling}
										onChange={handleSurfaceChange}
									/>{' '}
									Ceiling
								</label>
								<label className={styles.checkboxLabel}>
									<input
										type='checkbox'
										name='trim'
										checked={room.surfaces.trim}
										onChange={handleSurfaceChange}
									/>{' '}
									Trim
								</label>
								<label className={styles.checkboxLabel}>
									<input
										type='checkbox'
										name='doors'
										checked={room.surfaces.doors}
										onChange={handleSurfaceChange}
									/>{' '}
									Doors
								</label>
								<label className={styles.checkboxLabel}>
									<input
										type='checkbox'
										name='crownMolding'
										checked={room.surfaces.crownMolding || false}
										onChange={handleSurfaceChange}
									/>{' '}
									Crown Molding
								</label>
								<label className={styles.checkboxLabel}>
									<input
										type='checkbox'
										name='windows'
										checked={room.surfaces.windows || false}
										onChange={handleSurfaceChange}
									/>{' '}
									Windows
								</label>
							</div>
						</div>
					</div>

					{/* 5. Surface Details (Conditional - Added Windows Count) */}
					{showDetails && (
						<div className={styles.formGroupBox}>
							<div className={styles.conditionalFieldsContainer}>
								{room.surfaces.ceiling && (
									<div className={styles.formGroup}>
										<label>Ceiling Texture</label>
										<select
											name='ceilingTexture'
											value={room.ceilingTexture || 'Flat'}
											onChange={handleFieldChange}
										>
											<option value='Flat'>Flat/Smooth</option>
											<option value='Textured'>Textured</option>
											<option value='Popcorn'>Popcorn</option>
										</select>
									</div>
								)}
								{room.surfaces.trim && (
									<div className={styles.formGroup}>
										<label>Trim Condition</label>
										<select
											name='trimCondition'
											value={room.trimCondition || 'Good'}
											onChange={handleFieldChange}
										>
											<option value='Good'>Good (Just needs paint)</option>
											<option value='Poor'>Poor (Needs re-caulking)</option>
										</select>
									</div>
								)}
								{room.surfaces.crownMolding && (
									<div className={styles.formGroup}>
										<label>Crown Molding Style</label>
										<select
											name='crownMoldingStyle'
											value={room.crownMoldingStyle || 'Simple'}
											onChange={handleFieldChange}
										>
											<option value='Simple'>Simple / Smooth</option>
											<option value='Detailed'>Detailed / Ornate</option>
										</select>
									</div>
								)}
								{room.surfaces.doors && (
									<>
										<div className={styles.formGroup}>
											<label>How many doors?</label>
											<input
												type='number'
												name='doorCount'
												className={styles.smallInput}
												min='0'
												value={room.doorCount || '1'}
												onChange={handleFieldChange}
											/>
										</div>
										<div className={styles.formGroup}>
											<label>Door Style</label>
											<select
												name='doorStyle'
												value={room.doorStyle || 'Slab'}
												onChange={handleFieldChange}
											>
												<option value='Slab'>Flat / Slab</option>
												<option value='Paneled'>Paneled</option>
											</select>
										</div>
									</>
								)}
								{room.surfaces.windows && (
									<div className={styles.formGroup}>
										<label>How many windows?</label>
										<input
											type='number'
											name='windowCount'
											className={styles.smallInput}
											min='0'
											value={room.windowCount || 0}
											onChange={handleFieldChange}
										/>
									</div>
								)}
							</div>
						</div>
					)}

					{/* 6. General Condition & Color */}
					<div className={styles.formGroupBox}>
						<div className={styles.formGroupGrid}>
							<div className={styles.formGroup}>
								<label>Surface Condition</label>
								<select
									name='wallCondition'
									value={room.wallCondition}
									onChange={handleFieldChange}
								>
									<option value='Good'>Good (Few nail holes)</option>
									<option value='Fair'>Fair (Dings, scuffs)</option>
									<option value='Poor'>Poor (Cracks, stains)</option>
								</select>
							</div>
							<div className={styles.formGroup}>
								<label>Color Change</label>
								<select
									name='colorChange'
									value={room.colorChange}
									onChange={handleFieldChange}
								>
									<option value='Similar'>Similar Color</option>
									<option value='Dark-to-Light'>Dark-to-Light</option>
								</select>
							</div>
						</div>
					</div>

					{/* Add Another Button */}
					{onRoomAdd && (
						<button
							type='button'
							className={styles.btnAddRoom}
							onClick={() => onRoomAdd(room.type)}
						>
							<Plus size={16} /> Add another {room.type}
						</button>
					)}
				</div>
			)}
		</div>
	);
};
