import React, { useState } from 'react';
import type { FormData, RoomDetail, BasementData } from './EstimatorTypes';
import { Ruler, Layout, Hammer, Plus, Trash2 } from 'lucide-react';
import { InfoTooltip } from '@/components/common/infoTooltip/InfoTooltip';
import { FloatingAlert } from '@/components/common/floatingAlert/FloatingAlert';
import styles from './styles/BasementForm.module.css';

interface BasementFormProps {
	formData: FormData;
	onFieldChange: (field: keyof BasementData, value: unknown) => void;
	onServiceChange: (field: keyof BasementData['services'], value: unknown) => void;
}

export const BasementForm: React.FC<BasementFormProps> = ({
	formData,
	onFieldChange,
	onServiceChange,
}) => {
	const { basement } = formData;

	const [showScopeWarning, setShowScopeWarning] = useState(true);

	// --- HANDLERS ---
	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value, type } = e.target;
		const finalValue = type === 'number' ? Number(value) : value;
		onFieldChange(name, finalValue);
	};

	const handleServiceChange = (field: keyof BasementData['services'], value: unknown) => {
		onServiceChange(field, value);
	};

	const handleGridChange = (size: '2x2' | '2x4') => {
		onFieldChange('ceilingGrid', size);
	};

	// --- ROOM MANAGER LOGIC ---
	const bedrooms = (basement.rooms || []).filter((r) => r.type === 'Bedroom');
	const bathrooms = (basement.rooms || []).filter((r) => r.type === 'Bathroom');

	const addRoom = (type: 'Bedroom' | 'Bathroom') => {
		if (type === 'Bedroom' && bedrooms.length >= 5) return;
		if (type === 'Bathroom' && bathrooms.length >= 2) return;

		const newRoom: RoomDetail = {
			id: Math.random().toString(36).substr(2, 9),
			type,
			size: 'Medium (12x12)',
			bathType: type === 'Bathroom' ? 'Full Bath' : undefined,
		};
		const updatedRooms = [...(basement.rooms || []), newRoom];
		onFieldChange('rooms', updatedRooms);
	};

	const removeRoom = (id: string) => {
		const updatedRooms = (basement.rooms || []).filter((r) => r.id !== id);
		onFieldChange('rooms', updatedRooms);
	};

	const updateRoom = (id: string, field: keyof RoomDetail, value: unknown) => {
		const updatedRooms = (basement.rooms || []).map((r) =>
			r.id === id ? { ...r, [field]: value } : r
		);
		onFieldChange('rooms', updatedRooms);
	};

	return (
		<div className={styles.serviceFormBox}>
			<h3 className={styles.serviceFormTitle}>Basement Finishing</h3>

			<FloatingAlert
				isVisible={showScopeWarning}
				onClose={() => setShowScopeWarning(false)}
				type='warning'
				title='Scope of Estimate'
				message='This calculator estimates Framing, Insulation, Drywall, and Painting. Electrical, Plumbing, and Flooring are NOT included in this instant price.'
			/>

			{/* SECTION 1: DIMENSIONS */}
			<div className={styles.basementSection}>
				<h4 className={styles.basementSectionTitle}>
					<Ruler size={18} />
					1. Dimensions & Condition
				</h4>
				<div className={styles.basementGrid}>
					<div className={styles.formGroup}>
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
					<div className={styles.formGroup}>
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
					<div className={styles.formGroup}>
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
					<div className={styles.formGroup}>
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
			<div className={styles.basementSection}>
				<div className={styles.basementSectionTitle}>
					<Layout size={18} />
					<span>2. Rooms & Layout</span>
					<InfoTooltip message='Add rooms to calculate interior partition walls.' />
				</div>

				<div className={styles.basementGrid}>
					{/* COLUMN 1: BEDROOMS */}
					<div>
						<div className={styles.roomManagerHeader}>
							<span className={styles.roomManagerLabel}>
								Bedrooms ({bedrooms.length}/5)
							</span>
							<button
								type='button'
								className={styles.addRoomBtnSmall}
								onClick={() => addRoom('Bedroom')}
								disabled={bedrooms.length >= 5}
							>
								<Plus size={14} /> Add
							</button>
						</div>

						{bedrooms.map((room, index) => (
							<div
								key={room.id}
								className={styles.roomItemRow}
							>
								<span className={styles.roomItemLabel}>Bed {index + 1}</span>
								<select
									className={styles.roomSelect}
									value={room.size}
									onChange={(e) => updateRoom(room.id, 'size', e.target.value)}
								>
									<option value='Small (10x10)'>Small (10x10)</option>
									<option value='Medium (12x12)'>Medium (12x12)</option>
									<option value='Large (Master)'>Large (Master)</option>
								</select>
								<button
									type='button'
									className={styles.removeRoomBtn}
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
						<div className={styles.roomManagerHeader}>
							<span className={styles.roomManagerLabel}>
								Bathrooms ({bathrooms.length}/2)
								<InfoTooltip message='A half bath consists of a toilet and sink only. A full bath includes a toilet sink and shower.' />
							</span>
							<button
								type='button'
								className={styles.addRoomBtnSmall}
								onClick={() => addRoom('Bathroom')}
								disabled={bathrooms.length >= 2}
							>
								<Plus size={14} /> Add
							</button>
						</div>

						{bathrooms.map((room, index) => (
							<div
								key={room.id}
								className={styles.roomItemRow}
							>
								<span className={styles.roomItemLabel}>Bath {index + 1}</span>
								<select
									className={styles.roomSelect}
									value={room.bathType}
									onChange={(e) =>
										updateRoom(room.id, 'bathType', e.target.value)
									}
								>
									<option value='Half Bath'>Half Bath (~5x8)</option>
									<option value='Full Bath'>Full Bath (~8x10)</option>
								</select>
								<button
									type='button'
									className={styles.removeRoomBtn}
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
							<div className={styles.formGroup}>
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
										onFieldChange('hasWetBar', e.target.value === 'Yes')
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
			<div className={styles.basementSection}>
				<h4 className={styles.basementSectionTitle}>
					<Hammer size={18} />
					3. Scope of Work
				</h4>
				<div className={styles.basementGrid}>
					{/* CEILING FINISH */}
					<div className={styles.formGroup}>
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
					<div className={styles.formGroup}>
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
			<div className={`${styles.basementSection} ${styles.plain}`}>
				<div className={styles.formGroup}>
					<label>Additional Notes</label>
					<textarea
						className={styles.basementTextarea}
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