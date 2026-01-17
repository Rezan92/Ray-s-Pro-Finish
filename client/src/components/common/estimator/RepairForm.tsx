import React, { useState } from 'react';
import type { FormData, RepairItem } from './EstimatorTypes';
import { Plus, Trash2, AlertCircle, X, Edit2 } from 'lucide-react';
import { Button } from '@/components/common/button/Button';
import './styles/RepairForm.css'; // Scoped styles for the repair module

interface RepairFormProps {
	formData: FormData;
	onNestedChange: (path: 'patching', field: string, value: any) => void;
	onAddRepair: (repair: RepairItem) => void;
	onUpdateRepair: (repair: RepairItem) => void;
	onRemoveRepair: (id: string) => void;
}

const INITIAL_REPAIR: RepairItem = {
	id: '',
	damageType: 'Hole',
	size: 'Medium (<12")',
	locationName: '',
	quantity: 1,
	placement: 'Wall',
	accessibility: 'Standard',
	texture: 'Smooth',
	scope: 'Patch Only',
	paintMatching: 'Customer has paint',
	wallHeight: '8ft (Standard)', // Default
	wallWidth: '10ft (Medium)', // Default
};

export const RepairForm: React.FC<RepairFormProps> = ({
	formData,
	onNestedChange,
	onAddRepair,
	onUpdateRepair,
	onRemoveRepair,
}) => {
	const { patching } = formData;
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null); // Track if we are editing an existing item
	const [newRepair, setNewRepair] = useState<RepairItem>(INITIAL_REPAIR);

	const handleNewRepairChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;

		let finalValue: any = value;
		if (name === 'quantity') {
			const parsed = parseInt(value) || 1;
			finalValue = Math.max(1, Math.min(parsed, 5));
		}

		let updatedRepair = {
			...newRepair,
			[name]: finalValue,
		};

		if (name === 'scope' && !value.includes('Paint')) {
			updatedRepair.paintMatching = 'Customer has paint';
			updatedRepair.wallHeight = '8ft (Standard)';
			updatedRepair.wallWidth = '10ft (Medium)';
		}

		if (name === 'paintMatching' && value !== 'Paint entire wall') {
			updatedRepair.wallHeight = '8ft (Standard)';
			updatedRepair.wallWidth = '10ft (Medium)';
		}

		setNewRepair(updatedRepair);
	};

	// Opens modal for a fresh repair
	const handleOpenAdd = () => {
		setEditingId(null);
		setNewRepair(INITIAL_REPAIR);
		setIsModalOpen(true);
	};

	// Opens modal to edit an existing repair
	const handleOpenEdit = (repair: RepairItem) => {
		setEditingId(repair.id);
		setNewRepair(repair);
		setIsModalOpen(true);
	};

	const handleSaveClick = () => {
		if (!newRepair.locationName) {
			alert('Please specify a location (e.g., North Wall)');
			return;
		}

		if (editingId) {
			onUpdateRepair({
				...newRepair,
				id: editingId,
			});
		} else {
			onAddRepair({
				...newRepair,
				id: Date.now().toString(),
			});
		}

		setNewRepair({ ...INITIAL_REPAIR });
		setEditingId(null);
		setIsModalOpen(false);
	};

	const showPaintOptions = newRepair.scope.includes('Paint');

	return (
		<div className='service-form-box repair-service-container'>
			<h3 className='service-form-title'>Drywall Repair & Patching</h3>

			{/* Instruction Box */}
			<div className='form-group-box'>
				<p className='form-hint-text'>
					Add specific repairs to your list. For minor surface dings, use the
					description box below.
				</p>
			</div>

			{/* List of Added Repairs */}
			<div className='added-repairs-list'>
				<div
					className='flex-header-between'
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						marginBottom: '1rem',
					}}
				>
					<h4
						className='room-details-title'
						style={{ margin: 0 }}
					>
						Your Repair List ({patching.repairs.length})
					</h4>
					<Button
						type='button'
						variant='primary'
						size='sm'
						onClick={handleOpenAdd}
					>
						<Plus size={16} /> Add Repair
					</Button>
				</div>

				{patching.repairs.length === 0 ? (
					<div className='rf-empty-list'>No major repairs added yet.</div>
				) : (
					patching.repairs.map((item, index) => (
						<div
							key={item.id}
							className='rf-added-repair-item'
						>
							<div className='rf-repair-info'>
								<strong>
									{index + 1}. {item.locationName} (x{item.quantity})
								</strong>
								<div className='rf-repair-meta'>
									{item.damageType} • {item.size} • {item.texture} •{' '}
									{item.scope}
								</div>
							</div>
							<div
								className='rf-action-group'
								style={{ display: 'flex', gap: '8px' }}
							>
								<button
									type='button'
									style={{
										background: 'none',
										border: 'none',
										color: '#666',
										cursor: 'pointer',
									}}
									onClick={() => handleOpenEdit(item)}
									title='Edit Repair'
								>
									<Edit2 size={18} />
								</button>
								<button
									type='button'
									className='btn-remove'
									onClick={() => onRemoveRepair(item.id)}
									title='Remove Repair'
								>
									<Trash2 size={18} />
								</button>
							</div>
						</div>
					))
				)}
			</div>

			{/* --- THE REPAIR MODAL --- */}
			{isModalOpen && (
				<div className='rf-modal-overlay'>
					<div className='rf-modal-content'>
						<button
							className='rf-modal-close'
							onClick={() => setIsModalOpen(false)}
						>
							<X size={24} />
						</button>
						<h4
							className='room-details-title'
							style={{ color: 'var(--color-primary)', marginBottom: '1.5rem' }}
						>
							{editingId ? 'Edit Repair' : 'Add a Major Repair'}
						</h4>

						{/* 1. Location & Quantity */}
						<div className='form-group-box'>
							<div className='form-group-grid'>
								<div className='form-group'>
									<label>
										Specific Wall/Ceiling (e.g. Master Bedroom North Wall)*
									</label>
									<input
										type='text'
										name='locationName'
										value={newRepair.locationName}
										onChange={handleNewRepairChange}
										placeholder='e.g. Living Room - West Wall'
									/>
								</div>
								<div className='form-group'>
									<label>Number of patches on this specific wall</label>
									<input
										type='number'
										name='quantity'
										min='1'
										max='5'
										value={newRepair.quantity}
										onChange={handleNewRepairChange}
									/>
									<p
										className='form-hint-text'
										style={{ marginTop: '4px', fontSize: '0.75rem' }}
									>
										Note: We cap estimates at 5 patches per wall. If you have
										more, just select 5—our pros will assess additional surface
										prep during the final walkthrough.
									</p>
								</div>
							</div>
						</div>

						{/* 2. Type & Placement */}
						<div className='form-group-box'>
							<div className='form-group-grid'>
								<div className='form-group'>
									<label>Damage Type</label>
									<select
										name='damageType'
										value={newRepair.damageType}
										onChange={handleNewRepairChange}
									>
										<option value='Dings/Nail Pops'>
											Dings / Nail Pops (Surface only)
										</option>
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
										<option value='Ceiling'>Ceiling</option>
									</select>
								</div>
							</div>
						</div>
						{/* 3. Size & Texture */}
						<div className='form-group-box'>
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
						</div>
						{/* 4. Scope & Paint */}
						<div className='form-group-box'>
							<div className='form-group-grid'>
								<div className='form-group'>
									<label>Scope of Work</label>
									<select
										name='scope'
										value={newRepair.scope}
										onChange={handleNewRepairChange}
									>
										<option value='Patch Only'>
											Patch Only (Ready for paint)
										</option>
										<option value='Patch & Prime'>Patch & Prime</option>
										<option value='Patch, Prime & Paint'>
											Patch, Prime & Paint
										</option>
									</select>
								</div>
								<div className='form-group'>
									<label>Accessibility</label>
									<select
										name='accessibility'
										value={newRepair.accessibility}
										onChange={handleNewRepairChange}
									>
										<option value='Standard'>
											Standard (Reachable from floor)
										</option>
										<option value='Ladder'>
											Medium (Requires 6-8ft Ladder)
										</option>
										<option value='High'>
											High / Vaulted (Scaffold/Ext. Ladder)
										</option>
									</select>
								</div>
							</div>
						</div>
						{showPaintOptions && (
							<div className='form-group-box'>
								<div className='form-group'>
									<label>Paint Strategy</label>
									<select
										name='paintMatching'
										value={newRepair.paintMatching}
										onChange={handleNewRepairChange}
									>
										<option value='Customer has paint'>
											I have the original paint
										</option>
										<option value='Color Match needed'>
											Only paint the patches with a color match (80% match)
										</option>
										<option value='Paint entire wall'>
											Paint the entire wall (Best finish)
										</option>
									</select>
								</div>
							</div>
						)}
						{/* Conditional Dimensions (Below the Paint Strategy dropdown)*/}
						{showPaintOptions &&
							newRepair.paintMatching === 'Paint entire wall' && (
								<div className='form-group-box'>
									<div className='form-group-grid'>
										<div className='form-group'>
											<label>Wall Height</label>
											<select
												name='wallHeight'
												value={newRepair.wallHeight}
												onChange={handleNewRepairChange}
											>
												<option value='8ft (Standard)'>8ft (Standard)</option>
												<option value='9-10ft'>9-10ft</option>
												<option value='11ft+ (Scaffold)'>
													11ft+ (Scaffold)
												</option>
											</select>
										</div>
										<div className='form-group'>
											<label>Wall Width</label>
											<select
												name='wallWidth'
												value={newRepair.wallWidth}
												onChange={handleNewRepairChange}
											>
												<option value='6ft (Small)'>6ft (Small)</option>
												<option value='10ft (Medium)'>10ft (Medium)</option>
												<option value='12ft (Large)'>12ft (Large)</option>
												<option value='14ft+ (Very Large)'>
													14ft+ (Very Large)
												</option>
											</select>
										</div>
									</div>
								</div>
							)}

						<div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
							<Button
								type='button'
								variant='dark'
								style={{ flex: 1 }}
								onClick={() => setIsModalOpen(false)}
							>
								Cancel
							</Button>
							<Button
								type='button'
								variant='primary'
								style={{ flex: 1 }}
								onClick={handleSaveClick}
							>
								{editingId ? 'Update Repair' : 'Add This Repair'}
							</Button>
						</div>
					</div>
				</div>
			)}

			{/* --- Small Repairs Box --- */}
			<div
				className='form-group-box'
				style={{ marginTop: '2rem' }}
			>
				<div className='form-group'>
					<label style={{ display: 'flex', justifyContent: 'space-between' }}>
						<span>Small Repairs / Description</span>
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
						<span>Have small nail pops or minor dings? List them here.</span>
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
						placeholder='e.g. 5 nail pops in the hallway...'
					/>
				</div>
			</div>
		</div>
	);
};
