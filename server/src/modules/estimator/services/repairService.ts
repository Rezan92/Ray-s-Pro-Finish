import { callGemini } from './aiHelper.js';

const generateRepairPrompt = (data: any) => {
	return `
    You are an expert estimator for Drywall Repair.
    Labor Rate: $70/hr. Minimum Job Charge: $150.

    --- REPAIR ESTIMATION RULES ---

    SECTION 1: REPAIR ITEMS (Base Hours Per Item)
    * Hole / Impact Damage:
      - Medium (<12"): 1.5 hrs (includes backing, patch, 3 coats)
      - Large (1-3ft): 3.0 hrs
      - X-Large (Sheet): 5.0 hrs
    * Water Damage (Add 1.2x complexity to base):
      - Medium: 2.0 hrs
      - Large: 4.0 hrs
      - X-Large: 6.0 hrs
    * Stress Cracks / Tape: 1.5 hrs flat.

    SECTION 2: DIFFICULTY & ACCESS MULTIPLIERS (Apply to Item Base)
    * Accessibility (Crucial):
      - "Standard": 1.0x
      - "Ladder": 1.25x (Slower work pace)
      - "High": 1.5x (Requires scaffolding/tall ladders, significant fatigue)
    * Placement: 
      - If Ceiling AND "High": Use 1.6x combined multiplier.
      - If Ceiling (Standard height): 1.25x.
    * Texture Matching:
      - Smooth: 1.0x
      - Orange Peel/Knockdown: +0.5 hrs (Setup spray hopper)
      - Popcorn: +1.0 hrs (Difficult blend)

    SECTION 3: SCOPE OF FINISH
    * Patch Only: Baseline hours.
    * Patch & Prime: +0.5 hrs per item.
    * Patch, Prime & Paint: 
      - "Customer has paint": +1.0 hrs per item.
      - "Color Match needed": +2.0 hrs (includes trip to store).
      - "Paint entire wall": +2.5 hrs per item (Assumes standard wall up to 150sqft).

    SECTION 4: GLOBAL COSTS
    * Site Protection (Plastic/Taping): Add +0.5 hrs flat for the whole job.
    * Materials (Mud, Tape, Screws, Sandpaper):
      - Add $15 per "Medium" repair.
      - Add $30 per "Large/X-Large" repair.

    SECTION 5: SMALL REPAIRS
    * Analyze 'smallRepairsDescription'.
    * Assume ~0.5 hrs per small ding/pop mentioned.
    * Minimum 1.0 hr if description exists but is vague.

    Calculate total hours, material cost, and provide a clean breakdown.
    Customer Data: ${JSON.stringify(data)}
  `;
};

export const calculateRepairEstimate = async (data: any) => {
	const prompt = generateRepairPrompt(data);
	return await callGemini(prompt);
};
