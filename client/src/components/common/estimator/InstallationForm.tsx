import React from 'react';
import type { FormData } from './EstimatorTypes';

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
		const value =
			e.target.type === 'checkbox'
				? (e.target as HTMLInputElement).checked
				: e.target.value;
		onNestedChange('installation', e.target.name, value);
	};

	return (
		<div className='service-form-box'>
			<h3 className='service-form-title'>Drywall Installation</h3>

			{/* 1. Project Type Selector */}
			<div className='form-group-box'>
				<div className='form-group'>
					<label>What are we building?</label>
					<select
						name='projectType'
						value={installation.projectType}
						onChange={handleChange}
					>
						<option value='Wall'>Adding a New Wall</option>
						<option value='Ceiling'>
							Ceiling Overlay (Cover Popcorn/Damage)
						</option>
						<option value='Room'>New Room / Addition</option>
					</select>
				</div>
			</div>

			{/* 2. Dynamic Dimensions */}
			<div className='form-group-box'>
				<div className='form-group-grid'>
					{/* Logic for WALLS */}
					{installation.projectType === 'Wall' && (
						<>
							<div className='form-group'>
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
							<div className='form-group'>
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

					{/* Logic for CEILING OVERLAYS */}
					{installation.projectType === 'Ceiling' && (
						<>
							<div className='form-group'>
								<label>Total Ceiling Area (Sq Ft)</label>
								<input
									type='number'
									name='roomSqft'
									value={installation.roomSqft}
									onChange={handleChange}
									placeholder='e.g. 250'
									min='0'
								/>
							</div>
							<div className='form-group'>
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

					{/* Logic for ROOM ADDITIONS */}
					{installation.projectType === 'Room' && (
						<>
							<div className='form-group'>
								<label>Floor Area (Sq Ft)</label>
								<input
									type='number'
									name='roomSqft'
									value={installation.roomSqft}
									onChange={handleChange}
									placeholder='e.g. 150'
									min='0'
								/>
							</div>
							<div className='form-group'>
								<label>Doors & Windows?</label>
								<input
									type='number'
									name='openings'
									value={installation.openings}
									onChange={handleChange}
									placeholder='Count (e.g. 2)'
									min='0'
								/>
								<small style={{ color: '#666' }}>
									Total number of openings to frame around
								</small>
							</div>
						</>
					)}
				</div>
			</div>

			{/* 3. Framing & Prep */}
			<div className='form-group-box'>
				<div className='form-group-grid'>
					<div className='form-group'>
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
				</div>
			</div>

			{/* 4. Finish & Paint */}
			<div className='form-group-box'>
				<div className='form-group-grid'>
					<div className='form-group'>
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
					<div className='form-group'>
						<label>Painting Service</label>
						<div
							className='checkbox-group'
							style={{ padding: '12px', justifyContent: 'flex-start' }}
						>
							<label className='checkbox-label'>
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
		</div>
	);
};
