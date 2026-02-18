import { describe, it, expect } from 'vitest';
import { calculatePaintingEstimate } from './paintingService.js';
import { PaintingRequest } from '../types.js';

describe('PaintingService Unit Pricing Engine', () => {
	it('should calculate a Standard Wall Refresh (10x10x8) correctly (SC-001/SC-002)', async () => {
		const request: PaintingRequest = {
			rooms: [
				{
					id: 'room_1',
					type: 'bedroom',
					label: 'Standard Room',
					size: 'Small',
					exactLength: 10,
					exactWidth: 10,
					exactHeight: 8,
					ceilingHeight: '8ft',
					windowCount: 0,
					closetSize: 'None',
					surfaces: {
						walls: true,
						ceiling: false,
						trim: false,
						doors: false,
						crownMolding: false,
						windows: false,
					},
					wallCondition: 'None',
					colorChange: 'Similar', // Refresh @ $0.58
					ceilingTexture: 'Flat',
					trimCondition: 'Good',
					trimStyle: 'Simple',
					trimColorChange: 'Similar',
					doorCount: '0',
					doorStyle: 'Slab',
					crownMoldingStyle: 'Simple',
					crownColorChange: 'Similar',
				},
			],
			paintProvider: 'Customer',
			occupancy: 'EMPTY',
		};

		const result = await calculatePaintingEstimate(request);

		/**
		 * Manual Math Breakdown:
		 * Walls Area: 40' perimeter * 8' height = 320 sqft
		 * Wall Labor: 320 * $0.58 = $185.60
		 * Wall Hours: 185.60 / 75 = 2.47 hrs
		 * Electrical Plates (4): 4 * 3m = 12m = 0.20 hrs. Cost = 0.20 * 75 = $15.00
		 * Floor Protection (100sqft): 15m/100sqft. 0.15 hrs * 100 / 60 = ? 
		 *   Code: (100 / 100) * 0.15 * 100 / 60 = 0.25 hrs. Cost = 0.25 * 75 = $18.75
		 * Subtotal Labor Cost: 185.60 + 15.00 + 18.75 = $219.35
		 * Subtotal Hours: 2.47 + 0.20 + 0.25 = 2.92 hrs
		 * Total Days: ceil(2.92 / 8) = 1 day
		 * Daily Trip: 1 * 0.75 hrs = 0.75 hrs. Cost = 0.75 * 75 = $56.25
		 * Total Cost: 219.35 + 56.25 + 10 (Misc Supplies) = $285.60
		 * Total Hours: 2.92 + 0.75 = 3.67 hrs
		 */

		expect(result.totalHours).toBeCloseTo(3.7, 1);
		expect(result.low).toBe(Math.round(285.60));
	});

	it('should apply 20% surcharge for detailed crown molding (US4)', async () => {
		const request: PaintingRequest = {
			rooms: [
				{
					id: 'room_1',
					type: 'bedroom',
					label: 'Crown Room',
					size: 'Small',
					exactLength: 10,
					exactWidth: 10,
					exactHeight: 8,
					ceilingHeight: '8ft',
					windowCount: 0,
					closetSize: 'None',
					surfaces: {
						walls: false,
						ceiling: false,
						trim: false,
						doors: false,
						crownMolding: true,
						windows: false,
					},
					wallCondition: 'None',
					colorChange: 'Similar',
					ceilingTexture: 'Flat',
					trimCondition: 'Good',
					trimStyle: 'Simple',
					trimColorChange: 'Similar',
					doorCount: '0',
					doorStyle: 'Slab',
					crownMoldingStyle: 'Detailed',
					crownColorChange: 'Change', // $3.00 base
				},
			],
			paintProvider: 'Customer',
			occupancy: 'EMPTY',
		};

		const result = await calculatePaintingEstimate(request);

		/**
		 * Manual Math Breakdown:
		 * Perimeter: 40 lf
		 * Base Rate: $3.00/lf
		 * Surcharge: 20% -> $3.60/lf
		 * Total Cost: 40 * 3.60 = $144.00
		 * Total Hours: 144 / 75 = 1.92 hrs
		 */

		const crownItem = result.breakdownItems?.find(i => i.name.includes('Crown Molding'));
		expect(crownItem).toBeDefined();
		expect(crownItem?.cost).toBe(144);
		expect(crownItem?.hours).toBeCloseTo(1.92, 2);
	});

	it('should add scaffolding rental for ceilings >= 15ft (US3)', async () => {
		const request: PaintingRequest = {
			rooms: [
				{
					id: 'room_1',
					type: 'livingRoom',
					label: 'High Ceiling',
					size: 'Medium',
					exactLength: 10,
					exactWidth: 10,
					exactHeight: 15, // Scaffolding
					ceilingHeight: '15ft+',
					windowCount: 0,
					closetSize: 'None',
					surfaces: {
						walls: true,
						ceiling: false,
						trim: false,
						doors: false,
						crownMolding: false,
						windows: false,
					},
					wallCondition: 'None',
					colorChange: 'Similar',
					ceilingTexture: 'Flat',
					trimCondition: 'Good',
					trimStyle: 'Simple',
					trimColorChange: 'Similar',
					doorCount: '0',
					doorStyle: 'Slab',
					crownMoldingStyle: 'Simple',
					crownColorChange: 'Similar',
				},
			],
			paintProvider: 'Customer',
			occupancy: 'EMPTY',
		};

		const result = await calculatePaintingEstimate(request);
		
		const rentalItem = result.breakdownItems?.find(item => item.name === 'Equipment Rental');
		expect(rentalItem).toBeDefined();
		expect(rentalItem?.details).toContain('Scaffolding');
		expect(rentalItem?.cost).toBe(150); // 1 day
	});
});
