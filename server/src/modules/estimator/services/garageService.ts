import { callGemini } from './aiHelper.js';

const generateGaragePrompt = (data: any) => {
	return `
    You are an expert construction estimator specializing in Garage Finishing.
    Labor Rate: $70/hr.
    
    --- GARAGE ESTIMATION RULES ---

    SECTION 1: DIMENSIONS (Estimates)
    * 1-Car: 250 sqft floor. Wall Perimeter ~70ft.
    * 2-Car: 450 sqft floor. Wall Perimeter ~90ft.
    * 3-Car: 650 sqft floor. Wall Perimeter ~110ft.
    * 4-Car: 850 sqft floor. Wall Perimeter ~140ft.
    * Base Height: Assume 9ft standard unless noted otherwise.

    SECTION 2: BOARD COUNT & LABOR
    * Calculate approx sheets needed based on 'scope' (Walls, Ceiling, or Both).
    * Hanging Labor:
       - "Open Studs" / "Insulated": 0.5 hrs per sheet.
       - "Existing Drywall": 0 hrs hanging.
    * Finishing Labor:
       - "Fire Tape": 0.3 hrs per sheet.
       - "Level 3": 0.5 hrs per sheet.
       - "Level 4": 0.75 hrs per sheet.

    SECTION 3: UPSELLS & MATERIALS
    * Insulation (If selected): Material $0.80/sqft, Labor 0.2 hrs/10 sqft.
    * Painting (If selected): 0.3 hrs per sheet equivalent. Paint Mat: $100-$250.
    * Vinyl Baseboards (If selected): Labor 1.5-3.0 hrs. Material $1.00/LF.
    
    SECTION 4: EPOXY FLOORING (Subcontractor Logic)
    * If 'includeEpoxy' is TRUE:
       - Base Cost: $5.00 per sqft.
       - Management Fee: Add flat $2,000.
       - Explain clearly: "Includes professional Epoxy coating."

    SECTION 5: COMPLEXITY ADJUSTMENTS (Analyze 'additionalDetails')
    * Look for keywords in the user's description:
       - "High", "Vaulted", "RV", "12ft", "14ft": Multiply TOTAL labor by 1.3x (Scaffolding/Lift required).
       - "Pipes", "Conduit", "Heater", "Obstructions": Add +4 hours labor for furring/cutting around.
       - "Attic", "Hatch": Add +2 hours for detailing.

    Calculate total hours and cost range.
    Customer Data: ${JSON.stringify(data)}
  `;
};

export const calculateGarageEstimate = async (data: any) => {
	const prompt = generateGaragePrompt(data);
	return await callGemini(prompt);
};
