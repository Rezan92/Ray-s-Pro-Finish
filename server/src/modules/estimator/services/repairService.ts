import { callGemini } from './aiHelper.js';

const generateRepairPrompt = (data: any) => {
	return `
    You are an expert estimator for Drywall Repair.
    Labor Rate: $70/hr. Minimum Job Charge: $150.

    --- REPAIR ESTIMATION RULES ---

    SECTION 1: REPAIR ITEMS (Per Item)
    * Hole / Impact Damage:
      - Medium (<12"): 1.5 hrs
      - Large (1-3ft): 3.0 hrs
      - X-Large (Sheet): 5.0 hrs
    * Water Damage (Add 1.2x complexity factor):
      - Medium: 2.0 hrs
      - Large: 4.0 hrs
      - X-Large: 6.0 hrs
    * Stress Cracks / Tape: 1.5 hrs flat.

    SECTION 2: DIFFICULTY MULTIPLIERS
    * Ceiling Placement: 1.25x (Harder/Fatigue).
    * Texture Matching:
      - Smooth: 1.0x
      - Orange Peel/Knockdown: +0.5 hrs (Setup)
      - Popcorn: +1.0 hrs (Difficult blend)

    SECTION 3: SCOPE OF WORK
    * Patch Only: Baseline hours.
    * Patch & Prime: +0.5 hrs per item.
    * Patch, Prime & Paint: +1.0 hrs per item.
      - If "Paint Entire Wall" selected: +2.0 hrs per item.

    SECTION 4: SMALL REPAIRS
    * Analyze 'smallRepairsDescription'.
    * Assume ~0.5 hrs per small ding/pop mentioned.
    * Minimum 1.0 hr if description exists but is vague.

    Calculate total hours and cost.
    Customer Data: ${JSON.stringify(data)}
  `;
};

export const calculateRepairEstimate = async (data: any) => {
	const prompt = generateRepairPrompt(data);
	return await callGemini(prompt);
};
