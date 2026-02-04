import React, { useEffect, useRef } from 'react';
import type {
	FormData,
	DrywallLevel,
	PaintLevel,
} from '@/components/common/estimator/EstimatorTypes';
import { InfoTooltip } from '@/components/common/infoTooltip/InfoTooltip';
import { AlertCircle, Check, ChevronDown } from 'lucide-react';
import styles from './styles/GarageForm.module.css';

interface GarageFormProps {
	formData: FormData;
	onFieldChange: (field: string, value: any) => void;
	onServiceToggle: (field: string, value: any) => void;
}

export const GarageForm: React.FC<GarageFormProps> = ({
	formData,
	onFieldChange,
	onServiceToggle,
}) => {
	const { garage } = formData;

	const prevConditionRef = useRef(garage.condition);

	const safeServices = garage.services || {
		insulation: false,
		drywall: false,
		painting: false,
	};

	useEffect(() => {
		if (prevConditionRef.current !== garage.condition) {
			onFieldChange('services', {
				insulation: false,
				drywall: false,
				painting: false,
			});
			prevConditionRef.current = garage.condition;
		}
	}, [garage.condition, onFieldChange]);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value, type } = e.target;
		const finalValue =
			type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
		onFieldChange(name, finalValue);
	};

	const handleServiceToggle = (key: 'insulation' | 'drywall' | 'painting') => {
		onServiceToggle(key, !safeServices[key]);
	};

	const handleLevelChange = (
		field: 'drywallLevel' | 'paintLevel',
		value: DrywallLevel | PaintLevel
	) => {
		onFieldChange(field, value);
	};

	// --- DYNAMIC LABELS ---
	const isBare = garage.condition === 'Bare Studs';
	const isFinished = garage.condition === 'Finished/Bare';

	const drywallTitle = isBare ? 'Drywall Installation' : 'Drywall Finishing';
	const drywallSubtitle = isBare ? 'Hang, Tape & Finish' : 'Tape, Mud & Sand';

	const showDrywallOption = !isFinished;
	const showInsulationOption = isBare;

	return (
		<div className={styles.serviceFormBox}>
			<h3 className={styles.serviceFormTitle}>Garage Finishing</h3>

			{/* SECTION 1: SPECS */}
			<div className={styles.garageSection}>
				<h4 className={styles.garageSectionTitle}>1. Dimensions & Specs</h4>
				<div className={styles.garageGrid}>
					<div className={styles.formGroup}>
						<label>Garage Size</label>
						<select
							name='size'
							value={garage.size}
							onChange={handleChange}
						>
							<option value='1-Car'>1-Car (12' x 22')</option>
							<option value='1.5-Car'>1.5-Car (16' x 24')</option>
							<option value='2-Car'>2-Car (20' x 24')</option>
							<option value='2.5-Car'>2.5-Car (24' x 26')</option>
							<option value='3-Car'>3-Car (32' x 24')</option>
						</select>
					</div>
					<div className={styles.formGroup}>
						<label>Ceiling Height</label>
						<select
							name='ceilingHeight'
							value={garage.ceilingHeight}
							onChange={handleChange}
						>
							<option value='Standard (8-9ft)'>Standard (8-9ft)</option>
							<option value='High (10-12ft)'>High (10-12ft)</option>
							<option value='Extra High (13ft+)'>Extra High (13ft+)</option>
						</select>
					</div>
				</div>
			</div>

			{/* SECTION 2: CONDITION */}
			<div className={styles.garageSection}>
				<h4 className={styles.garageSectionTitle}>2. Current Condition</h4>
				<div className={styles.garageGrid}>
					<div className={styles.formGroup}>
						<label>Condition</label>
						<select
							name='condition'
							value={garage.condition}
							onChange={handleChange}
						>
							<option value='Bare Studs'>Bare Studs (Open Walls)</option>
							<option value='Drywall Hung'>Drywall Hung (Needs Tape)</option>
							<option value='Taped & Rough'>Taped & Rough (Needs Paint)</option>
							<option value='Finished/Bare'>Finished/Painted (Repaint)</option>
						</select>
					</div>
					<div className={styles.formGroup}>
						<label
							style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
						>
							Occupancy
							<InfoTooltip message="We charge a flat fee for 'Pro Move' to cover labor time moving items." />
						</label>
						<select
							name='occupancy'
							value={garage.occupancy}
							onChange={handleChange}
						>
							<option value='Empty'>Empty (Best Price)</option>
							<option value='Customer Will Move'>I Will Move Items</option>
							<option value='Pro Move'>Contractor Moves Items</option>
						</select>
					</div>
				</div>
			</div>

			{/* SECTION 3: SCOPE OF WORK */}
			<div className={styles.garageSection}>
				<h4 className={styles.garageSectionTitle}>3. Select Services</h4>
				<div className={styles.serviceSelectionList}>
					{/* A. CEILING TOGGLE & INSULATION (Grouped) */}
					<div className={styles.garageServiceRowContainer}>
						<div
							className={`${styles.serviceRow} ${
								garage.includeCeiling ? styles.active : ''
							}`}
							onClick={() =>
								handleChange({
									target: {
										name: 'includeCeiling',
										type: 'checkbox',
										checked: !garage.includeCeiling,
									},
								} as any)
							}
						>
							<div className={styles.serviceRowHeader}>
								<div className={styles.checkboxCircle}>
									{garage.includeCeiling && <Check size={14} />}
								</div>
								<span className={styles.serviceName}>Include Ceiling</span>
							</div>
						</div>

						{/* B. INSULATION */}
						{showInsulationOption && (
							<div
								className={`${styles.serviceRow} ${
									safeServices.insulation ? styles.active : ''
								}`}
								onClick={() => handleServiceToggle('insulation')}
							>
								<div className={styles.serviceRowHeader}>
									<div className={styles.checkboxCircle}>
										{safeServices.insulation && <Check size={14} />}
									</div>
									<div>
										<span className={styles.serviceName}>Install Insulation</span>
										<span className={styles.serviceSub}>R-13 / R-19 Batts</span>
									</div>
								</div>
							</div>
						)}
					</div>

					<div className={styles.garageServiceRowContainer}>
						{/* C. DRYWALL WORK */}
						{showDrywallOption && (
							<div
								className={`${styles.serviceRow} ${
									safeServices.drywall ? styles.active : ''
								}`}
							>
								<div
									className={styles.serviceRowHeader}
									onClick={() => handleServiceToggle('drywall')}
								>
									<div className={styles.checkboxCircle}>
										{safeServices.drywall && <Check size={14} />}
									</div>
									<div>
										<span className={styles.serviceName}>{drywallTitle}</span>
										<span className={styles.serviceSub}>{drywallSubtitle}</span>
									</div>
								</div>

								{safeServices.drywall && (
									<div className={styles.serviceOptions}>
										<label>Desired Finish Level:</label>
										<div className={styles.selectWrapper}>
											<select
												value={garage.drywallLevel || 'Level 2'}
												onChange={(e) =>
													handleLevelChange(
														'drywallLevel',
														e.target.value as DrywallLevel
													)
												}
											>
												<option value='Level 1'>
													Level 1 (Fire Tape Only)
												</option>
												<option value='Level 2'>
													Level 2 (Garage Standard - 1 Coat)
												</option>
												<option value='Level 3'>
													Level 3 (Paint Ready - 2 Coats)
												</option>
												<option value='Level 4'>
													Level 4 (Smooth - 3 Coats)
												</option>
												<option value='Level 5'>
													Level 5 (Skim Coat - Premium)
												</option>
											</select>
											<ChevronDown
												className={styles.selectIcon}
												size={16}
											/>
										</div>
									</div>
								)}
							</div>
						)}

						{/* D. PAINTING */}
						<div
							className={`${styles.serviceRow} ${
								safeServices.painting ? styles.active : ''
							}`}
						>
							<div
								className={styles.serviceRowHeader}
								onClick={() => handleServiceToggle('painting')}
							>
								<div className={styles.checkboxCircle}>
									{safeServices.painting && <Check size={14} />}
								</div>
								<div>
									<span className={styles.serviceName}>Prime & Paint</span>
									<span className={styles.serviceSub}>
										Professional Spray/Roll
									</span>
								</div>
							</div>

							{safeServices.painting && (
								<div className={styles.serviceOptions}>
									<label>Paint Package:</label>
									<div className={styles.selectWrapper}>
										<select
											value={garage.paintLevel || 'Standard'}
											onChange={(e) =>
												handleLevelChange(
													'paintLevel',
													e.target.value as PaintLevel
												)
											}
										>
											<option value='Primer'>Primer Only (Seal Walls)</option>
											<option value='1-Coat'>
												1-Coat Refresh (Existing Walls)
											</option>
											<option value='Standard'>Standard (2 Coats Total)</option>
											<option value='Premium'>Premium (Prime + 2 Coats)</option>
										</select>
										<ChevronDown
											className={styles.selectIcon}
											size={16}
										/>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* SECTION 4: DETAILS */}
			<div className={`${styles.garageSection} ${styles.plain}`}>
				<div className={styles.formGroup}>
					<div className={styles.garageDetailsHeader}>
						<label>Additional Notes</label>
						<span className={styles.garageCharCount}>
							{(garage.additionalDetails || '').length}/600
						</span>
					</div>
					<div className={styles.garageHelperText}>
						<AlertCircle size={16} />
						<span>
							Example: "Need attic access door" or "Exposed pipes on North wall"
						</span>
					</div>
					<textarea
						className={styles.garageTextarea}
						name='additionalDetails'
						value={garage.additionalDetails || ''}
						onChange={handleChange}
						rows={3}
						maxLength={600}
					/>
				</div>
			</div>
		</div>
	);
};