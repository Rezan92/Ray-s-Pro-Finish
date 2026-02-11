import { describe, it, expect } from 'vitest';
import { calculatePaintingEstimate } from './paintingService.js';
import { PaintingRequest } from '../types.js';

describe('PaintingService Man-Hour Engine', () => {
	it('should calculate a Standard Room (10x10x8) correctly (SC-001)', async () => {
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
					wallCondition: 'Good',
					colorChange: 'Similar',
					ceilingTexture: 'Flat',
					trimCondition: 'Good',
					trimStyle: 'Simple',
					doorCount: '0',
					doorStyle: 'Slab',
					crownMoldingStyle: 'Simple',
				},
			],
			paintProvider: 'Customer',
			occupancy: 'EMPTY',
		};

		const result = await calculatePaintingEstimate(request);

		/**
		 * Manual Math Breakdown:
		 * Area: 40' perimeter * 8' height = 320 sqft
		 * Roll 1st Coat: 320 / 400 = 0.80 hrs
		 * Roll 2nd Coat: 320 / 550 = 0.58 hrs
		 * Cut Standard: 40 / 120 = 0.33 hrs
		 * Prep Good: 320 * 0.0015 = 0.48 hrs
		 * Electrical Plates: 4 * 0.05 = 0.20 hrs
		 * Floor Protection: (100 / 100) * 0.15 = 0.15 hrs
		 * -------------------------------------------
		 * Subtotal Labor: 2.54 hrs
		 * Occupancy Multiplier: 1.0x
		 * Days: Math.ceil(2.54 / 8) = 1 day
		 * Daily Trip: 1 * 0.75 hrs = 0.75 hrs
		 * -------------------------------------------
		 * TOTAL HOURS: 3.29 hrs (approx 3.3)
		 */

		expect(result.totalHours).toBeCloseTo(3.3, 1);
		expect(result.low).toBe(Math.round(3.29 * 75)); // Approx 247
	});

	it('should apply 3.0x multiplier for stained-to-painted trim conversion', async () => {
		const request: PaintingRequest = {
			rooms: [
				{
					id: 'room_1',
					type: 'bedroom',
					label: 'Trim Room',
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
						trim: true,
						doors: false,
						crownMolding: false,
						windows: false,
					},
					wallCondition: 'Good',
					colorChange: 'Similar',
					ceilingTexture: 'Flat',
					trimCondition: 'Good',
					trimConversion: true,
					trimStyle: 'Simple',
					doorCount: '0',
					doorStyle: 'Slab',
					crownMoldingStyle: 'Simple',
				},
			],
			paintProvider: 'Customer',
			occupancy: 'EMPTY',
		};

		const result = await calculatePaintingEstimate(request);

		/**
		 * Manual Math Breakdown:
		 * Perimeter: 40 lf
		 * Baseboard Rate: 60 lf/hr
		 * Base Hours: 40 / 60 = 0.67 hrs
		 * Multiplier: 3.0x
		 * Total Trim Hours: 2.0 hrs
		 * Floor Protection: 0.15 hrs
		 * -------------------------------------------
		 * Subtotal: 2.15 hrs
		 * Daily Trip: 0.75 hrs
		 * TOTAL: 2.9 hrs
		 */

		expect(result.totalHours).toBeCloseTo(2.9, 1);
	});

	it('should add equipment rental for high ceilings (SC-002)', async () => {
		const request: PaintingRequest = {
			rooms: [
				{
					id: 'room_1',
					type: 'livingRoom',
					label: 'Vaulted Room',
					size: 'Small',
					exactLength: 10,
					exactWidth: 10,
					exactHeight: 14, // triggers high ceiling
					ceilingHeight: '11ft+',
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
					wallCondition: 'Good',
					colorChange: 'Similar',
					ceilingTexture: 'Flat',
					trimCondition: 'Good',
					trimStyle: 'Simple',
					doorCount: '0',
					doorStyle: 'Slab',
					crownMoldingStyle: 'Simple',
				},
			],
			paintProvider: 'Customer',
			occupancy: 'EMPTY',
		};

		const result = await calculatePaintingEstimate(request);
		
		const rentalItem = result.breakdownItems?.find(item => item.name === 'High-Reach Equipment Rental');
		expect(rentalItem).toBeDefined();
		expect(rentalItem?.cost).toBe(200);
	});
});
