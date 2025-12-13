import React, { useState } from 'react';
import type { FormData, RepairItem } from './EstimatorTypes';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/common/button/Button';

interface RepairFormProps {
	formData: FormData;
	onNestedChange: (path: 'patching', field: string, value: any) => void;
	onAddRepair: (repair: RepairItem) => void;
	onRemoveRepair: (id: string) => void;
}

const INITIAL_REPAIR: RepairItem = {
	id: '',
	damageType: 'Hole',
	size: 'Medium (<12")',
	placement: 'Wall',
	texture: 'Smooth',
	scope: 'Patch Only',
	paintMatching: 'Customer has paint',
	accessibility: 'Standard',
};

export const RepairForm: React.FC<RepairFormProps> = ({
	formData,
	onNestedChange,
	onAddRepair,
	onRemoveRepair,
}) => {
	const { patching } = formData;

	// Local state for the "New Repair" card
	const [newRepair, setNewRepair] = useState<RepairItem>(INITIAL_REPAIR);

	const handleNewRepairChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		setNewRepair({ ...newRepair, [e.target.name]: e.target.value });
	};

	const handleAddClick = () => {
		onAddRepair({
			...newRepair,
			id: Date.now().toString(), // Simple ID generation
		});
		// Reset form
		setNewRepair({ ...INITIAL_REPAIR });
	};

	const showPaintOptions = newRepair.scope.includes('Paint');

	return (
		<div className='service-form-box'>
			<h3 className='service-form-title'>Drywall Repair & Patching</h3>

			<div
				className='form-group-box'
				style={{ backgroundColor: '#fff', border: 'none', paddingLeft: 0 }}
			>
				<p style={{ marginBottom: '1rem', color: '#666' }}>
					For larger repairs, please add them to the list below. For small
					dings, use the description box at the bottom.
				</p>
			</div>

			{/* --- 1. LIST OF ADDED REPAIRS --- */}
			{patching.repairs.length > 0 && (
				<div className='added-repairs-list'>
					<h4 className='room-details-title'>Your Repair List</h4>
					{patching.repairs.map((item, index) => (
						<div
							key={item.id}
							className='form-group-box repair-item-summary'
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
							}}
						>
							<div>
								<strong>
									{index + 1}. {item.placement} - {item.damageType}
								</strong>
								<div style={{ fontSize: '0.85rem', color: '#666' }}>
									{item.size} • {item.texture} • {item.scope}
								</div>
							</div>
							<button
								type='button'
								className='btn-remove'
								onClick={() => onRemoveRepair(item.id)}
							>
								<Trash2 size={18} />
							</button>
						</div>
					))}
				</div>
			)}

			{/* --- 2. ADD NEW REPAIR BUILDER --- */}
			<div
				className='form-group-box'
				style={{ border: '2px solid var(--color-primary)', marginTop: '2rem' }}
			>
				<h4
					className='room-details-title'
					style={{ color: 'var(--color-primary)' }}
				>
					Add a Major Repair
				</h4>

				<div className='form-group-grid'>
					<div className='form-group'>
						<label>Damage Type</label>
						<select
							name='damageType'
							value={newRepair.damageType}
							onChange={handleNewRepairChange}
						>
							<option value='Hole'>Hole / Impact Damage</option>
							<option value='Crack'>Stress Crack</option>
							<option value='Water Damage'>Water Damage</option>
							<option value='Tape Issues'>Peeling Tape / Blisters</option>
						</select>
					</div>
					<div className='form-group'>
						<label>Placement</label>
						<select
							name='placement'
							value={newRepair.placement}
							onChange={handleNewRepairChange}
						>
							<option value='Wall'>Wall</option>
							<option value='Ceiling'>Ceiling (Harder access)</option>
						</select>
					</div>
				</div>
				<div className='form-group'>
					<label>Height / Accessibility</label>
					<select
						name='accessibility'
						value={newRepair.accessibility}
						onChange={handleNewRepairChange}
					>
						<option value='Standard'>
							Standard (Reachable from floor/small stool)
						</option>
						<option value='Ladder'>
							Medium Height (Requires 6-8ft Ladder)
						</option>
						<option value='High'>
							High / Vaulted (Requires Extension Ladder/Scaffold)
						</option>
					</select>
				</div>
				<div className='form-group-grid'>
					<div className='form-group'>
						<label>Size of Damage</label>
						<select
							name='size'
							value={newRepair.size}
							onChange={handleNewRepairChange}
						>
							<option value='Medium (<12")'>
								Medium (Plate size or smaller)
							</option>
							<option value='Large (1-3ft)'>Large (1-3 feet)</option>
							<option value='X-Large (Sheet+)'>
								X-Large (Full sheet or more)
							</option>
						</select>
					</div>
					<div className='form-group'>
						<label>Texture Matching</label>
						<select
							name='texture'
							value={newRepair.texture}
							onChange={handleNewRepairChange}
						>
							<option value='Smooth'>Smooth / Flat</option>
							<option value='Orange Peel'>Orange Peel</option>
							<option value='Knockdown'>Knockdown</option>
							<option value='Popcorn'>Popcorn (Ceiling)</option>
						</select>
					</div>
				</div>

				<div className='form-group'>
					<label>Scope of Work</label>
					<select
						name='scope'
						value={newRepair.scope}
						onChange={handleNewRepairChange}
					>
						<option value='Patch Only'>Patch Only (Ready for paint)</option>
						<option value='Patch & Prime'>Patch & Prime</option>
						<option value='Patch, Prime & Paint'>Patch, Prime & Paint</option>
					</select>
				</div>

				{showPaintOptions && (
					<div className='conditional-field'>
						<div className='form-group'>
							<label>Paint Matching</label>
							<select
								name='paintMatching'
								value={newRepair.paintMatching}
								onChange={handleNewRepairChange}
							>
								<option value='Customer has paint'>
									I have the original paint
								</option>
								<option value='Color Match needed'>
									I need a color match (Sample required)
								</option>
								<option value='Paint entire wall'>
									Paint the entire wall (Best finish)
								</option>
							</select>
						</div>
					</div>
				)}

				<Button
					type='button'
					variant='dark'
					className='btn-add-room'
					style={{ width: '100%', marginTop: '1rem' }}
					onClick={handleAddClick}
				>
					<Plus size={18} /> Add This Repair
				</Button>
			</div>

			{/* --- 3. SMALL REPAIRS --- */}
			<div className='form-group-box global-questions'>
				<div className='form-group'>
					<label>
						Small Repairs / Description
						<span
							style={{
								fontWeight: 'normal',
								fontSize: '0.8rem',
								color: '#666',
								marginLeft: '8px',
							}}
						>
							(Max 600 chars)
						</span>
					</label>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: '8px',
							marginBottom: '8px',
							fontSize: '0.9rem',
							color: '#666',
						}}
					>
						<AlertCircle size={16} />
						<span>
							Have small nail pops or minor dings? Just list them here.
						</span>
					</div>
					<textarea
						name='smallRepairsDescription'
						value={patching.smallRepairsDescription || ''}
						onChange={(e) =>
							onNestedChange(
								'patching',
								'smallRepairsDescription',
								e.target.value
							)
						}
						maxLength={600}
						rows={3}
						placeholder='e.g. 5 nail pops in the hallway, small ding behind the bedroom door...'
					/>
					<div
						style={{ textAlign: 'right', fontSize: '0.8rem', color: '#999' }}
					>
						{(patching.smallRepairsDescription || '').length} / 600
					</div>
				</div>
			</div>
		</div>
	);
};
