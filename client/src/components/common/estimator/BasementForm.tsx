import React, { useEffect } from 'react';
import type { FormData, RoomDetail } from './EstimatorTypes';
import { Ruler, Layout, Hammer, Plus, Trash2 } from 'lucide-react';
import { InfoTooltip } from '@/components/common/infoTooltip/InfoTooltip';
import './styles/BasementForm.css';

interface BasementFormProps {
	formData: FormData;
	onNestedChange: (path: 'basement', field: string, value: any) => void;
}

export const BasementForm: React.FC<BasementFormProps> = ({
	formData,
	onNestedChange,
}) => {
	const { basement } = formData;

	// Defaults Initialization
	useEffect(() => {
		if (!basement.services) {
			onNestedChange('basement', 'services', {
				framing: true,
				drywall: true,
				painting: true,
				ceilingFinish: 'Drywall',
			});
		}
		if (!basement.rooms) {
			onNestedChange('basement', 'rooms', []);
		}
		// Ensure strict string match for framing logic
		if (!basement.condition) {
			onNestedChange('basement', 'condition', 'Bare Concrete');
		}
		// Default Grid Size
		if (!basement.ceilingGrid) {
			onNestedChange('basement', 'ceilingGrid', '2x4');
		}
	}, []);

	// --- HANDLERS ---
	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value, type } = e.target;
		const finalValue = type === 'number' ? Number(value) : value;
		onNestedChange('basement', name, finalValue);
	};

	const handleServiceChange = (field: string, value: any) => {
		onNestedChange('basement', 'services', {
			...basement.services,
			[field]: value,
		});
	};

	const handleGridChange = (size: '2x2' | '2x4') => {
		onNestedChange('basement', 'ceilingGrid', size);
	};

	// --- ROOM MANAGER LOGIC ---
	const bedrooms = (basement.rooms || []).filter((r) => r.type === 'Bedroom');
	const bathrooms = (basement.rooms || []).filter((r) => r.type === 'Bathroom');

	const addRoom = (type: 'Bedroom' | 'Bathroom') => {
		// Limits Check
		if (type === 'Bedroom' && bedrooms.length >= 5) return;
		if (type === 'Bathroom' && bathrooms.length >= 2) return;

		const newRoom: RoomDetail = {
			id: Math.random().toString(36).substr(2, 9),
			type,
			size: 'Medium (12x12)', // Default
			bathType: type === 'Bathroom' ? 'Full Bath' : undefined,
		};

		const updatedRooms = [...(basement.rooms || []), newRoom];
		onNestedChange('basement', 'rooms', updatedRooms);
	};

	const removeRoom = (id: string) => {
		const updatedRooms = (basement.rooms || []).filter((r) => r.id !== id);
		onNestedChange('basement', 'rooms', updatedRooms);
	};

	const updateRoom = (id: string, field: keyof RoomDetail, value: any) => {
		const updatedRooms = (basement.rooms || []).map((r) =>
			r.id === id ? { ...r, [field]: value } : r
		);
		onNestedChange('basement', 'rooms', updatedRooms);
	};

	return (
		<div className='service-form-box'>
			<h3 className='service-form-title'>Basement Finishing</h3>

			{/* SECTION 1: DIMENSIONS */}
			<div className='basement-section'>
				<h4 className='basement-section-title'>
					<Ruler size={18} />
					1. Dimensions & Condition
				</h4>
				<div className='basement-grid'>
					<div className='form-group'>
						<label>Project Area (Sq Ft)</label>
						<input
							type='number'
							name='sqft'
							value={basement.sqft}
							onChange={handleChange}
							placeholder='e.g. 800'
							min='0'
						/>
					</div>
					<div className='form-group'>
						<label>Ceiling Height</label>
						<select
							name='ceilingHeight'
							value={basement.ceilingHeight || 'Standard (8ft)'}
							onChange={handleChange}
						>
							<option value='Standard (8ft)'>Standard (8ft)</option>
							<option value='Low (<7ft)'>Low (&lt;7ft)</option>
							<option value='High (9ft+)'>High (9ft+)</option>
						</select>
					</div>
					<div className='form-group'>
						<label>Current Condition</label>
						<select
							name='condition'
							value={basement.condition || 'Bare Concrete'}
							onChange={handleChange}
						>
							<option value='Bare Concrete'>
								Bare Concrete (Needs Framing)
							</option>
							<option value='Framed'>Framed Only (Needs Insulation)</option>
							<option value='Framed & Insulated'>
								Framed & Insulated (Ready for Drywall)
							</option>
						</select>
					</div>
					<div className='form-group'>
						<label>Soffit / Ductwork Complexity</label>
						<select
							name='soffitWork'
							value={basement.soffitWork || 'Average'}
							onChange={handleChange}
						>
							<option value='Minimal'>Minimal (Clean Ceiling)</option>
							<option value='Average'>Average (Main Trunk Line)</option>
							<option value='Complex'>Complex (Many Pipes/Ducts)</option>
						</select>
					</div>
				</div>
			</div>

			{/* SECTION 2: ROOMS & LAYOUT */}
			<div className='basement-section'>
				<div className='basement-section-title'>
					<Layout size={18} />
					<span>2. Rooms & Layout</span>
					<InfoTooltip message='Add rooms to calculate interior partition walls.' />
				</div>

				<div className='basement-grid'>
					{/* COLUMN 1: BEDROOMS */}
					<div>
						<div className='room-manager-header'>
							<span className='room-manager-label'>
								Bedrooms ({bedrooms.length}/5)
							</span>
							<button
								type='button'
								className='add-room-btn-small'
								onClick={() => addRoom('Bedroom')}
								disabled={bedrooms.length >= 5}
							>
								<Plus size={14} /> Add
							</button>
						</div>

						{bedrooms.map((room, index) => (
							<div
								key={room.id}
								className='room-item-row'
							>
								<span className='room-item-label'>Bed {index + 1}</span>
								<select
									className='room-select'
									value={room.size}
									onChange={(e) => updateRoom(room.id, 'size', e.target.value)}
								>
									<option value='Small (10x10)'>Small (10x10)</option>
									<option value='Medium (12x12)'>Medium (12x12)</option>
									<option value='Large (Master)'>Large (Master)</option>
								</select>
								<button
									type='button'
									className='remove-room-btn'
									onClick={() => removeRoom(room.id)}
								>
									<Trash2 size={16} />
								</button>
							</div>
						))}
						{bedrooms.length === 0 && (
							<div style={{ color: '#999', fontSize: '0.85rem' }}>
								No bedrooms added
							</div>
						)}
					</div>

					{/* COLUMN 2: BATHROOMS */}
					<div>
						<div className='room-manager-header'>
							<span className='room-manager-label'>
								Bathrooms ({bathrooms.length}/2)
							</span>
							<button
								type='button'
								className='add-room-btn-small'
								onClick={() => addRoom('Bathroom')}
								disabled={bathrooms.length >= 2}
							>
								<Plus size={14} /> Add
							</button>
						</div>

						{bathrooms.map((room, index) => (
							<div
								key={room.id}
								className='room-item-row'
							>
								<span className='room-item-label'>Bath {index + 1}</span>
								<select
									className='room-select'
									value={room.bathType}
									onChange={(e) =>
										updateRoom(room.id, 'bathType', e.target.value)
									}
								>
									<option value='Half Bath'>
										Half Bath (Toilet/Sink - Approx 5x8)
									</option>
									<option value='Full Bath'>
										Full Bath (Tub/Shower - Approx 8x10)
									</option>
								</select>
								<button
									type='button'
									className='remove-room-btn'
									onClick={() => removeRoom(room.id)}
								>
									<Trash2 size={16} />
								</button>
							</div>
						))}
						{bathrooms.length === 0 && (
							<div style={{ color: '#999', fontSize: '0.85rem' }}>
								No bathrooms added
							</div>
						)}

						{/* Wet Bar Toggle under Bathrooms */}
						<div style={{ marginTop: '1.5rem' }}>
							<div className='form-group'>
								<label
									style={{ fontSize: '0.9rem', fontWeight: 600, color: '#444' }}
								>
									Wet Bar / Kitchenette
								</label>
								<select
									style={{ marginTop: '4px' }}
									name='hasWetBar'
									value={basement.hasWetBar ? 'Yes' : 'No'}
									onChange={(e) =>
										onNestedChange(
											'basement',
											'hasWetBar',
											e.target.value === 'Yes'
										)
									}
								>
									<option value='No'>None</option>
									<option value='Yes'>Yes (Add Wall Backing)</option>
								</select>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* SECTION 3: SCOPE */}
			<div className='basement-section'>
				<h4 className='basement-section-title'>
					<Hammer size={18} />
					3. Scope of Work
				</h4>
				<div className='basement-grid'>
					{/* CEILING FINISH */}
					<div className='form-group'>
						<label>Ceiling Finish</label>
						<select
							value={basement.services?.ceilingFinish || 'Drywall'}
							onChange={(e) =>
								handleServiceChange('ceilingFinish', e.target.value)
							}
						>
							<option value='Drywall'>Drywall (Smooth/Painted)</option>
							<option value='Drop Ceiling'>Drop Ceiling (Grid)</option>
							<option value='Painted/Industrial'>
								Industrial (Spray Black)
							</option>
						</select>

						{/* Drop Ceiling Sub-Selection */}
						{basement.services?.ceilingFinish === 'Drop Ceiling' && (
							<div style={{ marginTop: '10px', marginLeft: '5px' }}>
								<label
									style={{
										fontSize: '0.85rem',
										color: '#666',
										display: 'block',
										marginBottom: '5px',
									}}
								>
									Grid Tile Size
								</label>
								<div style={{ display: 'flex', gap: '15px' }}>
									<label
										style={{
											display: 'flex',
											alignItems: 'center',
											gap: '5px',
											fontSize: '0.9rem',
											cursor: 'pointer',
										}}
									>
										<input
											type='radio'
											name='gridSize'
											value='2x4'
											checked={
												basement.ceilingGrid === '2x4' || !basement.ceilingGrid
											}
											onChange={() => handleGridChange('2x4')}
										/>
										Standard (2x4)
									</label>
									<label
										style={{
											display: 'flex',
											alignItems: 'center',
											gap: '5px',
											fontSize: '0.9rem',
											cursor: 'pointer',
										}}
									>
										<input
											type='radio'
											name='gridSize'
											value='2x2'
											checked={basement.ceilingGrid === '2x2'}
											onChange={() => handleGridChange('2x2')}
										/>
										Premium (2x2)
									</label>
								</div>
							</div>
						)}
					</div>

					{/* MOISTURE PROTECTION WITH TOOLTIP */}
					<div className='form-group'>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: '8px',
								marginBottom: '4px',
							}}
						>
							<label style={{ marginBottom: 0 }}>Moisture Protection</label>
							<InfoTooltip message='Standard: Vapor barrier only (Code Min). Premium: Rigid foam insulation against concrete for thermal break + vapor barrier (Recommended).' />
						</div>
						<select
							name='perimeterInsulation'
							value={basement.perimeterInsulation || 'Standard (Vapor Barrier)'}
							onChange={handleChange}
						>
							<option value='Standard (Vapor Barrier)'>
								Standard (Code Minimum)
							</option>
							<option value='Premium (Rigid Foam)'>
								Enhanced (Rigid Foam + Batts)
							</option>
						</select>
					</div>
				</div>
			</div>

			{/* SECTION 4: NOTES */}
			<div className='basement-section plain'>
				<div className='form-group'>
					<label>Additional Notes</label>
					<textarea
						className='basement-textarea'
						name='additionalDetails'
						value={basement.additionalDetails || ''}
						onChange={handleChange}
						rows={3}
						placeholder='Specific details about access, electrical panel location, etc...'
					/>
				</div>
			</div>
		</div>
	);
};
