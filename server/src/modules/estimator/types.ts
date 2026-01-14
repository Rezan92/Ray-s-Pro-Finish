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
}

export interface RepairRequest {
	repairs: RepairItem[];
	smallRepairsDescription?: string;
}
