import { callGemini } from './aiHelper.js';

const generateInstallPrompt = (data: any) => {
	return `
    You are an expert construction estimator for Framing & Remodeling.
    Labor Rate: $75/hr.
    
    --- FRAMING & REMODELING RULES ---

    SECTION 1: PROJECT TYPES
    * "Demo":
       - Removal Labor: 1 hr per 4 linear feet.
       - Load Bearing: If "Yes", add $1,500 placeholder (Engineering/Support).
       - Disposal: If included, add $150 + $50 labor.
    * "Hanging" (Just Hanging Drywall):
       - Calculate sheets based on 'roomSqft' / 32.
       - Labor: Hanging Only (0.5 hrs/sheet) + Finish Level.
       - Framing: Assume $0 (Ready).
    * "Ceiling" (Overlay):
       - Calculate sheets. Hanging Labor x 1.25 (Overhead fatigue).
       - Framing: Assume $0.

    SECTION 2: NEW CONSTRUCTION (Building Walls)
    * "Wall"/"Partition":
       - Sheets: Small(3), Medium(5), Large(8).
       - Framing (If Need Wood/Metal): 0.75 hrs/LF. Material $5/LF.
       - Openings: 1.5 hrs/opening.

    SECTION 3: LABOR & FINISHES
    * Hanging: 0.5 hrs/sheet.
    * Finishing: L3(0.5), L4(0.75), L5(1.25).
    * Painting: If included, 0.4 hrs/sheet + $20/gal material.

    SECTION 4: COMPLEXITY (Analyze 'additionalDetails')
    * Look for keywords in the description:
       - "Soffit", "Box", "Duct": Add +2 hours framing labor.
       - "High", "Vaulted": Multiply total labor by 1.2x.
       - "Soundproof", "Quiet": Suggest 5/8" board cost adjustment.

    Calculate total hours and budget range.
    Customer Data: ${JSON.stringify(data)}
  `;
};

export const calculateInstallEstimate = async (data: any) => {
	const prompt = generateInstallPrompt(data);
	return await callGemini(prompt);
};
