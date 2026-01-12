/**
 * Utility to generate a clean, professional itemized breakdown.
 * Reusable across different service modules.
 */
export const generateServiceBreakdown = (
	serviceName: string,
	items: Array<{
		name: string;
		cost: number;
		hours: number;
		details?: string;
	}>,
	totalCost: number,
	totalHours: number
): string => {
	let breakdown = `--- ${serviceName.toUpperCase()} SUMMARY ---\n\n`;

	items.forEach((item) => {
		const detailStr = item.details ? ` (${item.details})` : '';
		breakdown += `${item.name.padEnd(30)}: $${Math.round(item.cost)
			.toString()
			.padEnd(6)} | ${item.hours.toFixed(1)} hrs${detailStr}\n`;
	});

	breakdown += `\n--------------------------------------------\n`;
	breakdown += `TOTAL ESTIMATED PRICE: $${Math.round(totalCost)}\n`;
	breakdown += `TOTAL ESTIMATED TIME : ${totalHours.toFixed(1)} hrs\n`;

	return breakdown;
};
