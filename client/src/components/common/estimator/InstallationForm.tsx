import React from 'react';
import type { FormData } from './EstimatorTypes';
import { AlertTriangle, Info } from 'lucide-react';
import styles from './styles/InstallationForm.module.css';

interface InstallationFormProps {
	formData: FormData;
	onFieldChange: (field: keyof InstallationData, value: unknown) => void;
}

export const InstallationForm: React.FC<InstallationFormProps> = ({
	formData,
	onFieldChange,
}) => {
	const { installation } = formData;

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const value =
			e.target.type === 'checkbox'
				? (e.target as HTMLInputElement).checked
				: e.target.value;
		onFieldChange(e.target.name, value);
	};

	const isDemo = installation.projectType === 'Demo';
	const isHangingOnly = installation.projectType === 'Hanging';

	// LOGIC: Show framing options only for New Walls, Partitions, or New Rooms.
	const showFraming =
		installation.projectType === 'Wall' ||
		installation.projectType === 'Partition' ||
		installation.projectType === 'Room';

	// LOGIC: Show dimensions
	const isLinearProject =
		installation.projectType === 'Wall' ||
		installation.projectType === 'Partition' ||
		isDemo;
	const isAreaProject =
		installation.projectType === 'Ceiling' ||
		installation.projectType === 'Room' ||
		isHangingOnly;

	return (
		<div className={styles.serviceFormBox}>
			<h3 className={styles.serviceFormTitle}>Framing & Remodeling</h3>

			{/* 1. Project Type */}
			<div className={styles.formGroupBox}>
				<div className={styles.formGroup}>
					<label>What are we working on?</label>
					<select
						name='projectType'
						value={installation.projectType}
						onChange={handleChange}
					>
						<option value='Wall'>Build a New Wall</option>
						<option value='Partition'>Split a Room (Partition Wall)</option>
						<option value='Hanging'>Just Hanging Drywall (Board Only)</option>
						<option value='Ceiling'>Ceiling Overlay (Cover Popcorn)</option>
						<option value='Room'>New Room / Addition</option>
						<option value='Demo'>Remove / Demolish a Wall</option>
					</select>
				</div>
			</div>

			{/* 2. Dimensions & Scope */}
			<div className={styles.formGroupBox}>
				<div className={styles.formGroupGrid}>
					{/* Linear Projects (Length) */}
					{isLinearProject && (
						<>
							<div className={styles.formGroup}>
								<label>Approximate Length</label>
								<select
									name='wallLength'
									value={installation.wallLength}
									onChange={handleChange}
								>
									<option value='Small (Under 10ft)'>Small (Under 10ft)</option>
									<option value='Medium (10-20ft)'>Medium (10-20ft)</option>
									<option value='Large (20ft+)'>Large (20ft+)</option>
								</select>
							</div>
							<div className={styles.formGroup}>
								<label>Height</label>
								<select
									name='ceilingHeight'
									value={installation.ceilingHeight}
									onChange={handleChange}
								>
									<option value='Standard (8ft)'>Standard (8ft)</option>
									<option value='High (9-10ft)'>High (9-10ft)</option>
									<option value='Vaulted (12ft+)'>Vaulted (12ft+)</option>
								</select>
							</div>
						</>
					)}

					{/* Area Projects (Sq Ft) */}
					{isAreaProject && (
						<>
							<div className={styles.formGroup}>
								<label>Total Area (Sq Ft)</label>
								<input
									type='number'
									name='roomSqft'
									value={installation.roomSqft}
									onChange={handleChange}
									placeholder='e.g. 250'
									min='0'
								/>
							</div>
							<div className={styles.formGroup}>
								<label>Height</label>
								<select
									name='ceilingHeight'
									value={installation.ceilingHeight}
									onChange={handleChange}
								>
									<option value='Standard (8ft)'>Standard (8ft)</option>
									<option value='High (9-10ft)'>High (9-10ft)</option>
									<option value='Vaulted (12ft+)'>Vaulted (12ft+)</option>
								</select>
							</div>
						</>
					)}
				</div>
			</div>

			{/* 3. DEMOLITION SPECIFICS */}
			{isDemo && (
				<div
					className={styles.formGroupBox}
					style={{ borderLeft: '4px solid #dc2626' }}
				>
					<h4
						className={styles.roomDetailsTitle}
						style={{ fontSize: '1rem', color: '#dc2626', marginBottom: '1rem' }}
					>
						Demolition Safety
					</h4>
					<div className={styles.formGroup}>
						<label
							style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
						>
							<AlertTriangle
								size={18}
								color='#dc2626'
							/>
							Is this a Load-Bearing Wall?
						</label>
						<select
							name='isLoadBearing'
							value={installation.isLoadBearing || 'No'}
							onChange={handleChange}
						>
							<option value='No'>No, it's just a partition</option>
							<option value='Yes'>Yes (Requires Beam/Engineer)</option>
							<option value='Unsure'>I am unsure (Need onsite check)</option>
						</select>
					</div>
					<div
						className={styles.formGroup}
						style={{ marginTop: '1rem' }}
					>
						<label className={styles.checkboxLabel}>
							<input
								type='checkbox'
								name='includeDemolition'
								checked={installation.includeDemolition || false}
								onChange={handleChange}
							/>
							Include Debris Removal & Disposal?
						</label>
					</div>
				</div>
			)}

			{/* 4. CONSTRUCTION SPECS (Hidden for Demo) */}
			{!isDemo && (
				<div className={styles.formGroupBox}>
					<div className={styles.formGroupGrid}>
						{/* Framing - Only for Wall/Partition/Room */}
						{showFraming && (
							<div className={styles.formGroup}>
								<label>Framing Status</label>
								<select
									name='framing'
									value={installation.framing}
									onChange={handleChange}
								>
									<option value='Ready'>
										Frames are ready (Just hang drywall)
									</option>
									<option value='Need Wood'>Need Wood Framing (2x4s)</option>
									<option value='Need Metal'>
										Need Metal Framing (Steel studs)
									</option>
								</select>
							</div>
						)}

						{/* Door Logic */}
						{(installation.projectType === 'Partition' ||
							installation.projectType === 'Room') && (
							<div className={styles.formGroup}>
								<label>Doors/Openings Needed?</label>
								<input
									type='number'
									name='openings'
									value={installation.openings}
									onChange={handleChange}
									placeholder='0'
									min='0'
								/>
							</div>
						)}
					</div>

					{/* Finishes - Always visible unless Demo */}
					<div
						className={styles.formGroupGrid}
						style={{ marginTop: showFraming ? '0' : '0' }}
					>
						<div className={styles.formGroup}>
							<label>Desired Finish Level</label>
							<select
								name='finishLevel'
								value={installation.finishLevel}
								onChange={handleChange}
							>
								<option value='Level 3'>Level 3 (Textured look)</option>
								<option value='Level 4'>Level 4 (Standard Smooth)</option>
								<option value='Level 5'>Level 5 (Premium Skim Coat)</option>
							</select>
						</div>
						<div className={styles.formGroup}>
							<label>Painting Service</label>
							<div
								className={styles.checkboxGroup}
								style={{ padding: '12px', justifyContent: 'flex-start' }}
							>
								<label className={styles.checkboxLabel}>
									<input
										type='checkbox'
										name='includePaint'
										checked={installation.includePaint}
										onChange={handleChange}
									/>
									Yes, Prime & Paint it
								</label>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* 5. Additional Details (GENERIC) */}
			<div className={styles.formGroupBox}>
				<div className={styles.formGroup}>
					<label style={{ display: 'flex', justifyContent: 'space-between' }}>
						<span>Additional Details</span>
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
						<Info size={16} />
						{/* UPDATED GENERIC TEXT */}
						<span>
							Is there anything else we should know about this project?
						</span>
					</div>
					<textarea
						name='additionalDetails'
						value={installation.additionalDetails || ''}
						onChange={handleChange}
						maxLength={600}
						rows={3}
						/* UPDATED GENERIC PLACEHOLDER */
						placeholder='e.g. Need to frame around some ductwork, specific soundproofing needs, or access instructions.'
					/>
					<div
						style={{
							textAlign: 'right',
							fontSize: '0.8rem',
							color: '#999',
							marginTop: '4px',
						}}
					>
						{(installation.additionalDetails || '').length} / 600
					</div>
				</div>
			</div>
		</div>
	);
};