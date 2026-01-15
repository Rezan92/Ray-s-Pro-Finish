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
