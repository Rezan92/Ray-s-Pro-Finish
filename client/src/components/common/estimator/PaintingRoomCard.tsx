import React, { useState, useRef, useEffect } from 'react';
import type { PaintingRoom } from './EstimatorTypes';
import { ChevronDown, Plus, Trash2, Ruler, AlertTriangle } from 'lucide-react';
import { ROOM_SIZE_OPTIONS } from './roomSizeData';
import styles from './styles/PaintingRoomCard.module.css';
import { InfoTooltip } from '@/components/common/infoTooltip/InfoTooltip';
import { PAINTING_TOOLTIPS } from './tooltipDictionary';

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
	const [showExact, setShowExact] = useState(
		!!(room.exactLength || room.exactWidth || room.exactHeight),
	);
	const lengthInputRef = useRef<HTMLInputElement>(null);

	// Auto-focus the Length input when switching to Custom size
	useEffect(() => {
		if (showExact && lengthInputRef.current) {
			lengthInputRef.current.focus();
		}
	}, [showExact]);

	const handleFieldChange = (
		e: React.ChangeEvent<
			HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
		>,
	) => {
		const { name, value, type } = e.target;
		onRoomChange(
			room.id,
			name,
			type === 'number' ? (value === '' ? undefined : parseInt(value)) : value,
		);
	};

	const handleSurfaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = e.target;

		// Professional fix: Clear associated sub-data when unselecting a surface
		if (!checked) {
			if (name === 'ceiling') onRoomChange(room.id, 'ceilingTexture', 'Flat');
			if (name === 'trim') {
				onRoomChange(room.id, 'trimCondition', 'Good');
				onRoomChange(room.id, 'trimConversion', false);
			}
			if (name === 'doors') {
				onRoomChange(room.id, 'doorCount', '1');
				onRoomChange(room.id, 'doorStyle', 'Slab');
			}
			if (name === 'crownMolding')
				onRoomChange(room.id, 'crownMoldingStyle', 'Simple');
			if (name === 'windows') onRoomChange(room.id, 'windowCount', 0);
		}

		const newSurfaces = { ...room.surfaces, [name]: checked };
		onRoomChange(room.id, 'surfaces', newSurfaces);
	};

	const toggleExact = () => {
		const newState = !showExact;
		setShowExact(newState);
		if (!newState) {
			// Clear exact dimensions when switching back to presets
			onRoomChange(room.id, 'exactLength', undefined);
			onRoomChange(room.id, 'exactWidth', undefined);
			onRoomChange(room.id, 'exactHeight', undefined);
		}
	};

	const isStairwell = room.type === 'stairwell';
	const sizeOptions = ROOM_SIZE_OPTIONS[room.type] || [];

	const showDetails =
		room.surfaces.ceiling ||
		room.surfaces.trim ||
		(!isStairwell &&
			(room.surfaces.crownMolding ||
				room.surfaces.doors ||
				room.surfaces.windows));

	return (
		<div className={`${styles.roomCard} ${room.isCustomized ? styles.customized : ''}`}>
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
			<div className={`${styles.collapsibleWrapper} ${isOpen ? styles.open : ''}`}>
				<div className={styles.collapsibleInner}>
					<div className={styles.accordionContent}>
						{/* 0. Customization Toggle (New) */}
					<div
						className={styles.formGroupBox}
						style={{
							borderColor: 'var(--color-primary)',
							backgroundColor: room.isCustomized ? '#fff' : '#f9f9f9',
						}}
					>
						<label
							className={styles.checkboxLabel}
							style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}
						>
							<input
								type='checkbox'
								checked={room.isCustomized || false}
								onChange={(e) =>
									onRoomChange(
										room.id,
										'toggleRoomCustomization',
										e.target.checked,
									)
								}
							/>
							Customize this area
							{!room.isCustomized && (
								<InfoTooltip message={PAINTING_TOOLTIPS.CUSTOMIZE_ROOM} />
							)}
						</label>
					</div>

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
						{!showExact ? (
							<div className={styles.formGroupGrid}>
								<div className={styles.formGroup}>
									<label>Approximate Size</label>
									<select
										name='size'
										value={room.size}
										onChange={(e) => {
											if (e.target.value === 'Custom') {
												setShowExact(true);
											} else {
												handleFieldChange(e);
											}
										}}
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
										value={room.ceilingHeight || '8ft'}
										onChange={handleFieldChange}
										disabled={isStairwell}
									>
										<option value='8ft'>8 ft (Standard)</option>
										<option value='9-10ft'>9-10 ft</option>
										<option value='11-14ft'>High (11-14ft)</option>
										<option value='15ft+'>Great Room / Foyer (15ft+)</option>
									</select>
								</div>
							</div>
						) : (
							<div className={styles.dimensionsGrid}>
								<div className={styles.formGroup}>
									<label>
										{isStairwell ? 'Wall Length (lf)' : 'Length (ft)'}
									</label>
									<input
										type='number'
										name='exactLength'
										ref={lengthInputRef}
										placeholder='L'
										min='1'
										value={room.exactLength || ''}
										onChange={handleFieldChange}
									/>
								</div>
								<div className={styles.formGroup}>
									<label>Width (ft)</label>
									<input
										type='number'
										name='exactWidth'
										placeholder='W'
										min='1'
										value={room.exactWidth || ''}
										onChange={handleFieldChange}
									/>
								</div>
								<div className={styles.formGroup}>
									<label>
										{isStairwell ? 'Max Wall Height (ft)' : 'Height (ft)'}
									</label>
									<input
										type='number'
										name='exactHeight'
										placeholder='H'
										min='1'
										value={room.exactHeight || ''}
										onChange={handleFieldChange}
									/>
								</div>
								<div
									className={styles.formGroup}
									style={{ display: 'flex', alignItems: 'flex-end' }}
								>
									<button
										type='button'
										onClick={toggleExact}
										style={{
											padding: '0.6rem',
											border: '1px solid #ccc',
											borderRadius: '4px',
											background: '#f0f0f0',
											cursor: 'pointer',
										}}
										title='Back to Presets'
									>
										Back
									</button>
								</div>
							</div>
						)}
					</div>

					{/* 3. Stairwell Details (T012) */}
					{isStairwell && (
						<div className={styles.formGroupBox}>
							<label style={{ marginBottom: '1rem', display: 'block' }}>
								Stairwell Components
							</label>
							<div className={styles.conditionalFieldsContainer}>
								<div className={styles.formGroup}>
									<label>Spindle Count</label>
									<input
										type='number'
										name='stairSpindles'
										className={styles.smallInput}
										min='0'
										value={room.stairSpindles || 0}
										onChange={handleFieldChange}
									/>
								</div>
								<div className={styles.formGroup}>
									<label>Spindle Type</label>
									<select
										name='stairSpindleType'
										value={room.stairSpindleType || 'Square'}
										onChange={handleFieldChange}
									>
										<option value='Square'>Square (Simple)</option>
										<option value='Intricate'>Intricate (Ornate)</option>
									</select>
								</div>
								<div className={styles.formGroup}>
									<label>Handrail (lf)</label>
									<input
										type='number'
										name='stairHandrail'
										className={styles.smallInput}
										min='0'
										value={room.stairHandrail || 0}
										onChange={handleFieldChange}
									/>
								</div>
								<div className={styles.formGroup}>
									<label>Number of Steps</label>
									<input
										type='number'
										name='stairSteps'
										className={styles.smallInput}
										min='0'
										value={room.stairSteps || 0}
										onChange={handleFieldChange}
									/>
								</div>
							</div>
						</div>
					)}

					{/* 4. NEW: Closet Size (Only for Bedroom) */}
					{!isStairwell && room.type === 'bedroom' && (
						<div className={styles.formGroupBox}>
							<div className={styles.formGroup}>
								<label className={styles.checkboxLabel}>
									<input
										type='checkbox'
										name='closetIncluded'
										checked={room.closetSize !== 'None'}
										onChange={(e) =>
											onRoomChange(
												room.id,
												'closetSize',
												e.target.checked ? 'Standard' : 'None',
											)
										}
									/>
									Closet Included?
								</label>
								{room.closetSize !== 'None' && (
									<div style={{ marginTop: '1rem' }}>
										<label>Closet Size</label>
										<select
											name='closetSize'
											value={room.closetSize || 'Standard'}
											onChange={handleFieldChange}
										>
											<option value='Standard'>Standard (2' x 4')</option>
											<option value='Medium'>Medium Walk-in (5' x 5')</option>
											<option value='Large'>Large Walk-in (6' x 10')</option>
										</select>
									</div>
								)}
							</div>
						</div>
					)}

					{/* 5. Surfaces Selection (Conditional on Customization) */}
					<div className={styles.formGroupBox}>
						<div className={styles.formGroup}>
							<label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
								What needs painting?
								{!room.isCustomized && (
									<span className={styles.inheritanceLabel}>Following Project Defaults</span>
								)}
							</label>
							<div className={`${styles.checkboxGroupHorizontal} ${!room.isCustomized ? styles.ghosted : ''}`}>
								<label className={styles.checkboxLabel}>
									<input
										type='checkbox'
										name='walls'
										checked={room.surfaces.walls}
										onChange={handleSurfaceChange}
										disabled={!room.isCustomized}
									/>{' '}
									Walls
								</label>
								<label className={styles.checkboxLabel}>
									<input
										type='checkbox'
										name='ceiling'
										checked={room.surfaces.ceiling}
										onChange={handleSurfaceChange}
										disabled={!room.isCustomized}
									/>{' '}
									Ceiling
								</label>
								<label className={styles.checkboxLabel}>
									<input
										type='checkbox'
										name='trim'
										checked={room.surfaces.trim}
										onChange={handleSurfaceChange}
										disabled={!room.isCustomized}
									/>{' '}
									Trim
								</label>
								{!isStairwell && (
									<>
										<label className={styles.checkboxLabel}>
											<input
												type='checkbox'
												name='doors'
												checked={room.surfaces.doors}
												onChange={handleSurfaceChange}
												disabled={!room.isCustomized}
											/>{' '}
											Doors
										</label>
										<label className={styles.checkboxLabel}>
											<input
												type='checkbox'
												name='crownMolding'
												checked={room.surfaces.crownMolding || false}
												onChange={handleSurfaceChange}
												disabled={!room.isCustomized}
											/>{' '}
											Crown Molding
										</label>
										<label className={styles.checkboxLabel}>
											<input
												type='checkbox'
												name='windows'
												checked={room.surfaces.windows || false}
												onChange={handleSurfaceChange}
												disabled={!room.isCustomized}
											/>{' '}
											Windows
										</label>
									</>
								)}
							</div>
						</div>
					</div>

					{/* 6. Surface Details (Conditional on Selection) */}
					{showDetails && (
						<div className={styles.formGroupBox}>
							<div className={`${styles.conditionalFieldsContainer} ${!room.isCustomized ? styles.ghosted : ''}`}>
								{room.surfaces.ceiling && (
									<div className={styles.formGroup}>
										<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
											<label style={{ margin: 0 }}>Ceiling Texture</label>
											{room.ceilingTexture === 'Popcorn' && (
												<InfoTooltip message={PAINTING_TOOLTIPS.CEILING_POPCORN} />
											)}
										</div>
										<select
											name='ceilingTexture'
											value={room.ceilingTexture || 'Flat'}
											onChange={handleFieldChange}
											disabled={!room.isCustomized}
										>
											<option value='Flat'>Flat/Smooth</option>
											<option value='Textured'>Textured</option>
											<option value='Popcorn'>Popcorn</option>
										</select>
									</div>
								)}
								{room.surfaces.trim && (
									<>
										<div className={styles.formGroup}>
											<label>Trim Condition</label>
											<select
												name='trimCondition'
												value={room.trimCondition || 'Good'}
												onChange={handleFieldChange}
												disabled={!room.isCustomized}
											>
												<option value='Good'>Good (Just needs paint)</option>
												<option value='Poor'>Poor (Needs re-caulking)</option>
											</select>
										</div>
										<div className={styles.formGroup}>
											<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
												<label style={{ margin: 0 }}>
													Is your trim currently wood-stained?
												</label>
												{room.trimConversion && (
													<InfoTooltip message={PAINTING_TOOLTIPS.TRIM_CONVERSION} />
												)}
											</div>
											<select
												name='trimStyleDropdown'
												value={room.trimConversion ? 'Stained' : 'Standard'}
												onChange={(e) =>
													onRoomChange(
														room.id,
														'trimConversion',
														e.target.value === 'Stained',
													)
												}
												disabled={!room.isCustomized}
											>
												<option value='Standard'>Standard Painting</option>
												<option value='Stained'>Stained to Painted</option>
											</select>
										</div>
									</>
								)}
								{!isStairwell && room.surfaces.crownMolding && (
									<div className={styles.formGroup}>
										<label>Crown Molding Style</label>
										<select
											name='crownMoldingStyle'
											value={room.crownMoldingStyle || 'Simple'}
											onChange={handleFieldChange}
											disabled={!room.isCustomized}
										>
											<option value='Simple'>Simple / Smooth</option>
											<option value='Detailed'>Detailed / Ornate</option>
										</select>
									</div>
								)}
								{!isStairwell && room.surfaces.doors && (
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
												disabled={!room.isCustomized}
											/>
										</div>
										<div className={styles.formGroup}>
											<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
												<label style={{ margin: 0 }}>Door Style</label>
												{room.doorStyle === 'Paneled' && (
													<InfoTooltip message={PAINTING_TOOLTIPS.DOOR_PANELED} />
												)}
											</div>
											<select
												name='doorStyle'
												value={room.doorStyle || 'Slab'}
												onChange={handleFieldChange}
												disabled={!room.isCustomized}
											>
												<option value='Slab'>Flat / Slab</option>
												<option value='Paneled'>Paneled</option>
											</select>
										</div>
									</>
								)}
								{!isStairwell && room.surfaces.windows && (
									<div className={styles.formGroup}>
										<label>How many windows?</label>
										<input
											type='number'
											name='windowCount'
											className={styles.smallInput}
											min='0'
											value={room.windowCount || 0}
											onChange={handleFieldChange}
											disabled={!room.isCustomized}
										/>
									</div>
								)}
							</div>
						</div>
					)}

					{/* 7. General Condition & Color (Conditional) */}
					<div className={styles.formGroupBox}>
						<div className={`${styles.formGroupGrid} ${!room.isCustomized ? styles.ghosted : ''}`}>
							<div className={styles.formGroup}>
								<label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									{isStairwell ? 'Wall/Trim Condition' : 'Surface Condition'}
									{!room.isCustomized && (
										<span className={styles.inheritanceLabel}>Following Project Defaults</span>
									)}
								</label>
								<select
									name='wallCondition'
									value={room.wallCondition}
									onChange={handleFieldChange}
									disabled={!room.isCustomized}
								>
									<option value='None'>None (No extra preparation)</option>
									<option value='Good'>Good (Few nail holes)</option>
									<option value='Fair'>
										Basic Prep (Nail holes, minor scuffs)
									</option>
									<option value='Poor'>
										Major Prep (Peeling paint, cracks, or large holes)
									</option>
								</select>
							</div>
							<div className={styles.formGroup}>
								<div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
									<label style={{ margin: 0 }}>Color Change</label>
									{room.colorChange === 'Dark-to-Light' && (
										<InfoTooltip message={PAINTING_TOOLTIPS.COLOR_CHANGE_DARK_TO_LIGHT} />
									)}
									{!room.isCustomized && (
										<span className={styles.inheritanceLabel}>Following Project Defaults</span>
									)}
								</div>
								<select
									name='colorChange'
									value={room.colorChange}
									onChange={handleFieldChange}
									disabled={!room.isCustomized}
								>
									<option value='Similar'>Refresh (Same Color)</option>
									<option value='Change'>
										Color Change (Light to Light or Dark)
									</option>
									<option value='Dark-to-Light'>
										Color Change (Dark to Light)
									</option>
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
			</div>
		</div>
	);
};
