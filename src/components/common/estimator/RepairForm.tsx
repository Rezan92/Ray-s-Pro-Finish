import React from 'react';
import type { FormData } from './EstimatorTypes';

interface RepairFormProps {
	formData: FormData;
	onNestedChange: (
		path: 'patching',
		field: string,
		value: any,
	) => void;
}

export const RepairForm: React.FC<RepairFormProps> = ({
	formData,
	onNestedChange,
}) => {
	const { patching } = formData;

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		onNestedChange('patching', e.target.name, e.target.value);
	};

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value, checked } = e.target;
		const currentLocation = formData.patching.location;
		onNestedChange(
			'patching',
			'location',
			checked
				? [...currentLocation, value]
				: currentLocation.filter((item) => item !== value),
		);
	};

	return (
		<div className='service-form-box'>
			<h3 className='service-form-title'>Drywall Patching</h3>
			<div className='form-group-grid'>
				<div className='form-group'>
					<label>How many patches?</label>
					<select
						name='quantity'
						value={patching.quantity}
						onChange={handleChange}
					>
						<option value='1-3'>1-3</option>
						<option value='4-6'>4-6</option>
						<option value='7+'>7+</option>
					</select>
				</div>
				<div className='form-group'>
					<label>Where are they?</label>
					<div className='checkbox-group horizontal'>
						<label className='checkbox-label'>
							<input
								type='checkbox'
								value='Wall'
								checked={patching.location.includes('Wall')}
								onChange={handleCheckboxChange}
							/>
							Wall
						</label>
						<label className='checkbox-label'>
							<input
								type='checkbox'
								value='Ceiling'
								checked={patching.location.includes('Ceiling')}
								onChange={handleCheckboxChange}
							/>
							Ceiling
						</label>
					</div>
				</div>
			</div>
			<div className='form-group'>
				<label>Size of largest patch?</label>
				<select
					name='largest_size'
					value={patching.largest_size}
					onChange={handleChange}
				>
					<option value='Nail pops'>Nail pops only</option>
					<option value='Fist-sized'>Fist-sized (under 6")</option>
					<option value='Dinner-plate-sized'>
						Dinner-plate-sized (6"-12")
					</option>
					<option value='1-2 feet'>1-2 feet</option>
					<option value='Larger'>Larger</option>
				</select>
			</div>
			<div className='form-group'>
				<label>Wall Texture</label>
				<select
					name='texture'
					value={patching.texture}
					onChange={handleChange}
				>
					<option value="I don't know">I don't know</option>
					<option value='Smooth'>Smooth</option>
					<option value='Popcorn'>Popcorn</option>
					<option value='Orange Peel/Knockdown'>Orange Peel/Knockdown</option>
				</select>
			</div>
			<div className='form-group'>
				<label>Scope</label>
				<select
					name='scope'
					value={patching.scope}
					onChange={handleChange}
				>
					<option value='Patch only'>
						Just patch (ready for me to prime/paint)
					</option>
					<option value='Patch & Paint (Customer Paint)'>
						Patch, prime, and paint (I provide paint)
					</option>
					<option value='Patch & Paint (Contractor Paint)'>
						Patch, prime, and paint (you provide match)
					</option>
				</select>
			</div>
			<div className='form-group'>
				<label>Photo Upload (Required)</label>
				<div className='upload-placeholder'>
					[File Upload Component Here]
					<p>
						Please upload: 1) A close-up of each patch. 2) A photo from 2ft
						away to show texture.
					</p>
				</div>
			</div>
		</div>
	);
};