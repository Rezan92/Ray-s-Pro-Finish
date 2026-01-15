import type { Request, Response } from 'express';
import { calculatePaintingEstimate } from './services/paintingService.js';
import { calculateRepairEstimate } from './services/repairService.js';
import { calculateInstallEstimate } from './services/installService.js';
import { calculateGarageEstimate } from './services/garageService.js';
import { calculateBasementEstimate } from './services/basementService.js';
import { generateCustomerSummary } from './services/aiHelper.js';

const ADMIN_SECRET = 'ray123';

export const getEstimate = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const formData = req.body;

		const adminKey = req.query.admin as string;
		const isAdmin = adminKey === ADMIN_SECRET;

		let totalLow = 0;
		let totalHigh = 0;
		let totalHours = 0;
		let combinedExplanation = '';
		let breakdownItems: any[] = [];

		const promises = [];

		// 1. Painting Service
		if (formData.services.painting && formData.painting.rooms.length > 0) {
			promises.push(
				calculatePaintingEstimate(formData.painting).then((est) => {
					totalLow += est.low;
					totalHigh += est.high;
					totalHours += est.totalHours;
					combinedExplanation += `PAINTING:\n${est.explanation}\n\n`;
					if (est.breakdownItems) {
						breakdownItems = [...breakdownItems, ...est.breakdownItems];
					}
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
						if (est.breakdownItems) {
							breakdownItems = [...breakdownItems, ...est.breakdownItems];
						}
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

		// 5. Basement
		if (formData.services.basement) {
			promises.push(
				calculateBasementEstimate(formData.basement).then((est) => {
					totalLow += est.low;
					totalHigh += est.high;
					totalHours += est.totalHours;
					combinedExplanation += `BASEMENT FINISH:\n${est.explanation}\n\n`;
				})
			);
		}

		await Promise.all(promises);

		let customerSummary = '';
		if (!isAdmin) {
			customerSummary = await generateCustomerSummary(formData, totalHours);
		}

		res.json({
			low: Math.round(totalLow),
			high: Math.round(totalHigh),
			totalHours: Number(totalHours.toFixed(1)),
			isAdmin,
			explanation: isAdmin ? combinedExplanation.trim() : null,
			breakdownItems: isAdmin ? breakdownItems : null,
			customerSummary: !isAdmin ? customerSummary : null,
		});
	} catch (error) {
		console.error('Controller Error:', error);
		res.status(500).json({ error: 'Failed to calculate estimate' });
	}
};
