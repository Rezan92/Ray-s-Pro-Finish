import { callGemini } from './aiHelper.js';

const generateInstallPrompt = (data: any) => {
  return `
    You are an expert construction estimator.
    Labor Rate: $75/hr (Higher for installation).
    
    --- DRYWALL INSTALLATION RULES ---

    SECTION 1: CALCULATING BOARD COUNT (Estimated)
    * If 'Wall':
       - Small (<10ft): 3 sheets
       - Medium (10-20ft): 5 sheets
       - Large (20ft+): 8 sheets
    * If 'Ceiling':
       - Area = roomSqft. Sheets = (Area / 32). Add 15% waste.
    * If 'Room':
       - Wall Area approx = (sqrt(roomSqft) * 4) * 8. 
       - Ceiling Area = roomSqft.
       - Total Sheets = (Wall Area + Ceiling Area) / 32. Add 15% waste.

    SECTION 2: LABOR (Hanging & Finishing)
    * Hanging: 0.5 hours per sheet.
    * Finishing (Taping/Mudding):
       - Level 3: 0.5 hours per sheet.
       - Level 4: 0.75 hours per sheet (Standard).
       - Level 5: 1.25 hours per sheet (Skim coat).
    * Height Multiplier:
       - High (9-10ft): 1.2x total labor.
       - Vaulted (12ft+): 1.5x total labor.

    SECTION 3: FRAMING (If selected)
    * "Frames are ready": 0 extra hours.
    * "Need Framing": 
       - Calculate Linear Feet.
       - Wood/Metal: 0.75 hours per linear foot.
       - Materials: +$5 per linear foot.

    SECTION 4: PAINTING (If selected)
    * Prime & Paint: 
       - 0.4 hours per sheet.
       - Materials: $20 per estimated gallon (1 gal per 300sqft).

    SECTION 5: OPENINGS (If 'Room' selected)
    * Add 1.0 hour per door/window for corner bead and detail work.

    Calculate total hours, material estimates, and cost range.
    Customer Data: ${JSON.stringify(data)}
  `;
};

export const calculateInstallEstimate = async (data: any) => {
    const prompt = generateInstallPrompt(data);
    return await callGemini(prompt);
};