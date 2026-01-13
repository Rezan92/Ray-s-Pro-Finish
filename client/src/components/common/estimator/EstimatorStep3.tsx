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

					{/* CUSTOMER VIEW: Professional AI Message */}
					{!estimation.isAdmin && estimation.customerSummary && (
						<div
							className='customer-summary'
							style={{
								textAlign: 'left',
								margin: '2rem 0',
								whiteSpace: 'pre-wrap',
								lineHeight: '1.6',
								background: '#fcfcfc',
								padding: '20px',
								borderRadius: '8px',
								border: '1px solid #eee',
							}}
						>
							{estimation.customerSummary}
						</div>
					)}

					{/* ADMIN VIEW: Show Technical Table */}

					{estimation.isAdmin && estimation.breakdownItems && (
						<div
							className='breakdown-container'
							style={{ margin: '2rem 0', overflowX: 'auto' }}
						>
							<table
								className='breakdown-table'
								style={{
									width: '100%',
									borderCollapse: 'collapse',
									textAlign: 'left',
								}}
							>
								<thead>
									<tr style={{ borderBottom: '2px solid #eee' }}>
										<th style={{ padding: '10px' }}>Item / Surface</th>
										<th style={{ padding: '10px' }}>Price</th>
										<th style={{ padding: '10px' }}>Time</th>
										<th style={{ padding: '10px' }}>Details</th>
									</tr>
								</thead>
								<tbody>
									{estimation.breakdownItems.map((item, index) => (
										<tr
											key={index}
											style={{ borderBottom: '1px solid #f9f9f9' }}
										>
											<td style={{ padding: '10px', fontWeight: '500' }}>
												{item.name}
											</td>
											<td style={{ padding: '10px' }}>
												{item.cost > 0 ? `$${Math.round(item.cost)}` : '--'}
											</td>
											<td style={{ padding: '10px' }}>
												{item.hours.toFixed(1)} hrs
											</td>
											<td
												style={{
													padding: '10px',
													fontSize: '0.85rem',
													color: '#666',
												}}
											>
												{item.details}
											</td>
										</tr>
									))}
								</tbody>
								<tfoot>
									<tr
										style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold' }}
									>
										<td style={{ padding: '10px' }}>Total Project</td>
										<td style={{ padding: '10px' }}>
											${Math.round(estimation.low)}*
										</td>
										<td style={{ padding: '10px' }}>
											{estimation.totalHours.toFixed(1)} hrs
										</td>
										<td style={{ padding: '10px' }}></td>
									</tr>
								</tfoot>
							</table>
						</div>
					)}

					<p
						className='estimator-disclaimer'
						style={{ fontStyle: 'italic', marginTop: '1rem' }}
					>
						*Prices shown are estimates based on standard assumptions. The final
						price will be confirmed after a free, on-site inspection.
					</p>

					<div
						style={{
							marginTop: '2rem',
							display: 'flex',
							gap: '1rem',
							justifyContent: 'center',
						}}
					>
						<Button
							type='button'
							variant='dark'
							onClick={onBack}
							className='result-back-btn'
						>
							Go Back & Edit
						</Button>
						<Button
							to='/contact'
							variant='primary'
						>
							Book Free On-Site Quote
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};
