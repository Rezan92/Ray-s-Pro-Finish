import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Using the same model version you had, or a standard stable one. 
// "gemini-1.5-flash" is excellent for this.
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;

if (!GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing in server .env file");
}

export const calculateEstimate = async (formData: any) => {
  const customerAnswersPrompt = JSON.stringify(formData);

  const mainPrompt = `
    You are an expert estimator for a high-quality painting business.
    Your labor rate is $70 per hour.
    Your goal is to provide a preliminary price range based on the user's selections.
    You must be professional, reasonable, and trustworthy.

    --- MY ESTIMATION RULES ---

    SECTION 1: BASELINE LABOR HOURS (WALLS ONLY)
    This table represents the hours for a single painter to prep and paint WALLS ONLY (2 coats) in a room. This is the baseline.
    (Note: "Stairwell" 'Standard' maps to Medium, 'Vaulted' to Large. "Hallway" 'Standard' maps to Medium, 'Long' to Large. "Closet" 'Standard' maps to Small, 'Walk-in' to Medium.)

| Room / Area | Small (Hours) | Medium (Hours) | Large (Hours) | X-Large (Hours) |
| :--- | :--- | :--- | :--- | :--- |
| Bedroom | 3.0 | 4.5 | 5.5 | 6.5 |
| Living Room | 4.5 | 6.0 | 7.5 | 9.0 |
| Dining Room | 2.5 | 4.0 | 5.0 | 6.0 |
| Kitchen¹ | 2.0 | 3.0 | 3.5 | 4.5 |
| Bathroom² | 1.5 | 2.5 | 4.0 | 5.0 |
| Office / Study | 2.0 | 3.0 | 4.0 | 4.5 |
| Basement | 6.5 | 10.0 | 13.0 | 16.0 |
| Laundry² | 1.5 | 2.0 | 2.5 | 3.0 |
| Closet³ | 0.5 | 1.5 | 3.0 | 4.0 |
| Hallway⁴ | 1.5 | 3.0 | 4.5 | 6.0 |
| Stairwell⁵ | 3.5 | 5.0 | 11.0 | 15.0 |
| Garage⁶ | 7.0 | 10.0 | 13.0 | 16.0 |
| Other | 0.5 | 2.5 | 3.5 | 6.5 |

    SECTION 2: PROPORTIONAL ADD-ON LABOR HOURS
    For each room, you will add hours for additional surfaces. These are percentages of that room's Baseline Hours.

    *Ceiling (surfaces.ceiling):
        * Add +45% of Baseline Hours.
        * If ceilingTexture is 'Textured', multiply *ceiling hours* by 1.2x.
        * If ceilingTexture is 'Popcorn', multiply *ceiling hours* by 1.5x.

    * Trim (surfaces.trim):
        * Add +80% of Baseline Hours. (This covers baseboards, window/door casings).
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
        * If *painting.furniture* is 'Contractor', add +1 hours *per room*.

    * Ignored Services:
        * You MUST ignore any data from *services.patching* and *services.installation*. This estimate is for painting only.

    SECTION 4: FINAL CALCULATION
    1.  totalHours: Sum all calculated labor hours (Baseline + Add-ons + Adjustments) for all rooms.
    2.  Total_Labor_Price: Calculate *totalHours* * 70.
    3.  Total_Material_Cost:
        * If *painting.paintProvider* is 'Standard', add +$60 *per room*.
        * If *painting.paintProvider* is 'Premium', add +$100 *per room*.
        * If *painting.paintProvider* is 'Customer', add +$0.
    4.  Final_Price: Calculate *Total_Labor_Price* + *Total_Material_Cost*.
    5.  low: Calculate *Final_Price* * 0.9 (Round to nearest integer).
    6.  high: Calculate *Final_Price* * 1.1 (Round to nearest integer).
    7.  explanation: Write a brief, user-friendly breakdown of the costs.
        * Start with a summary sentence.
        * Then, provide a bulleted list of the main cost components.
        * For each component (e.g., "Wall Painting", "Ceiling Painting", "Trim & Baseboards", "Doors", "Furniture Moving", "Paint Materials"), show the approximate cost. You can derive this from the hours and material costs you calculated.
        * Show the total number of hours for the job.
				* Include approximate how much paint is needed for the job in gallons after taking into account the customers answers.
        * Example format: "This estimate for the Living Room and 2 Bedrooms includes:\n- Walls Labor: ~$XXX\n- Trim & Doors Labor: ~$XXX\n- Premium Paint Materials: ~$XXX"

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

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: mainPrompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          // We define the schema to enforce the JSON structure
          responseSchema: {
            type: "OBJECT",
            properties: {
              low: { type: "NUMBER" },
              high: { type: "NUMBER" },
              explanation: { type: "STRING" },
              totalHours: { type: "NUMBER" },
            },
            required: ["low", "high", "explanation", "totalHours"],
          },
        },
      }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini API Error details:", errorText);
        throw new Error(`Gemini API Error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // The path to the text is different in the REST API vs the SDK
    const jsonText = data.candidates[0].content.parts[0].text;
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Estimation Service Error:", error);
    throw new Error("Failed to generate estimate");
  }
};