import React, { useState } from 'react';
import type { PaintingRoom } from './EstimatorTypes';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import { ROOM_SIZE_OPTIONS } from './roomSizeData';

interface PaintingRoomCardProps {
	room: PaintingRoom;
	onRoomChange: (roomId: string, field: string, value: any) => void;
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
		onRoomChange(room.id, e.target.name, e.target.value);
	};

	const handleSurfaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = e.target;
		const newSurfaces = { ...room.surfaces, [name]: checked };
		onRoomChange(room.id, 'surfaces', newSurfaces);
	};

	const isStairwell = room.type === 'stairwell';
	const ceilingHeightValue = isStairwell ? '11ft+' : room.ceilingHeight;
	const sizeOptions = ROOM_SIZE_OPTIONS[room.type] || [];

	// Check if any specific details need to be shown
	const showDetails =
		room.surfaces.ceiling ||
		room.surfaces.trim ||
		room.surfaces.crownMolding ||
		room.surfaces.doors;

	return (
		<div
			className='room-card'
			style={{
				marginBottom: '1rem',
				border: '1px solid var(--color-border)',
				borderRadius: '8px',
				backgroundColor: '#fff',
			}}
		>
			{/* --- Card Header --- */}
			<button
				type='button'
				className={`accordion-header ${isOpen ? 'open' : ''}`}
				onClick={() => setIsOpen(!isOpen)}
			>
				<span className='accordion-title'>{room.label}</span>
				<div className='accordion-actions'>
					{onRoomRemove && (
						<button
							type='button'
							className='btn-remove'
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
						className='accordion-icon'
					/>
				</div>
			</button>

			{/* --- Collapsible Card Body --- */}
			{isOpen && (
				<div
					className='accordion-content'
					style={{ padding: '1.5rem' }}
				>
					{/* 1. Description (Only for Other) */}
					{room.type === 'other' && (
						<div className='form-group-box'>
							<div className='form-group'>
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
								<div
									style={{
										textAlign: 'right',
										fontSize: '0.8rem',
										color: '#999',
									}}
								>
									{(room.roomDescription || '').length} / 600
								</div>
							</div>
						</div>
					)}

					{/* 2. Dimensions */}
					<div className='form-group-box'>
						<div className='form-group-grid'>
							<div className='form-group'>
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
							<div className='form-group'>
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

					{/* 3. Surfaces Selection */}
					<div className='form-group-box'>
						<div className='form-group'>
							<label>What needs painting?</label>
							<div className='checkbox-group horizontal'>
								<label className='checkbox-label'>
									<input
										type='checkbox'
										name='walls'
										checked={room.surfaces.walls}
										onChange={handleSurfaceChange}
									/>{' '}
									Walls
								</label>
								<label className='checkbox-label'>
									<input
										type='checkbox'
										name='ceiling'
										checked={room.surfaces.ceiling}
										onChange={handleSurfaceChange}
									/>{' '}
									Ceiling
								</label>
								<label className='checkbox-label'>
									<input
										type='checkbox'
										name='trim'
										checked={room.surfaces.trim}
										onChange={handleSurfaceChange}
									/>{' '}
									Trim
								</label>
								<label className='checkbox-label'>
									<input
										type='checkbox'
										name='doors'
										checked={room.surfaces.doors}
										onChange={handleSurfaceChange}
									/>{' '}
									Doors
								</label>
								<label className='checkbox-label'>
									<input
										type='checkbox'
										name='crownMolding'
										checked={room.surfaces.crownMolding || false}
										onChange={handleSurfaceChange}
									/>{' '}
									Crown Molding
								</label>
							</div>
						</div>
					</div>

					{/* 4. Surface Details (Conditional) */}
					{showDetails && (
						<div className='form-group-box'>
							<div className='conditional-fields-container'>
								{room.surfaces.ceiling && (
									<div className='form-group'>
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
									<div className='form-group'>
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
									<div className='form-group'>
										<label>Crown Molding Style</label>
										<select
											name='crownMoldingStyle'
											value={room.crownMoldingStyle || 'Simple'}
											onChange={handleFieldChange}
										>
											<option value='Simple'>Simple / Smooth</option>
											<option value='Ornate'>Ornate / Detailed / Dental</option>
										</select>
									</div>
								)}
								{room.surfaces.doors && (
									<>
										<div className='form-group'>
											<label>How many doors?</label>
											<input
												type='number'
												name='doorCount'
												className='small-input'
												min='0'
												value={room.doorCount || '1'}
												onChange={handleFieldChange}
											/>
										</div>
										<div className='form-group'>
											<label>Door Style</label>
											<select
												name='doorStyle'
												value={room.doorStyle || 'Slab'}
												onChange={handleFieldChange}
											>
												<option value='Slab'>Flat / Slab</option>
												<option value='Paneled'>Paneled (e.g., 6-panel)</option>
											</select>
										</div>
									</>
								)}
							</div>
						</div>
					)}

					{/* 5. General Condition & Color */}
					<div className='form-group-box'>
						<div className='form-group-grid'>
							<div className='form-group'>
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
							<div className='form-group'>
								<label>Color Change</label>
								<select
									name='colorChange'
									value={room.colorChange}
									onChange={handleFieldChange}
								>
									<option value='Similar'>Similar Color</option>
									<option value='Light-to-Dark'>Light-to-Dark</option>
									<option value='Dark-to-Light'>Dark-to-Light</option>
								</select>
							</div>
						</div>
					</div>

					{/* Add Another Button */}
					{onRoomAdd && (
						<button
							type='button'
							className='btn-add-room'
							style={{ marginTop: '1rem' }}
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
