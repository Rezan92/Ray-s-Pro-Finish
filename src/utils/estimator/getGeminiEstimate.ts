import type {
	FormData,
	Estimate,
} from '@/components/common/estimator/EstimatorTypes';

// 1. Get the API Key from Environment Variables
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;

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

	// --- 1. Create the customerAnswersPrompt from the raw FormData ---
	// The new prompt is smart enough to parse this directly.
	const customerAnswersPrompt = JSON.stringify(answers);

	// --- 2. Construct the main prompt (NEW HOUR-BASED LOGIC) ---
	const mainPrompt = `
    You are an expert estimator for a high-quality painting business.
    Your labor rate is $65 per hour.
    Your goal is to provide a preliminary price range based on the user's selections.
    You must be professional, reasonable, and trustworthy.

    --- MY ESTIMATION RULES ---

    SECTION 1: BASELINE LABOR HOURS (WALLS ONLY)
    This table represents the hours for a single painter to prep and paint WALLS ONLY (2 coats) in a room. This is the baseline.
    (Note: "Stairwell" 'Standard' maps to Medium, 'Vaulted' to Large. "Hallway" 'Standard' maps to Medium, 'Long' to Large. "Closet" 'Standard' maps to Small, 'Walk-in' to Medium.)

| Room Type | Small | Medium | Large |
| :--- | :--- | :--- | :--- |
| Living Room | 4.5 hrs | 6.0 hrs | 8.0 hrs |
| Kitchen | 4.0 hrs | 5.0 hrs | 6.0 hrs |
| Bedroom | 3.0 hrs | 3.5 hrs | 4.5 hrs |
| Bathroom | 2.0 hrs | 3.0 hrs | 4.0 hrs |
| Hallway | 2.5 hrs | 3.5 hrs | 4.5 hrs |
| Stairwell | 5.0 hrs | 7.0 hrs | 9.0 hrs |
| Closet | 1.0 hrs | 1.5 hrs | 2.0 hrs |

    SECTION 2: PROPORTIONAL ADD-ON LABOR HOURS
    For each room, you will add hours for additional surfaces. These are percentages of that room's Baseline Hours.

    *Ceiling (surfaces.ceiling):
        * Add +60% of Baseline Hours.
        * If ceilingTexture is 'Textured', multiply *ceiling hours* by 1.2x.
        * If ceilingTexture is 'Popcorn', multiply *ceiling hours* by 1.5x.

    * Trim (surfaces.trim):
        * Add +70% of Baseline Hours. (This covers baseboards, window/door casings).
        * If *trimCondition* is 'Poor', multiply *trim hours* by 1.5x (for extra prep).

    * Doors (surfaces.doors):
        * If *doorStyle* is 'Slab', add +0.75 hours per *doorCount*.
        * If *doorStyle* is 'Paneled', add +1.25 hours per *doorCount*.

    SECTION 3: GLOBAL ADJUSTMENT LABOR HOURS
    These adjustments apply to the *total calculated hours for each room*.

    * Ceiling Height:
        * If *ceilingHeight* is '9-10ft', multiply *all hours for that room* by 1.15x.
        * If *ceilingHeight* is '11ft+', multiply *all hours for that room* by 1.3x.

    * Wall Condition & Color:
        * If *wallCondition* is 'Fair', add +10% to *wall hours*.
        * If *wallCondition* is 'Poor', add +25% to *wall hours*.
        * If *colorChange* is 'Dark-to-Light', add +40% to *wall hours* (for primer coat).

    * Furniture:
        * If *painting.furniture* is 'Contractor', add +1.5 hours *per room*.

    * Ignored Services:
        * You MUST ignore any data from *services.patching* and *services.installation*. This estimate is for painting only.

    SECTION 4: FINAL CALCULATION
    1.  totalHours: Sum all calculated labor hours (Baseline + Add-ons + Adjustments) for all rooms.
    2.  Total_Labor_Price: Calculate *totalHours* * 65.
    3.  Total_Material_Cost:
        * If *painting.paintProvider* is 'Standard', add +$60 *per room*.
        * If *painting.paintProvider* is 'Premium', add +$100 *per room*.
        * If *painting.paintProvider* is 'Customer', add +$0.
    4.  Final_Price: Calculate *Total_Labor_Price* + *Total_Material_Cost*.
    5.  low: Calculate *Final_Price* * 0.9 (Round to nearest integer).
    6.  high: Calculate *Final_Price* * 1.1 (Round to nearest integer).
    7.  explanation: Write a simple, 1-2 sentence summary.
        * DO NOT mention hours, percentages, or multipliers.
        * DO mention what rooms are included (e.g., "Living Room and 2 Bedrooms").
        * DO mention what surfaces (e.g., "walls, trim, and ceilings").
        * DO mention if paint is included (e.g., "and includes the cost of premium paint.").

    --- END OF RULES ---

    Here is the customer's data:
    ${customerAnswersPrompt}

    YOUR TASK:
    Analyze the customer's JSON data against my rules and return *only* a valid JSON object in the specified format. Do not include any other text.

    Required JSON Output Format:
    {
      "low": number,
      "high": number,
      "explanation": "string",
      "totalHours": number
    }
  `;

	// --- 3. Make the API Call ---
	const response = await fetch(API_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			contents: [{ parts: [{ text: mainPrompt }] }],
			generationConfig: {
				responseMimeType: 'application/json',
				// Update schema to include totalHours
				responseSchema: {
					type: 'OBJECT',
					properties: {
						low: { type: 'NUMBER' },
						high: { type: 'NUMBER' },
						explanation: { type: 'STRING' },
						totalHours: { type: 'NUMBER' }, // Added this field
					},
					required: ['low', 'high', 'explanation', 'totalHours'],
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

	try {
		const jsonText = data.candidates[0].content.parts[0].text;
		return JSON.parse(jsonText) as Estimate;
	} catch (e) {
		console.error('Failed to parse Gemini response:', e);
		throw new Error('Received an invalid estimate from the server.');
	}
};