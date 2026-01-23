import React, { useEffect } from 'react';
import type {
	FormData,
	GarageData,
} from '@/components/common/estimator/EstimatorTypes';
import { InfoTooltip } from '@/components/common/infoTooltip/InfoTooltip';
import { AlertCircle } from 'lucide-react';
import './styles/GarageForm.css'; // Importing the new separate styles

interface GarageFormProps {
	formData: FormData;
	onNestedChange: (path: 'garage', field: string, value: any) => void;
}

export const GarageForm: React.FC<GarageFormProps> = ({
	formData,
	onNestedChange,
}) => {
	const { garage } = formData;

	// --- SELF-HEALING STATE FIX ---
	useEffect(() => {
		if (!garage.services) {
			onNestedChange('garage', 'services', {
				insulation: false,
				hanging: false,
				taping: false,
				painting: false,
			});
		}
	}, [garage.services, onNestedChange]);

	const safeServices = garage.services || {
		insulation: false,
		hanging: false,
		taping: false,
		painting: false,
	};

	// --- LOGIC: RESET INVALID SERVICES ON CONDITION CHANGE ---
	useEffect(() => {
		const s = { ...safeServices };
		let hasChanges = false;

		// Condition Rules
		if (garage.condition === 'Drywall Hung' && (s.hanging || s.insulation)) {
			s.hanging = false;
			s.insulation = false;
			hasChanges = true;
		}
		if (
			garage.condition === 'Taped & Rough' &&
			(s.hanging || s.insulation || s.taping)
		) {
			s.hanging = false;
			s.insulation = false;
			s.taping = false;
			hasChanges = true;
		}
		if (
			garage.condition === 'Finished/Bare' &&
			(s.hanging || s.insulation || s.taping)
		) {
			s.hanging = false;
			s.insulation = false;
			s.taping = false;
			hasChanges = true;
		}

		if (hasChanges) {
			onNestedChange('garage', 'services', s);
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

	const handleServiceToggle = (serviceKey: keyof GarageData['services']) => {
		const updatedServices = {
			...safeServices,
			[serviceKey]: !safeServices[serviceKey],
		};
		onNestedChange('garage', 'services', updatedServices);
	};

	// Visibility Logic
	const isFinished = garage.condition === 'Finished/Bare';
	const isHung = garage.condition === 'Drywall Hung';
	const isTaped = garage.condition === 'Taped & Rough';

	const showInsulation = !isFinished && !isHung && !isTaped;
	const showHanging = !isFinished && !isHung && !isTaped;
	const showTaping = !isFinished && !isTaped;
	const showPainting = true;

	return (
		<div className='service-form-box'>
			<h3 className='service-form-title'>Garage Finishing</h3>

			{/* SECTION 1: DIMENSIONS */}
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
				<h4 className='garage-section-title'>2. Condition & Occupancy</h4>
				<div className='garage-grid'>
					<div className='form-group'>
						<label>Current Condition</label>
						<select
							name='condition'
							value={garage.condition}
							onChange={handleChange}
						>
							<option value='Bare Studs'>Bare Studs (Needs Everything)</option>
							<option value='Drywall Hung'>Drywall Hung (Needs Tape)</option>
							<option value='Taped & Rough'>Taped & Rough (Needs Paint)</option>
							<option value='Finished/Bare'>Finished/Bare (Paint Only)</option>
						</select>
					</div>
					<div className='form-group'>
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
							<option value='Empty'>Empty (Ready to work)</option>
							<option value='Customer Will Move'>I will move items</option>
							<option value='Pro Move'>Contractor to move items</option>
						</select>
					</div>
				</div>
			</div>

			{/* SECTION 3: SCOPE (Pills) */}
			<div className='garage-section'>
				<h4 className='garage-section-title'>3. Scope of Work</h4>

				<div className='service-pills-container'>
					{/* Ceiling Toggle */}
					<label
						className={`service-pill ${garage.includeCeiling ? 'active' : ''}`}
					>
						<input
							type='checkbox'
							name='includeCeiling'
							checked={garage.includeCeiling}
							onChange={handleChange}
						/>
						Include Ceiling
					</label>

					{showInsulation && (
						<label
							className={`service-pill ${
								safeServices.insulation ? 'active' : ''
							}`}
						>
							<input
								type='checkbox'
								checked={safeServices.insulation}
								onChange={() => handleServiceToggle('insulation')}
							/>
							Install Insulation
						</label>
					)}

					{showHanging && (
						<label
							className={`service-pill ${safeServices.hanging ? 'active' : ''}`}
						>
							<input
								type='checkbox'
								checked={safeServices.hanging}
								onChange={() => handleServiceToggle('hanging')}
							/>
							Hang Drywall
						</label>
					)}

					{showTaping && (
						<label
							className={`service-pill ${safeServices.taping ? 'active' : ''}`}
						>
							<input
								type='checkbox'
								checked={safeServices.taping}
								onChange={() => handleServiceToggle('taping')}
							/>
							Tape & Finish
						</label>
					)}

					{showPainting && (
						<label
							className={`service-pill ${
								safeServices.painting ? 'active' : ''
							}`}
						>
							<input
								type='checkbox'
								checked={safeServices.painting}
								onChange={() => handleServiceToggle('painting')}
							/>
							Prime & Paint
						</label>
					)}
				</div>
			</div>

			{/* SECTION 4: DETAILS */}
			<div
				className='garage-section'
				style={{ border: 'none', background: 'transparent', padding: 0 }}
			>
				<div className='form-group'>
					<div className='garage-details-header'>
						<label>Additional Details</label>
						<span
							style={{
								fontWeight: 'normal',
								fontSize: '0.8rem',
								color: '#666',
							}}
						>
							Max 600 chars
						</span>
					</div>
					<div className='garage-helper-text'>
						<AlertCircle size={16} />
						<span>
							Example: "Exposed pipes on north wall" or "Need attic access door"
						</span>
					</div>
					<textarea
						className='garage-textarea'
						name='additionalDetails'
						value={(garage as any).additionalDetails || ''}
						onChange={handleChange}
						maxLength={600}
						rows={3}
					/>
					<div className='garage-char-count'>
						{((garage as any).additionalDetails || '').length} / 600
					</div>
				</div>
			</div>
		</div>
	);
};
