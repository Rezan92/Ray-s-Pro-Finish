import React, { useEffect } from 'react';
import type { FormData } from './EstimatorTypes';
import { Ruler, Layout, Hammer } from 'lucide-react';
import { InfoTooltip } from '@/components/common/infoTooltip/InfoTooltip';
import './styles/BasementForm.css';

interface BasementFormProps {
	formData: FormData;
	onNestedChange: (path: 'basement', field: string, value: any) => void;
}

export const BasementForm: React.FC<BasementFormProps> = ({
	formData,
	onNestedChange,
}) => {
	const { basement } = formData;

	// Defaults Initialization
	useEffect(() => {
		if (!basement.services) {
			onNestedChange('basement', 'services', {
				framing: true,
				drywall: true,
				painting: true,
				ceilingFinish: 'Drywall',
			});
		}
		if (basement.numBedrooms === undefined)
			onNestedChange('basement', 'numBedrooms', 0);
		if (basement.numBathrooms === undefined)
			onNestedChange('basement', 'numBathrooms', 0);
	}, []);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value, type } = e.target;
		const finalValue = type === 'number' ? Number(value) : value;
		onNestedChange('basement', name, finalValue);
	};

	const handleServiceChange = (field: string, value: any) => {
		onNestedChange('basement', 'services', {
			...basement.services,
			[field]: value,
		});
	};

	return (
		<div className='service-form-box'>
			<h3 className='service-form-title'>Basement Finishing</h3>

			{/* SECTION 1: DIMENSIONS & CONDITION */}
			<div className='basement-section'>
				<h4 className='basement-section-title'>
					<Ruler size={18} />
					1. Dimensions & Condition
				</h4>
				<div className='basement-grid'>
					<div className='form-group'>
						<label>Project Area (Sq Ft)</label>
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
						<label>Ceiling Height</label>
						<select
							name='ceilingHeight'
							value={basement.ceilingHeight || 'Standard (8ft)'}
							onChange={handleChange}
						>
							<option value='Standard (8ft)'>Standard (8ft)</option>
							<option value='Low (<7ft)'>Low (&lt;7ft)</option>
							<option value='High (9ft+)'>High (9ft+)</option>
						</select>
					</div>
					<div className='form-group'>
						<label>Current Condition</label>
						<select
							name='condition'
							value={basement.condition || 'Bare Concrete'}
							onChange={handleChange}
						>
							<option value='Bare Concrete'>
								Bare Concrete (Needs Framing)
							</option>
							<option value='Framed'>Framed Only (Needs Insulation)</option>
							<option value='Framed & Insulated'>
								Framed & Insulated (Ready for Drywall)
							</option>
						</select>
					</div>
					<div className='form-group'>
						<label>Soffit / Ductwork Complexity</label>
						<select
							name='soffitWork'
							value={basement.soffitWork || 'Average'}
							onChange={handleChange}
						>
							<option value='Minimal'>Minimal (Clean Ceiling)</option>
							<option value='Average'>Average (Main Trunk Line)</option>
							<option value='Complex'>Complex (Many Pipes/Ducts)</option>
						</select>
					</div>
				</div>
			</div>

			{/* SECTION 2: LAYOUT */}
			<div className='basement-section'>
				<div className='basement-section-title'>
					<Layout size={18} />
					<span>2. Planned Layout</span>
					<InfoTooltip message='We use these counts to estimate interior partition walls (Framing & Drywall).' />
				</div>
				<div className='basement-grid'>
					<div className='form-group'>
						<label>Bedrooms</label>
						<select
							name='numBedrooms'
							value={basement.numBedrooms}
							onChange={handleChange}
						>
							<option value={0}>0 (Open Space)</option>
							<option value={1}>1 Bedroom</option>
							<option value={2}>2 Bedrooms</option>
							<option value={3}>3+ Bedrooms</option>
						</select>
					</div>
					<div className='form-group'>
						<label>Bathrooms</label>
						<select
							name='numBathrooms'
							value={basement.numBathrooms || 0}
							onChange={handleChange}
						>
							<option value={0}>None</option>
							<option value={1}>1 Bathroom</option>
							<option value={2}>2 Bathrooms</option>
						</select>
					</div>
					<div className='form-group'>
						<label>Wet Bar / Kitchenette</label>
						<select
							name='hasWetBar'
							value={basement.hasWetBar ? 'Yes' : 'No'}
							onChange={(e) =>
								onNestedChange(
									'basement',
									'hasWetBar',
									e.target.value === 'Yes'
								)
							}
						>
							<option value='No'>None</option>
							<option value='Yes'>Yes (Add Wall Backing)</option>
						</select>
					</div>
				</div>
			</div>

			{/* SECTION 3: SCOPE */}
			<div className='basement-section'>
				<h4 className='basement-section-title'>
					<Hammer size={18} />
					3. Scope of Work
				</h4>
				<div className='basement-grid'>
					<div className='form-group'>
						<label>Ceiling Finish</label>
						<select
							value={basement.services?.ceilingFinish || 'Drywall'}
							onChange={(e) =>
								handleServiceChange('ceilingFinish', e.target.value)
							}
						>
							<option value='Drywall'>Drywall (Smooth/Painted)</option>
							<option value='Drop Ceiling'>Drop Ceiling (Grid)</option>
							<option value='Painted/Industrial'>
								Industrial (Spray Black)
							</option>
						</select>
					</div>
					<div className='form-group'>
						<label>Moisture Protection</label>
						<select
							name='perimeterInsulation'
							value={basement.perimeterInsulation || 'Standard (Vapor Barrier)'}
							onChange={handleChange}
						>
							<option value='Standard (Vapor Barrier)'>
								Standard (Code Minimum)
							</option>
							<option value='Premium (Rigid Foam)'>
								Enhanced (Rigid Foam + Batts)
							</option>
						</select>
					</div>
				</div>
			</div>

			{/* SECTION 4: NOTES */}
			<div className='basement-section plain'>
				<div className='form-group'>
					<label>Additional Notes</label>
					<textarea
						className='basement-textarea'
						name='additionalDetails'
						value={basement.additionalDetails || ''}
						onChange={handleChange}
						rows={3}
						placeholder='Specific details about access, electrical panel location, etc...'
					/>
				</div>
			</div>
		</div>
	);
};
