import type {
	FormData,
	Estimate,
	PaintingRoom,
} from '@/components/estimator/EstimatorTypes';

// 1. Get the API Key from Environment Variables
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;

// --- Helper function to format painting details ---
const formatPaintingPrompt = (paintingData: FormData['painting']): string => {
	let prompt = '\n\n--- SERVICE 1: INTERIOR PAINTING ---';

	if (paintingData.rooms.length === 0) {
		prompt += '\n- No rooms selected.';
		return prompt;
	}

	prompt += `\n- Materials: ${paintingData.materials}`;

	paintingData.rooms.forEach((room: PaintingRoom, index: number) => {
		prompt += `\n\n  Room ${index + 1}: ${room.name}`;
		prompt += `\n  - Dimensions: ${room.dimensions.length || 'N/A'} ft x ${
			room.dimensions.width || 'N/A'
		} ft`;
		prompt += `\n  - Ceiling Height: ${room.ceilingHeight}`;
		const scope = Object.entries(room.scope)
			.filter(([key, value]) => value && key !== 'doorCount')
			.map(([key]) => key)
			.join(', ');
		prompt += `\n  - Scope: ${scope || 'None'}`;
		if (room.scope.doors && room.scope.doorCount) {
			prompt += ` (${room.scope.doorCount} doors)`;
		}
		prompt += `\n  - Colors: ${room.condition.currentColor} -> ${room.condition.newColor}`;
		prompt += `\n  - Prep: ${room.condition.prep}`;
		prompt += `\n  - Furniture: ${room.furniture}`;
	});

	return prompt;
};

// --- Helper function to format patching details ---
const formatPatchingPrompt = (patchingData: FormData['patching']): string => {
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

	// 2. Construct the main prompt
	const mainPrompt = `
    You are an expert estimator for a high-quality painting and drywall business called 'Ray's Pro Finish'. Your goal is to provide a helpful, non-binding price range to a potential customer. Your tone is professional, helpful, and trustworthy.

    --- MY PRICING RULES ---
    (You must use these rules to calculate the estimate)

    **PATH 1: PAINTING**
    - **Room Base (Walls only, 8ft ceiling, Good condition):**
      - Bedroom (10x12): $350 - $500
      - Living Room (15x20): $500 - $800
      - Kitchen: $300 - $450
      - Bathroom: $200 - $350
      - Hallway: $150 - $300
      - Stairwell: $400 - $700
      - Closets: $75 - $150
    - **Add-ons (per room):**
      - Ceilings: +$1.00/sq ft (e.g., 10x12 room = +$120)
      - Trim/Baseboards: +$100 - $200
      - Doors: +$50 - $75 per door
      - 9ft-10ft ceilings: +15% to room base
      - 10ft+ ceilings: +25% to room base
    - **Prep & Color:**
      - 'Fair' prep: +15% to room total
      - 'Poor' prep: +30% to room total
      - Dark -> Light color: +$50 per room (extra primer)
      - Light -> Dark color: +$50 per room (extra coat)
    - **Furniture:**
      - 'I need contractor to move': +$100 per room
    - **Materials:**
      - 'Standard quality': +20% to total
      - 'Premium quality': +35% to total

    **PATH 2: DRYWALL PATCHING**
    - **Base:**
      - Nail pops (1-3): $100
      - Fist-sized (1-3): $150 - $250
      - Dinner-plate (1-3): $250 - $400
      - 1-2 feet: $300 - $500
    - **Multipliers:**
      - Quantity (4-6): +50% to base
      - Quantity (7+): +100% to base
      - Ceiling patch: +25% (harder to work)
    - **Texture:**
      - 'Popcorn' or 'Orange Peel' match: +$50 per patch
    - **Scope:**
      - 'Patch, prime, paint (customer paint)': +$50 per patch
      - 'Patch, prime, paint (contractor match)': +$100 per patch

    **PATH 3: DRYWALL INSTALLATION**
    - **Hanging (per sq ft of *board*):** $1.50 - $2.50
    - **Tape & Finish (per sq ft of *board*):** $1.50 - $2.50
    - **All-in (Hang, Tape, Finish):** $3.00 - $4.50 per sq ft of *board*.
    - **To estimate *board* sq ft from *room* sq ft:** (Room Sq Ft * 3.5)
    - **Finish Level:**
      - Level 4 is standard.
      - Level 5: +30% to finish cost.

    **MULTI-SERVICE DISCOUNT:**
    - If user selects Painting AND Patching, apply a 15% discount to the *patching* total.
    - If user selects Painting AND Installation, apply a 10% discount to the *painting* total.
    --- END OF RULES ---

    ${customerAnswersPrompt}

    YOUR TASK:
    1. Analyze the customer's request against my rules.
    2. Calculate a combined low-end and high-end estimate.
    3. Provide a 1-3 sentence explanation for the quote, mentioning what services are included.
    4. **MANDATORY:** Respond *only* with a valid JSON object in this exact format:
       { "low": 1200, "high": 1850, "explanation": "This estimate includes painting a living room and 2 bedrooms (walls, trim, and ceilings) and patching 3 small holes." }
  `;

	// 3. Make the API call
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