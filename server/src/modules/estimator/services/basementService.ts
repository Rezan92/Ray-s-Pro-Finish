import { callGemini } from './aiHelper.js';

const generateBasementPrompt = (data: any) => {
	return `
    You are an expert General Contractor estimating a Basement Finish.
    Labor Rate: $75/hr. 
    
    --- BASEMENT ESTIMATION RULES ---

    SECTION 1: THE SHELL (Framing/Insulation/Drywall)
    * Calculate Wall Area approx based on sqft (Perimeter * Height).
    * Framing:
       - "Bare Concrete": Add Framing & Insulation cost ($10/sqft floor area allowance).
       - "Framed": Add $0.
    * Drywall & Ceiling:
       - "Drywall Ceiling": Add labor for overhead hanging.
       - "Drop Ceiling": Material intensive (~$3/sqft).
       - "Industrial": Spray paint labor (Cheaper but specific prep).

    SECTION 2: ROOMS & EGRESS
    * If numBedrooms > 0 AND egressWindow == "Need to Install":
       - CRITICAL: Add $4,500 - $6,000 per window for excavation, cutting concrete, and window well kit. Mention this explicitly.
    * Partition Walls: Add framing labor for number of bedrooms.

    SECTION 3: PLUMBING (Big Variable)
    * Bathroom:
       - "Half Bath": Base $5,000 allowance.
       - "Full Bath": Base $8,000 allowance.
       - "No Rough-in" (Need concrete work): Add +$3,500 for jackhammering/trenching.
    * Wet Bar: Add $2,500 allowance (Cabinetry/Plumbing).
    * Kitchenette: Add $5,000+ allowance.

    SECTION 4: SYSTEMS & STAIRS
    * Stairs:
       - "Carpet": Add $800 allowance.
       - "Wood / Vinyl Caps": Add $2,500 allowance (Detail work).
    * HVAC:
       - "Extend Ductwork": Add $1,500 allowance (Soffits + Tin work).
       - "Install Mini-Split": Add $3,500 allowance.

    SECTION 5: ELECTRICAL & FLOORING
    * Electrical:
       - "Standard": $4/sqft.
       - "Upgraded (Cans)": $6/sqft.
    * Flooring:
       - "LVP": $4/sqft (Material+Labor).
       - "Carpet": $3.50/sqft.
       - "Tile": $12/sqft (Labor intensive).

    SECTION 6: EXPLANATION STRATEGY
    * Since this is a large project, provide the estimate as a "Budget Range".
    * Break it down by: "Carpentry/Drywall", "Plumbing/Bath", "Systems (HVAC/Elec)", "Finishes".
    * Add a disclaimer: "Includes standard allowances. Permit fees not included."

    Calculate total estimated budget range.
    Customer Data: ${JSON.stringify(data)}
  `;
};

export const calculateBasementEstimate = async (data: any) => {
	const prompt = generateBasementPrompt(data);
	return await callGemini(prompt);
};
