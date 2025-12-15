import React from 'react';
import type { FormData } from './EstimatorTypes';

interface EstimatorStep1Props {
	services: FormData['services'];
	handleServiceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const EstimatorStep1: React.FC<EstimatorStep1Props> = ({
	services,
	handleServiceChange,
}) => {
	return (
		<div className='estimator-step'>
			<h2 className='estimator-title'>What services do you need?</h2>
			<p className='estimator-subtitle'>
				Check all that apply. You can get an estimate for multiple services at
				once.
			</p>
			<div className='form-group'>
				<div className='checkbox-group'>
					<label className='checkbox-label large'>
						<input
							type='checkbox'
							name='painting'
							checked={services.painting}
							onChange={handleServiceChange}
						/>
						Interior Painting
					</label>
					<label className='checkbox-label large'>
						<input
							type='checkbox'
							name='patching'
							checked={services.patching}
							onChange={handleServiceChange}
						/>
						Drywall Patching
					</label>
					<label className='checkbox-label large'>
						<input
							type='checkbox'
							name='installation'
							checked={services.installation}
							onChange={handleServiceChange}
						/>
						Drywall Installation
					</label>
					<label className='checkbox-label large'>
						<input
							type='checkbox'
							name='garage'
							checked={services.garage}
							onChange={handleServiceChange}
						/>
						Garage Finishing
					</label>

					<label className='checkbox-label large'>
						<input
							type='checkbox'
							name='basement'
							checked={services.basement}
							onChange={handleServiceChange}
						/>
						Basement Finishing
					</label>
				</div>
			</div>
		</div>
	);
};
