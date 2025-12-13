import type { Request, Response } from 'express';
import { calculatePaintingEstimate } from './services/paintingService.js';

export const getEstimate = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const formData = req.body;

		// Basic validation
		if (!formData || !formData.services) {
			res.status(400).json({ error: 'Invalid form data' });
			return;
		}

		const estimate = await calculatePaintingEstimate(formData);
		res.json(estimate);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to calculate estimate' });
	}
};
