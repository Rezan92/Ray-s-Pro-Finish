import React, { useEffect } from 'react';
import type {
	FormData,
	DrywallLevel,
	PaintLevel,
} from '@/components/common/estimator/EstimatorTypes';
import { InfoTooltip } from '@/components/common/infoTooltip/InfoTooltip';
import { AlertCircle, Check, ChevronDown } from 'lucide-react';
import './styles/GarageForm.css';

interface GarageFormProps {
	formData: FormData;
	onNestedChange: (path: 'garage', field: string, value: any) => void;
}

export const GarageForm: React.FC<GarageFormProps> = ({
	formData,
	onNestedChange,
}) => {
	const { garage } = formData;

	// --- SELF-HEALING & DEFAULTS ---
	useEffect(() => {
		if (!garage.services) {
			onNestedChange('garage', 'services', {
				insulation: false,
				drywall: false,
				painting: false,
			});
		}
		// Set default levels if missing
		if (!garage.drywallLevel)
			onNestedChange('garage', 'drywallLevel', 'Level 2');
		if (!garage.paintLevel) onNestedChange('garage', 'paintLevel', 'Standard');
	}, [garage.services, garage.drywallLevel, garage.paintLevel, onNestedChange]);

	const safeServices = garage.services || {
		insulation: false,
		drywall: false,
		painting: false,
	};

	// --- LOGIC: RESET INVALID SERVICES ---
	useEffect(() => {
		if (garage.condition === 'Finished/Bare' && safeServices.drywall) {
			handleServiceToggle('drywall'); // Disable drywall if already finished
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [garage.condition]);

	// Helpers
	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value, type } = e.target;
		const finalValue =
			type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
		onNestedChange('garage', name, finalValue);
	};

	const handleServiceToggle = (key: 'insulation' | 'drywall' | 'painting') => {
		onNestedChange('garage', 'services', {
			...safeServices,
			[key]: !safeServices[key],
		});
	};

	// FIX 1: Explicitly using DrywallLevel | PaintLevel removes the "unused type" warning
	const handleLevelChange = (
		field: 'drywallLevel' | 'paintLevel',
		value: DrywallLevel | PaintLevel
	) => {
		onNestedChange('garage', field, value);
	};

	// --- DYNAMIC LABELS ---
	const isBare = garage.condition === 'Bare Studs';
	const isFinished = garage.condition === 'Finished/Bare';

	const drywallTitle = isBare ? 'Drywall Installation' : 'Drywall Finishing';
	const drywallSubtitle = isBare ? 'Hang, Tape & Finish' : 'Tape, Mud & Sand';

	const showDrywallOption = !isFinished;
	const showInsulationOption = isBare;

	return (
		<div className='service-form-box'>
			<h3 className='service-form-title'>Garage Finishing</h3>

			{/* SECTION 1: SPECS */}
			<div className='garage-section'>
				<h4 className='garage-section-title'>1. Dimensions & Specs</h4>
				<div className='garage-grid'>
					<div className='form-group'>
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
					<div className='form-group'>
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
			<div className='garage-section'>
				<h4 className='garage-section-title'>2. Current Condition</h4>
				<div className='garage-grid'>
					<div className='form-group'>
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
					<div className='form-group'>
						{/* FIX 2: Used InfoTooltip here */}
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
			<div className='garage-section'>
				<h4 className='garage-section-title'>3. Select Services</h4>
				<div className='service-selection-list'>
					{/* A. CEILING TOGGLE */}
					<div className='garage-service-row-container'>
						<div
							className={`service-row ${garage.includeCeiling ? 'active' : ''}`}
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
							<div className='service-row-header'>
								<div className='checkbox-circle'>
									{garage.includeCeiling && <Check size={14} />}
								</div>
								<span className='service-name'>Include Ceiling</span>
							</div>
						</div>

						{/* B. INSULATION */}
						{showInsulationOption && (
							<div
								className={`service-row ${
									safeServices.insulation ? 'active' : ''
								}`}
								onClick={() => handleServiceToggle('insulation')}
							>
								<div className='service-row-header'>
									<div className='checkbox-circle'>
										{safeServices.insulation && <Check size={14} />}
									</div>
									<div>
										<span className='service-name'>Install Insulation</span>
										<span className='service-sub'>R-13 / R-19 Batts</span>
									</div>
								</div>
							</div>
						)}
					</div>

					<div className='garage-service-row-container'>
						{/* C. DRYWALL WORK */}
						{showDrywallOption && (
							<div
								className={`service-row ${
									safeServices.drywall ? 'active' : ''
								}`}
							>
								<div
									className='service-row-header'
									onClick={() => handleServiceToggle('drywall')}
								>
									<div className='checkbox-circle'>
										{safeServices.drywall && <Check size={14} />}
									</div>
									<div>
										<span className='service-name'>{drywallTitle}</span>
										<span className='service-sub'>{drywallSubtitle}</span>
									</div>
								</div>

								{safeServices.drywall && (
									<div className='service-options'>
										<label>Desired Finish Level:</label>
										<div className='select-wrapper'>
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
												className='select-icon'
												size={16}
											/>
										</div>
									</div>
								)}
							</div>
						)}

						{/* D. PAINTING */}
						<div
							className={`service-row ${safeServices.painting ? 'active' : ''}`}
						>
							<div
								className='service-row-header'
								onClick={() => handleServiceToggle('painting')}
							>
								<div className='checkbox-circle'>
									{safeServices.painting && <Check size={14} />}
								</div>
								<div>
									<span className='service-name'>Prime & Paint</span>
									<span className='service-sub'>Professional Spray/Roll</span>
								</div>
							</div>

							{safeServices.painting && (
								<div className='service-options'>
									<label>Paint Package:</label>
									<div className='select-wrapper'>
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
											className='select-icon'
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
			<div className='garage-section plain'>
				<div className='form-group'>
					<div className='garage-details-header'>
						<label>Additional Notes</label>
						<span className='char-count'>
							{((garage as any).additionalDetails || '').length}/600
						</span>
					</div>
					{/* FIX 3: Used AlertCircle here */}
					<div className='garage-helper-text'>
						<AlertCircle size={16} />
						<span>
							Example: "Need attic access door" or "Exposed pipes on North wall"
						</span>
					</div>
					<textarea
						className='garage-textarea'
						name='additionalDetails'
						value={(garage as any).additionalDetails || ''}
						onChange={handleChange}
						rows={3}
						maxLength={600}
					/>
				</div>
			</div>
		</div>
	);
};
