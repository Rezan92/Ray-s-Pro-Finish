import React from 'react';
import type { FormData, RepairItem, BasementData, GarageData, RepairState, InstallationData } from './EstimatorTypes';
import { PaintingForm } from './PaintingForm';
import { RepairForm } from './RepairForm';
import { InstallationForm } from './InstallationForm';
import { GarageForm } from './GarageForm';
import { BasementForm } from './BasementForm';
import styles from './styles/EstimatorStep2.module.css';

interface EstimatorStep2Props {
	formData: FormData;
	// Painting Handlers
	onPaintingRoomTypeToggle: (type: string, isChecked: boolean) => void;
	onPaintingRoomAdd: (type: string) => void;
	onPaintingRoomRemove: (roomId: string) => void;
	onPaintingRoomChange: (roomId: string, field: string, value: unknown) => void;
	onPaintingGlobalChange: (field: string, value: string) => void;

	// Basement Handlers
	onBasementFieldChange: (field: keyof BasementData, value: unknown) => void;
	onBasementServiceChange: (field: keyof BasementData['services'], value: unknown) => void;

	// Garage Handlers
	onGarageFieldChange: (field: keyof GarageData, value: unknown) => void;
	onGarageServiceChange: (field: keyof GarageData['services'], value: unknown) => void;

	// Repair Handlers
	onAddRepair: (repair: RepairItem) => void;
	onUpdateRepair: (repair: RepairItem) => void;
	onRemoveRepair: (id: string) => void;
	onRepairFieldChange: (field: keyof RepairState, value: unknown) => void;

	// Installation Handlers
	onInstallationFieldChange: (field: keyof InstallationData, value: unknown) => void;
}

export const EstimatorStep2: React.FC<EstimatorStep2Props> = (props) => {
	const { formData } = props;
	const { services } = formData;

	return (
		<div className={styles.estimatorStep}>
			<h2 className={styles.estimatorTitle}>Project Details</h2>
			<p className={styles.estimatorSubtitle}>
				Please provide as much detail as possible for each service you selected.
			</p>

			{services.painting && (
				<PaintingForm
					formData={formData}
					onRoomTypeToggle={props.onPaintingRoomTypeToggle}
					onRoomAdd={props.onPaintingRoomAdd}
					onRoomRemove={props.onPaintingRoomRemove}
					onRoomChange={props.onPaintingRoomChange}
					onGlobalChange={props.onPaintingGlobalChange}
				/>
			)}

			{services.patching && (
				<RepairForm
					formData={formData}
					onFieldChange={props.onRepairFieldChange}
					onAddRepair={props.onAddRepair}
					onUpdateRepair={props.onUpdateRepair}
					onRemoveRepair={props.onRemoveRepair}
				/>
			)}

			{services.installation && (
				<InstallationForm
					formData={formData}
					onFieldChange={props.onInstallationFieldChange}
				/>
			)}

			{services.garage && (
				<GarageForm
					formData={formData}
					onFieldChange={props.onGarageFieldChange}
					onServiceToggle={props.onGarageServiceChange}
				/>
			)}

			{services.basement && (
				<BasementForm
					formData={formData}
					onFieldChange={props.onBasementFieldChange}
					onServiceChange={props.onBasementServiceChange}
				/>
			)}
		</div>
	);
};
