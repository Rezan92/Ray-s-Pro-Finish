import React from 'react';
import { Button } from '@/components/common/button/Button';
import type { Estimate } from './EstimatorTypes';
import styles from './styles/EstimatorStep3.module.css';

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
		<div className={`${styles.estimatorStep} ${styles.resultStep}`}>
			<h2 className={styles.estimatorTitle}>Your Preliminary Estimate</h2>

			{isLoading && (
				<div className={styles.loadingSpinner}>Calculating your estimate...</div>
			)}

			{error && <div className={styles.estimatorError}>{error}</div>}

			{estimation && (
				<div className={styles.estimationResult}>
					<div className={styles.estimateDisplay}>
						${estimation.low} - ${estimation.high}
					</div>

					{/* CUSTOMER VIEW: Professional AI Message */}
					{!estimation.isAdmin && estimation.customerSummary && (
						<div className={styles.customerSummary}>
							{estimation.customerSummary}
						</div>
					)}

					{/* ADMIN VIEW: Show Technical Table */}

					{estimation.isAdmin && estimation.breakdownItems && (
						<div className={styles.breakdownContainer}>
							<table className={styles.breakdownTable}>
								<thead>
									<tr>
										<th>Item / Surface</th>
										<th>Price</th>
										<th>Time</th>
										<th>Details</th>
									</tr>
								</thead>
								<tbody>
									{estimation.breakdownItems.map((item, index) => (
										<tr key={index}>
											<td className={styles.tableItemName}>{item.name}</td>
											<td>
												{item.cost > 0 ? `$${Math.round(item.cost)}` : '--'}
											</td>
											<td>
												{/* FIX: Default to 0 if undefined to prevent crash */}
												{(item.hours || 0).toFixed(1)} hrs
											</td>
											<td className={styles.tableItemDetails}>{item.details}</td>
										</tr>
									))}
								</tbody>
								<tfoot>
									<tr className={styles.tableFooter}>
										<td>Total Project</td>
										<td>${Math.round(estimation.low)}*</td>
										<td>
											{/* FIX: Default to 0 if undefined to prevent crash */}
											{(estimation.totalHours || 0).toFixed(1)} hrs
										</td>
										<td></td>
									</tr>
								</tfoot>
							</table>
						</div>
					)}

					<p className={styles.estimatorDisclaimer}>
						*Prices shown are estimates based on standard assumptions. The final
						price will be confirmed after a free, on-site inspection.
					</p>

					<div className={styles.actionsContainer}>
						<Button
							type='button'
							variant='dark'
							onClick={onBack}
							className={styles.resultBackBtn}
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
