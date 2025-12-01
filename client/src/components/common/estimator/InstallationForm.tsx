import React from 'react';
import type { FormData } from './EstimatorTypes';

// ... (Interface is the same) ...
interface InstallationFormProps {
	formData: FormData;
	onNestedChange: (path: 'installation', field: string, value: any) => void;
}

export const InstallationForm: React.FC<InstallationFormProps> = ({
	formData,
	onNestedChange,
}) => {
	const { installation } = formData;

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		onNestedChange('installation', e.target.name, e.target.value);
	};

	return (
		<div className='service-form-box'>
			<h3 className='service-form-title'>Drywall Installation</h3>

			<div className='form-group-box'>
				<div className='form-group'>
					<label>What is this for?</label>
					<select
						name='project_type'
						value={installation.project_type}
						onChange={handleChange}
					>
						<option value='New construction'>New construction</option>
						<option value='Basement finish'>Basement finish</option>
						<option value='Remodel'>Remodel (demo required)</option>
					</select>
				</div>
			</div>

			<div className='form-group-box'>
				<div className='form-group-grid'>
					<div className='form-group'>
						<label>Total Room Sq Ft (L x W)</label>
						<input
							type='text'
							name='sqft'
							value={installation.sqft}
							onChange={handleChange}
							placeholder='e.g., 400'
						/>
					</div>
					<div className='form-group'>
						<label>Ceiling Height</label>
						<input
							type='text'
							name='ceilingHeight'
							value={installation.ceilingHeight}
							onChange={handleChange}
							placeholder='e.g., 8 ft'
						/>
					</div>
				</div>
			</div>

			<div className='form-group-box'>
				<div className='form-group'>
					<label>Scope of Work</label>
					<select
						name='scope'
						value={installation.scope}
						onChange={handleChange}
					>
						<option value='Hang, tape, finish'>Hang, tape, and finish</option>
						<option value='Tape and finish only'>
							Tape and finish only (board is up)
						</option>
						<option value='Hanging only'>Hanging only</option>
					</select>
				</div>
			</div>

			<div className='form-group-box'>
				<div className='form-group'>
					<label>Desired Finish</label>
					<select
						name='finish'
						value={installation.finish}
						onChange={handleChange}
					>
						<option value='Level 3'>Level 3 (Garage)</option>
						<option value='Level 4'>Level 4 (Standard Home)</option>
						<option value='Level 5'>Level 5 (Perfectly Smooth)</option>
					</select>
				</div>
			</div>

			{/* --- Photo Upload Section is REMOVED --- */}
		</div>
	);
};
