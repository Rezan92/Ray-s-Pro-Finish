import React from 'react';
import type { PaintingRoom } from './EstimatorTypes';

interface PaintingRoomDetailsProps {
	room: PaintingRoom;
	onRoomChange: (roomId: string, field: string, value: any) => void;
	onRoomScopeChange: (roomId: string, field: string, value: boolean) => void;
}

// This is the "mini-form" for each room
export const PaintingRoomDetails: React.FC<PaintingRoomDetailsProps> = ({
	room,
	onRoomChange,
	onRoomScopeChange,
}) => {
	// ... (Your handleChange functions are perfect, keep them) ...
	const handleDimChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onRoomChange(room.id, 'dimensions', {
			...room.dimensions,
			[e.target.name]: e.target.value,
		});
	};

	const handleCondChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		onRoomChange(room.id, 'condition', {
			...room.condition,
			[e.target.name]: e.target.value,
		});
	};

	const handleScopeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, checked, value } = e.target;
		if (name === 'doorCount') {
			onRoomChange(room.id, 'scope', { ...room.scope, doorCount: value });
		} else {
			onRoomScopeChange(room.id, name, checked);
		}
	};

	return (
		// The title is now part of the 'service-form-box'
		<div className='service-form-box'>
			<h3 className='service-form-title'>{room.name}</h3>

			<div className='form-group-box'>
				<div className='form-group-grid'>
					<div className='form-group'>
						<label>Approx. Dimensions (L x W)</label>
						<div className='input-group'>
							<input
								type='text'
								name='length'
								value={room.dimensions.length}
								onChange={handleDimChange}
								placeholder='L'
							/>
							<span>x</span>
							<input
								type='text'
								name='width'
								value={room.dimensions.width}
								onChange={handleDimChange}
								placeholder='W'
							/>
						</div>
					</div>
					<div className='form-group'>
						<label>Ceiling Height</label>
						<select
							name='ceilingHeight'
							value={room.ceilingHeight}
							onChange={(e) =>
								onRoomChange(room.id, 'ceilingHeight', e.target.value)
							}
						>
							<option value='8ft'>8 ft (Std)</option>
							<option value='9ft'>9 ft</option>
							<option value='10ft'>10 ft</option>
							<option value='10ft+'>10 ft+</option>
						</select>
					</div>
				</div>
			</div>

			<div className='form-group-box'>
				<div className='form-group'>
					<label>What to paint?</label>
					<div className='checkbox-group horizontal'>
						<label className='checkbox-label'>
							<input
								type='checkbox'
								name='walls'
								checked={room.scope.walls}
								onChange={handleScopeChange}
							/>
							Walls
						</label>
						<label className='checkbox-label'>
							<input
								type='checkbox'
								name='ceiling'
								checked={room.scope.ceiling}
								onChange={handleScopeChange}
							/>
							Ceiling
						</label>
						<label className='checkbox-label'>
							<input
								type='checkbox'
								name='trim'
								checked={room.scope.trim}
								onChange={handleScopeChange}
							/>
							Trim
						</label>
						<label className='checkbox-label'>
							<input
								type='checkbox'
								name='doors'
								checked={room.scope.doors}
								onChange={handleScopeChange}
							/>
							Doors
						</label>
						{room.scope.doors && (
							<input
								type='text'
								name='doorCount'
								value={room.scope.doorCount}
								onChange={handleScopeChange}
								placeholder='# doors'
								className='small-input'
							/>
						)}
					</div>
				</div>
			</div>

			<div className='form-group-box'>
				{/* This grid layout achieves your "next to each other" request */}
				<div className='form-group-grid'>
					<div className='form-group'>
						<label>Current Wall Color</label>
						<select
							name='currentColor'
							value={room.condition.currentColor}
							onChange={handleCondChange}
						>
							<option value='Light'>Light</option>
							<option value='Medium'>Medium</option>
							<option value='Dark'>Dark</option>
						</select>
					</div>
					<div className='form-group'>
						<label>New Wall Color</label>
						<select
							name='newColor'
							value={room.condition.newColor}
							onChange={handleCondChange}
						>
							<option value='Light'>Light</option>
							<option value='Medium'>Medium</option>
							<option value='Dark'>Dark</option>
						</select>
					</div>
				</div>
			</div>

			<div className='form-group-box'>
				<div className='form-group'>
					<label>Prep & Condition</label>
					<select
						name='prep'
						value={room.condition.prep}
						onChange={handleCondChange}
					>
						<option value='Good'>Good (clean, few nail holes)</option>
						<option value='Fair'>Fair (some dings, marks)</option>
						<option value='Poor'>Poor (many holes, stains)</option>
					</select>
				</div>
			</div>
		</div>
	);
};
