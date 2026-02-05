import React, { useState } from 'react';
import type { FormData, RepairItem } from './EstimatorTypes';
import { Plus, Trash2, AlertCircle, X, Edit2 } from 'lucide-react';
import { Button } from '@/components/common/button/Button';
import { InfoTooltip } from '@/components/common/infoTooltip/InfoTooltip';
import styles from './styles/RepairForm.module.css';

interface RepairFormProps {
	formData: FormData;
	onFieldChange: (field: string, value: any) => void;
	onAddRepair: (repair: RepairItem) => void;
	onUpdateRepair: (repair: RepairItem) => void;
	onRemoveRepair: (id: string) => void;
}

const INITIAL_REPAIR: RepairItem = {
	id: '',
	damageType: 'Hole / Impact Damage', // Matches backend default
	size: 'Medium (<12")',
	locationName: '',
	quantity: 1,
	placement: 'Wall',
	accessibility: 'Standard',
	texture: 'Smooth',
	scope: 'Patch Only',
	paintMatching: 'Customer has paint',
	wallHeight: '8ft (Standard)',
	wallWidth: '10ft (Medium)',
};

export const RepairForm: React.FC<RepairFormProps> = ({
	formData,
	onFieldChange,
	onAddRepair,
	onUpdateRepair,
	onRemoveRepair,
}) => {
	const repairData = (formData as any).patching; // Use the migrated key
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

		if (name === 'damageType') {
			const isLinear = value === 'Stress Crack' || value === 'Peeling Tape';
			const isSpecialty =
				value === 'Corner Bead Repair' || value === 'Water Damage';

			if (isLinear) updatedRepair.size = 'Small (1-3ft)';
			else if (isSpecialty) updatedRepair.size = 'Standard';
			else updatedRepair.size = 'Medium (<12")';
		}

		if (name === 'scope' && !value.includes('Paint')) {
			updatedRepair.paintMatching = 'Customer has paint';
		}

		setNewRepair(updatedRepair);
	};

	const getSizeOptions = () => {
		const type = newRepair.damageType;

		if (type === 'Dings/Nail Pops') {
			return (
				<>
					<option value='Small (1-5 pops)'>Small (1-5 pops)</option>
					<option value='Medium (6-15 pops)'>Medium (6-15 pops)</option>
					<option value='Large (16+ pops)'>Large (16+ pops)</option>
				</>
			);
		}

		if (type === 'Stress Crack' || type === 'Peeling Tape') {
			return (
				<>
					<option value='Small (1-3ft)'>Small (1-3 linear feet)</option>
					<option value='Medium (3-5ft)'>Medium (3-5 linear feet)</option>
					<option value='Large (5ft+)'>Large (5+ linear feet)</option>
				</>
			);
		}
		if (type === 'Corner Bead Repair' || type === 'Water Damage') {
			return <option value='Standard'>Standard Repair</option>;
		}
		return (
			<>
				<option value='Medium (<12")'>Medium (Plate size or smaller)</option>
				<option value='Large (1-3ft)'>Large (1-3 feet)</option>
				<option value='X-Large (Sheet+)'>X-Large (Full sheet or more)</option>
			</>
		);
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
		<div className={`${styles.serviceFormBox} ${styles.repairServiceContainer}`}>
			<h3 className={styles.serviceFormTitle}>Drywall Repair & Patching</h3>

			{/* Instruction Box */}
			<div className={styles.formGroupBox}>
				<p className={styles.formHintText}>
					Add specific repairs to your list. For minor surface dings, use the
					description box below.
				</p>
			</div>

			{/* List of Added Repairs */}
			<div className={styles.addedRepairsList}>
				<div className={styles.flexHeaderBetween}>
					<h4
						className={styles.roomDetailsTitle}
						style={{ margin: 0 }}
					>
						Your Repair List ({(repairData.repairs || []).length})
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

				{(repairData.repairs || []).length === 0 ? (
					<div className={styles.rfEmptyList}>No major repairs added yet.</div>
				) : (
					repairData.repairs.map((item: any, index: number) => (
						<div
							key={item.id}
							className={styles.rfAddedRepairItem}
						>
							<div className={styles.rfRepairInfo}>
								<strong>
									{index + 1}. {item.locationName} (x{item.quantity})
								</strong>
								<div className={styles.rfRepairMeta}>
									{item.damageType} • {item.size} • {item.texture} •{' '}
									{item.scope}
								</div>
							</div>
							<div
								className={styles.rfActionGroup}
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
									className={styles.btnRemove}
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
				<div className={styles.rfModalOverlay}>
					<div className={styles.rfModalContent}>
						<button
							className={styles.rfModalClose}
							onClick={() => setIsModalOpen(false)}
						>
							<X size={24} />
						</button>
						<h4
							className={styles.roomDetailsTitle}
							style={{ color: 'var(--color-primary)', marginBottom: '1.5rem' }}
						>
							{editingId ? 'Edit Repair' : 'Add a Major Repair'}
						</h4>

						{/* 1. Location & Quantity */}
						<div className={styles.formGroupBox}>
							<div className={styles.formGroupGrid}>
								<div className={styles.formGroup}>
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
								<div className={styles.formGroup}>
									<label style={{ display: 'flex', alignItems: 'center' }}>
										Number of patches on this specific wall
										<InfoTooltip message='We cap estimates at 5 patches per wall. If you have more, just select 5—our pros will assess additional surface prep during the walkthrough.' />
									</label>
									<input
										type='number'
										name='quantity'
										min='1'
										max='5'
										value={newRepair.quantity}
										onChange={handleNewRepairChange}
									/>
								</div>
							</div>
						</div>

						{/* 2. Type & Placement */}
						<div className={styles.formGroupBox}>
							<div className={styles.formGroupGrid}>
								<div className={styles.formGroup}>
									<label>Damage Type</label>
									<select
										name='damageType'
										value={newRepair.damageType}
										onChange={handleNewRepairChange}
									>
										<option value='Dings/Nail Pops'>
											Dings / Nail Pops (Surface only)
										</option>
										<option value='Hole / Impact Damage'>
											Hole / Impact Damage
										</option>
										<option value='Stress Crack'>Stress Crack</option>
										<option value='Peeling Tape'>
											Peeling Tape / Blisters
										</option>
										<option value='Corner Bead Repair'>
											Corner Bead Repair
										</option>
										<option value='Water Damage'>
											Water Damage Investigation
										</option>
									</select>
								</div>
								<div className={styles.formGroup}>
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
						<div className={styles.formGroupBox}>
							<div className={styles.formGroupGrid}>
								<div className={styles.formGroup}>
									<label>Size of Damage</label>
									<select
										name='size'
										value={newRepair.size}
										onChange={handleNewRepairChange}
									>
										{getSizeOptions()}
									</select>
								</div>
								<div className={styles.formGroup}>
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
						<div className={styles.formGroupBox}>
							<div className={styles.formGroupGrid}>
								<div className={styles.formGroup}>
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
								<div className={styles.formGroup}>
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
							<div className={styles.formGroupBox}>
								<div className={styles.formGroup}>
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
								<div className={styles.formGroupBox}>
									<div className={styles.formGroupGrid}>
										<div className={styles.formGroup}>
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
										<div className={styles.formGroup}>
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
				className={styles.formGroupBox}
				style={{ marginTop: '2rem' }}
			>
				<div className={styles.formGroup}>
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
						value={repairData.smallRepairsDescription || ''}
						onChange={(e) =>
							onFieldChange('smallRepairsDescription', e.target.value)
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