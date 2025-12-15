import React from 'react';
import type { FormData } from './EstimatorTypes';
import { AlertCircle } from 'lucide-react';

interface GarageFormProps {
	formData: FormData;
	onNestedChange: (path: 'garage', field: string, value: any) => void;
}

export const GarageForm: React.FC<GarageFormProps> = ({
	formData,
	onNestedChange,
}) => {
	const { garage } = formData;

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const value =
			e.target.type === 'checkbox'
				? (e.target as HTMLInputElement).checked
				: e.target.value;
		onNestedChange('garage', e.target.name, value);
	};

	return (
		<div className='service-form-box'>
			<h3 className='service-form-title'>Garage Finishing</h3>

			{/* 1. Size & Scope */}
			<div className='form-group-box'>
				<div className='form-group-grid'>
					<div className='form-group'>
						<label>Garage Size</label>
						<select
							name='capacity'
							value={garage.capacity}
							onChange={handleChange}
						>
							<option value='1-Car'>1-Car (Approx 250 sqft)</option>
							<option value='2-Car'>2-Car (Approx 450 sqft)</option>
							<option value='3-Car'>3-Car (Approx 650 sqft)</option>
							<option value='4-Car'>4-Car / Oversized (800+ sqft)</option>
						</select>
					</div>
					<div className='form-group'>
						<label>What are we finishing?</label>
						<select
							name='scope'
							value={garage.scope}
							onChange={handleChange}
						>
							<option value='Walls Only'>Walls Only</option>
							<option value='Ceiling Only'>Ceiling Only</option>
							<option value='Both'>Full Garage (Walls & Ceiling)</option>
						</select>
					</div>
				</div>
			</div>

			{/* 2. Condition & Finish */}
			<div className='form-group-box'>
				<div className='form-group-grid'>
					<div className='form-group'>
						<label>Current Condition</label>
						<select
							name='currentCondition'
							value={garage.currentCondition}
							onChange={handleChange}
						>
							<option value='Open Studs'>Open Studs (Needs Board)</option>
							<option value='Insulated (No Board)'>
								Insulated (Ready for Board)
							</option>
							<option value='Existing Drywall'>
								Drywall is up (Needs Taping)
							</option>
						</select>
					</div>
					<div className='form-group'>
						<label>Desired Finish Level</label>
						<select
							name='finishLevel'
							value={garage.finishLevel}
							onChange={handleChange}
						>
							<option value='Fire Tape (Code)'>
								Fire Tape Only (Basic/Code)
							</option>
							<option value='Level 3 (Work)'>
								Level 3 (Workshop Standard)
							</option>
							<option value='Level 4 (Smooth)'>
								Level 4 (Smooth / Paint Ready)
							</option>
						</select>
					</div>
				</div>
			</div>

			{/* 3. The Upsells */}
			<div className='form-group-box'>
				<h4
					className='room-details-title'
					style={{ fontSize: '1rem', color: '#666', marginBottom: '1rem' }}
				>
					Add-on Services
				</h4>
				<div
					className='checkbox-group horizontal wrap'
					style={{ justifyContent: 'flex-start' }}
				>
					{garage.currentCondition === 'Open Studs' && (
						<label className='checkbox-label'>
							<input
								type='checkbox'
								name='includeInsulation'
								checked={garage.includeInsulation}
								onChange={handleChange}
							/>
							Install Insulation (R-13/R-19)
						</label>
					)}
					<label className='checkbox-label'>
						<input
							type='checkbox'
							name='includePaint'
							checked={garage.includePaint}
							onChange={handleChange}
						/>
						Prime & Paint
					</label>
					<label className='checkbox-label'>
						<input
							type='checkbox'
							name='includeBaseboards'
							checked={garage.includeBaseboards}
							onChange={handleChange}
						/>
						Vinyl Baseboards
					</label>
					<label className='checkbox-label'>
						<input
							type='checkbox'
							name='includeEpoxy'
							checked={garage.includeEpoxy}
							onChange={handleChange}
						/>
						Epoxy Floor Coating
					</label>
				</div>
			</div>

			{/* 4. Additional Details (NEW) */}
			<div className='form-group-box'>
				<div className='form-group'>
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
						<AlertCircle size={16} />
						<span>
							Any high ceilings (12ft+), exposed pipes, or specific concerns?
						</span>
					</div>
					<textarea
						name='additionalDetails'
						value={garage.additionalDetails || ''}
						onChange={handleChange}
						maxLength={600}
						rows={3}
						placeholder='e.g. 14ft high ceilings, exposed conduit pipes on one wall...'
					/>
					<div
						style={{
							textAlign: 'right',
							fontSize: '0.8rem',
							color: '#999',
							marginTop: '4px',
						}}
					>
						{(garage.additionalDetails || '').length} / 600
					</div>
				</div>
			</div>
		</div>
	);
};
