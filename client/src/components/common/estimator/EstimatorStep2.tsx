import React from 'react';
import type { FormData, RepairItem } from './EstimatorTypes';
import { PaintingForm } from './PaintingForm';
import { RepairForm } from './RepairForm';
import { InstallationForm } from './InstallationForm';
import { GarageForm } from './GarageForm';
import { BasementForm } from './BasementForm';

interface EstimatorStep2Props {
	formData: FormData;
	// Painting Handlers
	onPaintingRoomTypeToggle: (type: string, isChecked: boolean) => void;
	onPaintingRoomAdd: (type: string) => void;
	onPaintingRoomRemove: (roomId: string) => void;
	onPaintingRoomChange: (roomId: string, field: string, value: any) => void;
	onPaintingGlobalChange: (field: string, value: string) => void;

	// Repair Handlers (NEW)
	onAddRepair: (repair: RepairItem) => void;
	onRemoveRepair: (id: string) => void;

	// Generic Handler
	onNestedChange: (
		path: 'painting' | 'patching' | 'installation',
		field: string,
		value: any
	) => void;
}

export const EstimatorStep2: React.FC<EstimatorStep2Props> = (props) => {
	const { formData } = props;
	const { services } = formData;

	return (
		<div className='estimator-step'>
			<h2 className='estimator-title'>Project Details</h2>
			<p className='estimator-subtitle'>
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
					onNestedChange={props.onNestedChange as any}
					onAddRepair={props.onAddRepair}
					onRemoveRepair={props.onRemoveRepair}
				/>
			)}

			{services.installation && (
				<InstallationForm
					formData={formData}
					onNestedChange={props.onNestedChange as any}
				/>
			)}

			{services.garage && (
				<GarageForm
					formData={formData}
					onNestedChange={props.onNestedChange as any}
				/>
			)}

			{services.basement && (
				<BasementForm
					formData={formData}
					onNestedChange={props.onNestedChange as any}
				/>
			)}
		</div>
	);
};
