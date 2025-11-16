import type {
	FormData,
	Estimate,
	PaintingRoom, // Import the new type
} from '@/components/common/estimator/EstimatorTypes';

// 1. Get the API Key from Environment Variables
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;

// --- Helper function to format painting details ---
const formatPaintingPrompt = (paintingData: FormData['painting']): string => {
	let prompt = '\n\n--- SERVICE 1: INTERIOR PAINTING ---';

	const { rooms, paintProvider, furniture } = paintingData;

	if (rooms.length === 0) {
		prompt += '\n- No rooms selected.';
		return prompt;
	}

	// Add the global settings
	prompt += `\n- Global Paint: ${paintProvider || 'Not specified'}`;
	prompt += `\n- Global Furniture: ${furniture || 'Not specified'}`;

	// Add each room card
	rooms.forEach((room: PaintingRoom) => {
		prompt += `\n\n  Room: ${room.label} (Type: ${room.type})`;
		prompt += `\n  - Size: ${room.size || 'Medium'}`;
		prompt += `\n  - Ceiling Height: ${room.ceilingHeight}`;
		prompt += `\n  - Wall Condition: ${room.wallCondition}`;
		prompt += `\n  - Color Change: ${room.colorChange}`;

		// Surfaces
		const surfaces = Object.entries(room.surfaces)
			.filter(([key, value]) => value && key !== 'doorCount')
			.map(([key]) => key)
			.join(', ');
		prompt += `\n  - Surfaces: ${surfaces || 'None'}`;

		// Conditional Details
		if (room.surfaces.ceiling && room.ceilingTexture) {
			prompt += `\n    - Ceiling Texture: ${room.ceilingTexture}`;
		}
		if (room.surfaces.trim && room.trimCondition) {
			prompt += `\n    - Trim Condition: ${room.trimCondition}`;
		}
		if (room.surfaces.doors) {
			prompt += `\n    - Door Count: ${room.doorCount || '1'}`;
			prompt += `\n    - Door Style: ${room.doorStyle || 'Slab'}`;
		}
	});

	return prompt;
};

// --- Helper function to format patching details ---
const formatPatchingPrompt = (patchingData: FormData['patching']): string => {
	// ... (same as before)
	let prompt = '\n\n--- SERVICE 2: DRYWALL PATCHING ---';
	prompt += `\n- Quantity: ${patchingData.quantity}`;
	prompt += `\n- Location: ${patchingData.location.join(', ')}`;
	prompt += `\n- Largest Size: ${patchingData.largest_size}`;
	prompt += `\n- Texture: ${patchingData.texture}`;
	prompt += `\n- Scope: ${patchingData.scope}`;
	return prompt;
};

// --- Helper function to format installation details ---
const formatInstallationPrompt = (
	installationData: FormData['installation'],
): string => {
	// ... (same as before)
	let prompt = '\n\n--- SERVICE 3: DRYWALL INSTALLATION ---';
	prompt += `\n- Project Type: ${installationData.project_type}`;
	prompt += `\n- Room Sq Ft: ${installationData.sqft || 'N/A'}`;
	prompt += `\n- Ceiling Height: ${installationData.ceilingHeight || 'N/A'}`;
	prompt += `\n- Scope: ${installationData.scope}`;
	prompt += `\n- Finish: ${installationData.finish}`;
	return prompt;
};

/**
 * Calls the Gemini API to get a price estimate.
 * @param answers The user's form data.
 * @returns A promise that resolves to an Estimate object.
 */
export const getGeminiEstimate = async (
	answers: FormData,
): Promise<Estimate> => {
	// (API key check is unchanged)
	if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
		console.error('Gemini API key is missing or not set in .env.local');
		throw new Error(
			'API key is not configured. Please contact the site administrator.',
		);
	}

	// --- 1. Build the prompt dynamically based on selected services ---
	let customerAnswersPrompt = '--- CUSTOMER REQUEST ---';
	if (answers.services.painting) {
		customerAnswersPrompt += formatPaintingPrompt(answers.painting);
	}
	if (answers.services.patching) {
		customerAnswersPrompt += formatPatchingPrompt(answers.patching);
	}
	if (answers.services.installation) {
		customerAnswersPrompt += formatInstallationPrompt(answers.installation);
	}
	customerAnswersPrompt +=
		'\n\n(Note: Photos were not uploaded for this estimate.)';

	// --- 2. Construct the main prompt (RULES ARE UPDATED) ---
	const mainPrompt = `
    You are an expert estimator for a high-quality painting and drywall business.
    Your goal is to provide a helpful, non-binding price range.
    Your tone is professional, helpful, and trustworthy.

    --- MY PRICING RULES ---
    (You must use these rules to calculate the estimate. Base prices are for "Medium" size, "8ft" ceilings, "Good" condition, and "Similar" color change.)

    **PATH 1: PAINTING**
    - **Room Base (Walls only):**
      - Bedroom: $400
      - Living Room: $650
      - Kitchen: $350
      - Bathroom: $250
      - Hallway: $200
      - Stairwell: $500
      - Closet: $100
    
    - **Size Adjustments:**
      - 'Small': -25% from base.
      - 'Medium': +0% (base).
      - 'Large': +40% to base.
    
    - **Ceiling Height Adjustments:**
      - '9-10ft': +15% to room total.
      - '11ft+': +25% to room total.

    - **Surface Add-ons (per room):**
      - 'Ceiling' in scope: +$1.00/sq ft (Use approx. sq ft: Small=100, Medium=180, Large=300).
        - If 'Textured': +20% to Ceiling cost.
        - If 'Popcorn': +40% to Ceiling cost.
      - 'Trim' in scope: +$150 (for Medium room).
        - If 'Poor' Trim Condition: +$75 (for re-caulking).
      - 'Doors' in scope:
        - 'Slab' Door: +$50 per door.
        - 'Paneled' Door: +$75 per door.
        - Use 'doorCount' for number of doors.
    
    - **Condition Adjustments (per room):**
      - 'Fair' Wall Condition: +15% to Walls cost.
      - 'Poor' Wall Condition: +30% to Walls cost.
      - 'Light-to-Dark' Color Change: +$50 per room.
      - 'Dark-to-Light' Color Change: +$75 per room (extra primer).
    
    - **Global Adjustments (Apply to *entire* painting sub-total):**
      - 'paintProvider' = 'Standard': +20%
      - 'paintProvider' = 'Premium': +35%
      - 'furniture' = 'Contractor': +$75 *per room* listed.

    **PATH 2: DRYWALL PATCHING (Unchanged)**
    - (Same rules as before)

    **PATH 3: DRYWALL INSTALLATION (Unchanged)**
    - (Same rules as before)

    **MULTI-SERVICE DISCOUNT (Unchanged)**
    - (Same rules as before)
    --- END OF RULES ---

    ${customerAnswersPrompt}

    YOUR TASK:
    1. Analyze the customer's request against my rules.
    2. Calculate a combined low-end and high-end estimate. The range should be about 20% (e.g., $1000 - $1200).
    3. Provide a 1-3 sentence explanation for the quote, mentioning what services are included.
    4. **MANDATORY:** Respond *only* with a valid JSON object in this exact format:
       { "low": 1200, "high": 1850, "explanation": "This estimate includes painting a living room and 2 bedrooms (walls, trim, and ceilings) and patching 3 small holes." }
  `;

	// (The rest of the fetch call is unchanged)
	const response = await fetch(API_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			contents: [{ parts: [{ text: mainPrompt }] }],
			generationConfig: {
				responseMimeType: 'application/json',
				responseSchema: {
					type: 'OBJECT',
					properties: {
						low: { type: 'NUMBER' },
						high: { type: 'NUMBER' },
						explanation: { type: 'STRING' },
					},
					required: ['low', 'high', 'explanation'],
				},
			},
		}),
	});

	if (!response.ok) {
		const errorData = await response.json();
		console.error('Gemini API Error:', errorData);
		throw new Error('Failed to get estimate from Gemini.');
	}

	const data = await response.json();
	const jsonText = data.candidates[0].content.parts[0].text;
	return JSON.parse(jsonText) as Estimate;
};