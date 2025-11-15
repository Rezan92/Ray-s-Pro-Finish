import React from 'react';
import type { FormData } from './EstimatorTypes';
import { PaintingForm } from './PaintingForm';
import { RepairForm } from './RepairForm';
import { InstallationForm } from './InstallationForm';

interface EstimatorStep2Props {
	formData: FormData;
	onNestedChange: (
		path: 'painting' | 'patching' | 'installation',
		field: string,
		value: any,
	) => void;
	onRoomChange: (roomId: string, field: string, value: any) => void;
	onRoomScopeChange: (roomId: string, field: string, value: boolean) => void;
	onRoomCountChange: (roomType: 'bedroom' | 'bathroom', count: number) => void;
}

// This component now just renders the forms for the selected services
export const EstimatorStep2: React.FC<EstimatorStep2Props> = ({
	formData,
	...props
}) => {
	const { services } = formData;
	return (
		<div className='estimator-step'>
			<h2 className='estimator-title'>Project Details</h2>
			<p className='estimator-subtitle'>
				Please provide as much detail as possible for each service you
				selected.
			</p>
			{services.painting && (
				<PaintingForm
					formData={formData}
					onNestedChange={props.onNestedChange as any}
					onRoomChange={props.onRoomChange}
					onRoomScopeChange={props.onRoomScopeChange}
					onRoomCountChange={props.onRoomCountChange}
				/>
			)}
			{services.patching && (
				<RepairForm
					formData={formData}
					onNestedChange={props.onNestedChange as any}
				/>
			)}
			{services.installation && (
				<InstallationForm
					formData={formData}
					onNestedChange={props.onNestedChange as any}
				/>
			)}
		</div>
	);
};