import React, { useEffect } from 'react';
import { PageHeader } from '@/components/common/pageHeader/PageHeader';
import { Button } from '@/components/common/button/Button';
import styles from './EstimatorPage.module.css';

// Redux Hooks
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
	toggleService,
	updateNestedForm,
	generateEstimate,
	addRepair,
	updateRepair,
	removeRepair,
} from '@/store/slices/estimatorSlice';
import { setEstimatorStep } from '@/store/slices/uiSlice';
import { updateContact } from '@/store/slices/projectSlice';
import {
	toggleRoomType,
	addRoom,
	removeRoom,
	updateRoomField,
	updatePaintingGlobal,
} from '@/store/slices/paintingSlice';
import {
	updateBasementField,
	updateBasementService,
} from '@/store/slices/basementSlice';
import {
	updateGarageField,
	updateGarageService,
} from '@/store/slices/garageSlice';
import {
	addRepair,
	updateRepair,
	removeRepair,
	updateRepairField,
} from '@/store/slices/repairSlice';
import { updateInstallationField } from '@/store/slices/installationSlice';

// Components
import { EstimatorStep1 } from '@/components/common/estimator/EstimatorStep1';
import { EstimatorStep2 } from '@/components/common/estimator/EstimatorStep2';
import { EstimatorStep3 } from '@/components/common/estimator/EstimatorStep3';

const EstimatorProgressBar: React.FC<{ currentStep: number }> = ({
	currentStep,
}) => {
	const steps = ['Services', 'Details', 'Contact', 'Estimate'];
	return (
		<div className={styles.estimatorProgressBar}>
			{steps.map((label, index) => {
				const stepNum = index + 1;
				let status = '';
				if (stepNum < currentStep) status = 'completed';
				if (stepNum === currentStep) status = 'active';
				return (
					<div
						key={label}
						className={`${styles.stepItem} ${styles[status]}`}
					>
						{label}
					</div>
				);
			})}
		</div>
	);
};

const EstimatorStepContact: React.FC<{ contact: any }> = ({ contact }) => {
	const dispatch = useAppDispatch();
	return (
		<div className={styles.estimatorStep}>
			<h2 className={styles.estimatorTitle}>Your Information</h2>
			<p className={styles.estimatorSubtitle}>
				One last step. Please provide your contact info to see your instant
				estimate.
			</p>
			<div className={styles.formGroupGrid}>
				<div className={styles.formGroup}>
					<label htmlFor='name'>Full Name*</label>
					<input
						type='text'
						id='name'
						name='name'
						required
						value={contact.name}
						onChange={(e) =>
							dispatch(updateContact({ field: 'name', value: e.target.value }))
						}
					/>
				</div>
				<div className={styles.formGroup}>
					<label htmlFor='email'>Email*</label>
					<input
						type='email'
						id='email'
						name='email'
						required
						value={contact.email}
						onChange={(e) =>
							dispatch(updateContact({ field: 'email', value: e.target.value }))
						}
					/>
				</div>
			</div>
			<div className={styles.formGroup}>
				<label htmlFor='phone'>Phone</label>
				<input
					type='tel'
					id='phone'
					name='phone'
					value={contact.phone}
					onChange={(e) =>
						dispatch(updateContact({ field: 'phone', value: e.target.value }))
					}
				/>
			</div>
			<p className={styles.formHint}>
				We'll use this to email you a copy of your estimate.
			</p>
		</div>
	);
};

const EstimatorPage = () => {
	const dispatch = useAppDispatch();
	const { formData, estimate, status, error } = useAppSelector(
		(state) => state.estimator
	);
	const step = useAppSelector((state) => state.ui.estimator.currentStep);
	const contact = useAppSelector((state) => state.project.contact);
	const paintingData = useAppSelector((state) => state.painting);
	const basementData = useAppSelector((state) => state.basement);
	const garageData = useAppSelector((state) => state.garage);
	const repairData = useAppSelector((state) => state.repair);
	const installationData = useAppSelector((state) => state.installation);

	const isLoading = status === 'loading';

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [step]);

	const handleNext = () => dispatch(setEstimatorStep(step + 1));
	const handleBack = () => dispatch(setEstimatorStep(step - 1));

	const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const name = e.target.name as keyof typeof formData.services;
		dispatch(toggleService({ name, checked: e.target.checked }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const params = new URLSearchParams(window.location.search);
		const adminKey = params.get('admin') || '';

		// Merge data for submission
		const mergedFormData = {
			...formData,
			painting: paintingData,
			basement: basementData,
			garage: garageData,
			patching: repairData,
			installation: installationData,
			contact: contact,
		};

		dispatch(generateEstimate({ formData: mergedFormData, adminKey }));
	};

	const isStep1Complete = Object.values(formData.services).some(Boolean);

	return (
		<div className={styles.estimatorPageWrapper}>
			<PageHeader title='Instant Estimator' />
			<div className={styles.estimatorContainer}>
				<EstimatorProgressBar currentStep={step} />

				<form onSubmit={handleSubmit}>
					{step === 1 && (
						<>
							<EstimatorStep1
								services={formData.services}
								handleServiceChange={handleServiceChange}
							/>
							{isStep1Complete && (
								<div className={styles.estimatorActions}>
									<Button
										type='button'
										variant='primary'
										onClick={handleNext}
										className={styles.estimatorSubmitBtn}
									>
										Next: Project Details
									</Button>
								</div>
							)}
						</>
					)}

					{step === 2 && (
						<>
							<EstimatorStep2
								formData={{
									...formData,
									painting: paintingData,
									basement: basementData,
									garage: garageData,
									patching: repairData,
									installation: installationData,
								}}
								// Painting Handlers
								onPaintingRoomTypeToggle={(type, isChecked) =>
									dispatch(toggleRoomType({ type, isChecked }))
								}
								onPaintingRoomAdd={(type) => dispatch(addRoom(type))}
								onPaintingRoomRemove={(id) => dispatch(removeRoom(id))}
								onPaintingRoomChange={(roomId, field, value) =>
									dispatch(updateRoomField({ roomId, field, value }))
								}
								onPaintingGlobalChange={(field, value) =>
									dispatch(updatePaintingGlobal({ field, value }))
								}
								// Basement Handlers
								onBasementFieldChange={(field, value) =>
									dispatch(updateBasementField({ field: field as any, value }))
								}
								onBasementServiceChange={(field, value) =>
									dispatch(updateBasementService({ field: field as any, value }))
								}
								// Garage Handlers
								onGarageFieldChange={(field, value) =>
									dispatch(updateGarageField({ field: field as any, value }))
								}
								onGarageServiceChange={(field, value) =>
									dispatch(updateGarageService({ field: field as any, value }))
								}
								// Repair Handlers
								onAddRepair={(repair) => dispatch(addRepair(repair))}
								onUpdateRepair={(repair) => dispatch(updateRepair(repair))}
								onRemoveRepair={(id) => dispatch(removeRepair(id))}
								onRepairFieldChange={(field, value) =>
									dispatch(updateRepairField({ field: field as any, value }))
								}
								// Installation Handlers
								onInstallationFieldChange={(field, value) =>
									dispatch(
										updateInstallationField({ field: field as any, value })
									)
								}
							/>
							<div className={`${styles.estimatorActions} ${styles.spaceBetween}`}>
								<Button
									type='button'
									variant='dark'
									onClick={handleBack}
									className={styles.resultBackBtn}
								>
									Back
								</Button>
								<Button
									type='button'
									variant='primary'
									onClick={handleNext}
								>
									Next: Your Info
								</Button>
							</div>
						</>
					)}

					{step === 3 && (
						<>
							<EstimatorStepContact contact={contact} />
							<div className={`${styles.estimatorActions} ${styles.spaceBetween}`}>
								<Button
									type='button'
									variant='dark'
									onClick={handleBack}
									className={styles.resultBackBtn}
								>
									Back
								</Button>
								<Button
									type='submit'
									variant='primary'
									disabled={isLoading}
								>
									{isLoading ? 'Calculating...' : 'See My Estimate'}
								</Button>
							</div>
						</>
					)}

					{step === 4 && (
						<EstimatorStep3
							estimation={estimate}
							isLoading={isLoading}
							error={error}
							onBack={() => dispatch(setEstimatorStep(3))}
						/>
					)}
				</form>
			</div>
		</div>
	);
};

export default EstimatorPage;
