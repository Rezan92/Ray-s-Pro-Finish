import React from 'react';
import { Button } from '@/components/common/button/Button';
import type { Estimate } from './EstimatorTypes';

interface EstimatorStep3Props {
	estimation: Estimate | null;
	isLoading: boolean;
	error: string | null;
	onBack: () => void;
}

export const EstimatorStep3: React.FC<EstimatorStep3Props> = ({
	estimation,
	isLoading,
	error,
	onBack,
}) => {
	return (
		<div className='estimator-step result-step'>
			<h2 className='estimator-title'>Your Preliminary Estimate</h2>
			{isLoading && (
				<div className='loading-spinner'>Calculating your estimate...</div>
			)}
			{error && <div className='estimator-error'>{error}</div>}
			{estimation && (
				<div className='estimation-result'>
					<div className='estimate-display'>
						${estimation.low} - ${estimation.high}
					</div>
					<p className='estimate-explanation'>{estimation.explanation}</p>
					<p className='estimator-disclaimer'>
						**This is a preliminary estimate.** Prices are based on standard
						assumptions. The final price will be confirmed after a free,
						on-site inspection.
					</p>
					<Button
						to='/contact'
						variant='primary'
					>
						Book Your Free On-Site Quote
					</Button>
				</div>
			)}
			<Button
				type='button'
				variant='dark'
				onClick={onBack}
				className='result-back-btn'
			>
				Go Back & Edit
			</Button>
		</div>
	);
};