import type { Request, Response } from 'express';
import { calculatePaintingEstimate } from './services/paintingService.js';
import { calculateRepairEstimate } from './services/repairService.js';
import { calculateInstallEstimate } from './services/installService.js';
import { calculateGarageEstimate } from './services/garageService.js';

export const getEstimate = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const formData = req.body;

		let totalLow = 0;
		let totalHigh = 0;
		let totalHours = 0;
		let combinedExplanation = '';

		const promises = [];

		// 1. Painting Service
		if (formData.services.painting && formData.painting.rooms.length > 0) {
			promises.push(
				calculatePaintingEstimate(formData.painting).then((est) => {
					totalLow += est.low;
					totalHigh += est.high;
					totalHours += est.totalHours;
					combinedExplanation += `PAINTING:\n${est.explanation}\n\n`;
				})
			);
		}

		// 2. Repair Service
		if (formData.services.patching) {
			const hasRepairs = formData.patching.repairs?.length > 0;
			const hasDesc = !!formData.patching.smallRepairsDescription;

			if (hasRepairs || hasDesc) {
				promises.push(
					calculateRepairEstimate(formData.patching).then((est) => {
						totalLow += est.low;
						totalHigh += est.high;
						totalHours += est.totalHours;
						combinedExplanation += `DRYWALL REPAIR:\n${est.explanation}\n\n`;
					})
				);
			}
		}

		// 3. Installation Service
		if (formData.services.installation) {
			promises.push(
				calculateInstallEstimate(formData.installation).then((est) => {
					totalLow += est.low;
					totalHigh += est.high;
					totalHours += est.totalHours;
					combinedExplanation += `INSTALLATION:\n${est.explanation}\n\n`;
				})
			);
		}

		// 4. Garage
		if (formData.services.garage) {
			promises.push(
				calculateGarageEstimate(formData.garage).then((est) => {
					totalLow += est.low;
					totalHigh += est.high;
					totalHours += est.totalHours;
					combinedExplanation += `GARAGE FINISH:\n${est.explanation}\n\n`;
				})
			);
		}

		await Promise.all(promises);

		res.json({
			low: Math.round(totalLow),
			high: Math.round(totalHigh),
			totalHours: Number(totalHours.toFixed(1)),
			explanation: combinedExplanation.trim() || 'No services selected.',
		});
	} catch (error) {
		console.error('Controller Error:', error);
		res.status(500).json({ error: 'Failed to calculate estimate' });
	}
};
