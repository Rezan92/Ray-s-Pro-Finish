import React from 'react';
import type { FormData } from './EstimatorTypes';
import { AlertTriangle, Info } from 'lucide-react';

interface BasementFormProps {
	formData: FormData;
	onNestedChange: (path: 'basement', field: string, value: any) => void;
}

export const BasementForm: React.FC<BasementFormProps> = ({
	formData,
	onNestedChange,
}) => {
	const { basement } = formData;

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		onNestedChange('basement', e.target.name, e.target.value);
	};

	const hasBedrooms = basement.numBedrooms !== '0';
	const hasBathroom = basement.bathroom !== 'None';

	return (
		<div className='service-form-box'>
			<h3 className='service-form-title'>Basement Finishing</h3>

			{/* Phase 1: Space & Layout */}
			<div className='form-group-box'>
				<h4
					className='room-details-title'
					style={{ fontSize: '1rem', color: '#666', marginBottom: '1rem' }}
				>
					Space & Layout
				</h4>
				<div className='form-group-grid'>
					<div className='form-group'>
						<label>Total Area (Sq Ft)</label>
						<input
							type='number'
							name='sqft'
							value={basement.sqft}
							onChange={handleChange}
							placeholder='e.g. 800'
							min='0'
						/>
					</div>
					<div className='form-group'>
						<label>Current Condition</label>
						<select
							name='currentCondition'
							value={basement.currentCondition}
							onChange={handleChange}
						>
							<option value='Bare Concrete'>Bare Concrete (Unfinished)</option>
							<option value='Framed'>Framed & Insulated</option>
							<option value='Partially Finished'>
								Partially Finished (Remodel)
							</option>
						</select>
					</div>
				</div>

				<div
					className='form-group-grid'
					style={{ marginTop: '1rem' }}
				>
					<div className='form-group'>
						<label>Number of Bedrooms</label>
						<select
							name='numBedrooms'
							value={basement.numBedrooms}
							onChange={handleChange}
						>
							<option value='0'>None (Open Layout)</option>
							<option value='1'>1 Bedroom</option>
							<option value='2'>2 Bedrooms</option>
							<option value='3+'>3+ Bedrooms</option>
						</select>
					</div>
					<div className='form-group'>
						<label>Ceiling Height</label>
						<select
							name='ceilingHeight'
							value={basement.ceilingHeight}
							onChange={handleChange}
						>
							<option value='Standard'>Standard (8ft)</option>
							<option value='Low (<7ft)'>Low (Under 7ft - Ductwork)</option>
							<option value='High (9ft+)'>High (9ft+)</option>
						</select>
					</div>
				</div>

				{/* CONDITIONAL: Egress Window Logic */}
				{hasBedrooms && (
					<div
						className='conditional-field'
						style={{
							marginTop: '1rem',
							backgroundColor: '#fff8f0',
							padding: '1rem',
							borderLeft: '4px solid orange',
						}}
					>
						<div className='form-group'>
							<label
								style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
							>
								<AlertTriangle
									size={18}
									color='orange'
								/>
								Egress Window (Code Requirement)
							</label>
							<p
								style={{
									fontSize: '0.85rem',
									color: '#666',
									margin: '4px 0 8px',
								}}
							>
								Bedrooms require a fire escape window. Do you already have one?
							</p>
							<select
								name='egressWindow'
								value={basement.egressWindow}
								onChange={handleChange}
							>
								<option value='Existing/Code Compliant'>
									Yes, I have an egress window
								</option>
								<option value='Need to Install (Cut Foundation)'>
									No, need to install one (Cut Concrete)
								</option>
							</select>
						</div>
					</div>
				)}
			</div>

			{/* Phase 2: Plumbing */}
			<div className='form-group-box'>
				<h4
					className='room-details-title'
					style={{ fontSize: '1rem', color: '#666', marginBottom: '1rem' }}
				>
					Plumbing & Wet Areas
				</h4>
				<div className='form-group-grid'>
					<div className='form-group'>
						<label>Bathroom Requirement</label>
						<select
							name='bathroom'
							value={basement.bathroom}
							onChange={handleChange}
						>
							<option value='None'>None</option>
							<option value='Half Bath'>Half Bath (Toilet/Sink)</option>
							<option value='Full Bath'>Full Bath (Shower/Tub)</option>
						</select>
					</div>

					{/* LAYOUT FIX: Moved Kitchen/Wet Bar inside the grid so it sits next to Bathroom on desktop */}
					<div className='form-group'>
						<label>Kitchen / Wet Bar</label>
						<select
							name='wetBar'
							value={basement.wetBar}
							onChange={handleChange}
						>
							<option value='None'>None</option>
							<option value='Wet Bar'>Wet Bar (Sink/Fridge area)</option>
							<option value='Kitchenette'>
								Kitchenette (Cabinets/Sink/Appliance)
							</option>
						</select>
					</div>

					{/* Rough In Conditional - Stays in grid flow */}
					{hasBathroom && (
						<div className='form-group'>
							<label>Is Plumbing Roughed-in?</label>
							<select
								name='plumbingRoughIn'
								value={basement.plumbingRoughIn}
								onChange={handleChange}
							>
								<option value='Yes, pipes visible'>
									Yes, pipes are visible in floor
								</option>
								<option value='No, need concrete work'>
									No, need to break concrete
								</option>
							</select>
						</div>
					)}
				</div>
			</div>

			{/* Phase 3: Systems & Finishes */}
			<div className='form-group-box'>
				<h4
					className='room-details-title'
					style={{ fontSize: '1rem', color: '#666', marginBottom: '1rem' }}
				>
					Systems & Finishes
				</h4>

				{/* NEW: Systems Section (HVAC/Stairs) */}
				<div
					className='form-group-grid'
					style={{ marginBottom: '1rem' }}
				>
					<div className='form-group'>
						<label>Staircase Finishing</label>
						<select
							name='stairs'
							value={basement.stairs}
							onChange={handleChange}
						>
							<option value='Already Finished / No Change'>
								Already Finished / No Change
							</option>
							<option value='Carpet'>Install Carpet</option>
							<option value='Wood / Vinyl Caps'>
								Install Hardwood/Vinyl Caps
							</option>
						</select>
					</div>
					<div className='form-group'>
						<label>HVAC / Heating</label>
						<select
							name='hvac'
							value={basement.hvac}
							onChange={handleChange}
						>
							<option value='Existing Vents Sufficient'>
								Existing Vents Sufficient
							</option>
							<option value='Extend Ductwork'>Extend/Move Ductwork</option>
							<option value='Install Mini-Split'>
								Install Mini-Split System
							</option>
						</select>
					</div>
				</div>

				{/* Existing Finishes */}
				<div className='form-group-grid'>
					<div className='form-group'>
						<label>Ceiling Style</label>
						<select
							name='ceilingType'
							value={basement.ceilingType}
							onChange={handleChange}
						>
							<option value='Drywall'>Drywall (Smooth/Painted)</option>
							<option value='Drop Ceiling'>Drop Ceiling (Grid)</option>
							<option value='Industrial (Black)'>
								Industrial (Black Spray)
							</option>
						</select>
					</div>
					<div className='form-group'>
						<label>Flooring Preference</label>
						<select
							name='flooring'
							value={basement.flooring}
							onChange={handleChange}
						>
							<option value='LVP'>LVP (Luxury Vinyl Plank)</option>
							<option value='Carpet'>Carpet</option>
							<option value='Tile'>Tile</option>
							<option value='None'>Client will handle flooring</option>
						</select>
					</div>
				</div>
				<div
					className='form-group'
					style={{ marginTop: '1rem' }}
				>
					<label>Electrical Scope</label>
					<select
						name='electrical'
						value={basement.electrical}
						onChange={handleChange}
					>
						<option value='Standard'>Standard (Code Minimum)</option>
						<option value='Upgraded (Cans)'>
							Upgraded (Recessed Lighting/Dimmers)
						</option>
					</select>
				</div>
			</div>

			{/* Phase 4: Additional Details */}
			<div className='form-group-box'>
				<div className='form-group'>
					<label style={{ display: 'flex', justifyContent: 'space-between' }}>
						<span>Additional Details / GC Notes</span>
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
						<span>
							Mention sump pumps, ejector pumps, permits, or specific design
							ideas.
						</span>
					</div>
					<textarea
						name='additionalDetails'
						value={basement.additionalDetails || ''}
						onChange={handleChange}
						maxLength={600}
						rows={3}
						placeholder='e.g. Sump pump needs boxing in, need to move HVAC duct...'
					/>
					<div
						style={{
							textAlign: 'right',
							fontSize: '0.8rem',
							color: '#999',
							marginTop: '4px',
						}}
					>
						{(basement.additionalDetails || '').length} / 600
					</div>
				</div>
			</div>
		</div>
	);
};
