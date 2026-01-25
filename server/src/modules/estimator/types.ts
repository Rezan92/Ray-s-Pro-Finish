export interface RepairItem {
	id: string;
	damageType: string;
	size: 'Medium (<12")' | 'Large (1-3ft)' | 'X-Large (Sheet+)'; // Strict sizing
	locationName: string;
	quantity: number;
	placement: 'Wall' | 'Ceiling';
	accessibility: 'Standard' | 'Ladder' | 'High';
	texture: 'Smooth' | 'Orange Peel' | 'Knockdown' | 'Popcorn';
	scope: string;
	paintMatching?: string;
	wallHeight?: '8ft (Standard)' | '9-10ft' | '11ft+ (Scaffold)';
	wallWidth?:
		| '6ft (Small)'
		| '10ft (Medium)'
		| '12ft (Large)'
		| '14ft+ (Very Large)';
}

export interface RepairRequest {
	repairs: RepairItem[];
	smallRepairsDescription?: string;
}

export type GarageSize = '1-Car' | '1.5-Car' | '2-Car' | '2.5-Car' | '3-Car';
export type GarageHeight =
	| 'Standard (8-9ft)'
	| 'High (10-12ft)'
	| 'Extra High (13ft+)';
export type GarageCondition =
	| 'Bare Studs'
	| 'Drywall Hung'
	| 'Taped & Rough'
	| 'Finished/Bare';
export type GarageOccupancy = 'Empty' | 'Customer Will Move' | 'Pro Move';

export interface GarageRequest {
	size: GarageSize;
	ceilingHeight: GarageHeight;
	condition: GarageCondition;
	includeCeiling: boolean;
	occupancy: GarageOccupancy;

	drywallLevel?: string;
	paintLevel?: string;

	services: {
		insulation: boolean;
		drywall: boolean;
		painting: boolean;
	};
}

export interface BasementRequest {
	sqft: number;
	ceilingHeight: 'Standard (8ft)' | 'Low (<7ft)' | 'High (9ft+)';

	condition: 'Bare Concrete' | 'Framed' | 'Framed & Insulated';
	perimeterInsulation: 'Standard (Vapor Barrier)' | 'Premium (Rigid Foam)';

	// This specific type fixes the "Implicit Any" error in the service
	soffitWork: 'Minimal' | 'Average' | 'Complex';

	numBedrooms: number;
	numBathrooms: number;
	hasWetBar: boolean;

	services: {
		framing: boolean;
		drywall: boolean;
		painting: boolean;
		ceilingFinish: 'Drywall' | 'Drop Ceiling' | 'Painted/Industrial';
	};
}
