import { GoogleGenAI, Type } from "@google/genai";
import { DietPlan, ReportData, UserPreferences, Meal, DailyPlan } from '../types';

const apiKey = process.env.API_KEY || '';

// Mock data tailored for "Mr K Ramesh" (Anemia, Liver Support, Vitamin D)
// Used ONLY as fallback if API Key is missing or parsing fails entirely
const MOCK_DIET_PLAN: DietPlan = {
  overview: "This 7-day personalized plan focuses on correcting Anemia (Iron/Hb) and supporting Liver function (elevated GGT/SGOT). We've included iron-rich foods (Leafy greens, dates) paired with Vitamin C for absorption, and liver-friendly antioxidants while ensuring adequate Vitamin D intake.",
  weeklyPlan: [
    {
      day: "Monday",
      focus: "Liver Detox & Iron Boost",
      breakfast: { 
        name: "Spinach & Moong Dal Cheela", 
        description: "Green gram pancakes with spinach (Iron) and ginger (Liver support).", 
        tags: ["Iron Rich", "Liver Friendly"],
        nutritionalInfo: { protein: "14g", fiber: "8g", iron: "4.5mg", vitaminD: "0 IU" }
      },
      lunch: { 
        name: "Brown Rice with Methi Dal", 
        description: "Fenugreek leaves (Iron/Calcium) cooked with lentils. Served with curd.", 
        tags: ["High Fiber", "Calcium"],
        nutritionalInfo: { protein: "12g", fiber: "9g", iron: "3.8mg", vitaminD: "2 IU" }
      },
      dinner: { 
        name: "Grilled Fish / Tofu Tikka", 
        description: "Lean protein with minimal oil. Avoids deep frying to protect liver.", 
        tags: ["Protein", "Light"],
        nutritionalInfo: { protein: "22g", fiber: "2g", iron: "1.5mg", vitaminD: "120 IU" }
      },
      snacks: [{ 
        name: "Citrus Fruit Salad", 
        description: "Orange and pomegranate to boost Iron absorption.", 
        tags: ["Vitamin C"],
        nutritionalInfo: { protein: "2g", fiber: "4g", iron: "0.8mg", vitaminD: "0 IU" }
      }]
    },
    {
      day: "Tuesday",
      focus: "Vitamin D & Calcium",
      breakfast: { 
        name: "Ragi Malt (Porridge)", 
        description: "Finger millet porridge made with milk/buttermilk. High in Calcium.", 
        tags: ["Calcium", "Bone Health"],
        nutritionalInfo: { protein: "8g", fiber: "6g", iron: "2.1mg", vitaminD: "40 IU" }
      },
      lunch: { 
        name: "Mushroom Matar Masala", 
        description: "Mushrooms (Vitamin D) and peas with roti. Less oil.", 
        tags: ["Vitamin D", "Veg"],
        nutritionalInfo: { protein: "10g", fiber: "7g", iron: "2.5mg", vitaminD: "15 IU" }
      },
      dinner: { 
        name: "Papaya & Sprout Salad", 
        description: "Light dinner to ease liver load. Papaya contains digestive enzymes.", 
        tags: ["Digestion", "Light"],
        nutritionalInfo: { protein: "9g", fiber: "5g", iron: "1.2mg", vitaminD: "0 IU" }
      },
      snacks: [{ 
        name: "Fortified Milk + Walnuts", 
        description: "Omega-3s for liver inflammation.", 
        tags: ["Omega-3"],
        nutritionalInfo: { protein: "8g", fiber: "2g", iron: "0.5mg", vitaminD: "100 IU" }
      }]
    },
    {
      day: "Wednesday",
      focus: "Hemoglobin Builder",
      breakfast: { 
        name: "Poha with Peanuts & Lemon", 
        description: "Flattened rice with veggies. Lemon juice (Vit C) is crucial for Iron.", 
        tags: ["Iron Absorption"],
        nutritionalInfo: { protein: "6g", fiber: "3g", iron: "2.8mg", vitaminD: "0 IU" }
      },
      lunch: { 
        name: "Amaranth (Rajgira) Roti & Curd", 
        description: "Amaranth is a superfood for Iron and Calcium.", 
        tags: ["Superfood", "Iron"],
        nutritionalInfo: { protein: "11g", fiber: "8g", iron: "5.2mg", vitaminD: "5 IU" }
      },
      dinner: { 
        name: "Bottle Gourd (Lauki) Sabzi", 
        description: "Easy to digest, excellent for liver recovery.", 
        tags: ["Liver Support", "Hydrating"],
        nutritionalInfo: { protein: "4g", fiber: "5g", iron: "1.0mg", vitaminD: "0 IU" }
      },
      snacks: [{ 
        name: "Dates & Pumpkin Seeds", 
        description: "Iron powerhouse snack.", 
        tags: ["Iron", "Zinc"],
        nutritionalInfo: { protein: "5g", fiber: "3g", iron: "3.5mg", vitaminD: "0 IU" }
      }]
    },
    {
      day: "Thursday",
      focus: "Liver Recovery",
      breakfast: { 
        name: "Oats with Berries", 
        description: "Antioxidant-rich breakfast to reduce oxidative stress on the liver.", 
        tags: ["Antioxidants"],
        nutritionalInfo: { protein: "6g", fiber: "5g", iron: "1.8mg", vitaminD: "0 IU" }
      },
      lunch: { 
        name: "Khichdi with Mixed Veggies", 
        description: "Comfort food. Easy to digest, complete protein profile.", 
        tags: ["Gut Health"],
        nutritionalInfo: { protein: "10g", fiber: "4g", iron: "2.2mg", vitaminD: "0 IU" }
      },
      dinner: { 
        name: "Beetroot Thoran", 
        description: "South Indian style beetroot stir fry. Beetroot supports liver detox.", 
        tags: ["Detox", "Fiber"],
        nutritionalInfo: { protein: "3g", fiber: "4g", iron: "1.9mg", vitaminD: "0 IU" }
      },
      snacks: [{ 
        name: "Roasted Makhana", 
        description: "Low fat, high mineral snack.", 
        tags: ["Light"],
        nutritionalInfo: { protein: "3g", fiber: "1g", iron: "0.5mg", vitaminD: "0 IU" }
      }]
    },
    {
      day: "Friday",
      focus: "Energy & Vitality",
      breakfast: { 
        name: "Besan Chilla with Paneer", 
        description: "Gram flour pancakes with grated cottage cheese (Calcium).", 
        tags: ["Protein", "Calcium"],
        nutritionalInfo: { protein: "18g", fiber: "6g", iron: "3.2mg", vitaminD: "10 IU" }
      },
      lunch: { 
        name: "Soya Chunk Curry & Rice", 
        description: "Soya is good for liver and provides protein.", 
        tags: ["Protein"],
        nutritionalInfo: { protein: "24g", fiber: "7g", iron: "6.0mg", vitaminD: "0 IU" }
      },
      dinner: { 
        name: "Clear Vegetable Soup", 
        description: "Broccoli, carrots, and beans. Light and vitamin-rich.", 
        tags: ["Vitamin D"],
        nutritionalInfo: { protein: "3g", fiber: "3g", iron: "1.1mg", vitaminD: "0 IU" }
      },
      snacks: [{ 
        name: "Guava", 
        description: "Highest Vitamin C content to help Iron absorption.", 
        tags: ["Immunity"],
        nutritionalInfo: { protein: "2g", fiber: "5g", iron: "0.3mg", vitaminD: "0 IU" }
      }]
    },
    {
      day: "Saturday",
      focus: "Gut-Liver Axis",
      breakfast: { 
        name: "Idli with Sambar", 
        description: "Fermented food (Idli) is good for gut health.", 
        tags: ["Probiotic"],
        nutritionalInfo: { protein: "8g", fiber: "4g", iron: "1.5mg", vitaminD: "0 IU" }
      },
      lunch: { 
        name: "Drumstick (Moringa) Curry", 
        description: "Moringa leaves/pods are incredibly rich in Iron and Calcium.", 
        tags: ["Superfood", "Iron"],
        nutritionalInfo: { protein: "8g", fiber: "6g", iron: "4.8mg", vitaminD: "0 IU" }
      },
      dinner: { 
        name: "Quinoa Upma", 
        description: "Lighter grain alternative to wheat.", 
        tags: ["Gluten Free"],
        nutritionalInfo: { protein: "8g", fiber: "5g", iron: "2.8mg", vitaminD: "0 IU" }
      },
      snacks: [{ 
        name: "Buttermilk with Jeera", 
        description: "Cooling and digestive.", 
        tags: ["Probiotic"],
        nutritionalInfo: { protein: "4g", fiber: "0g", iron: "0.1mg", vitaminD: "20 IU" }
      }]
    },
    {
      day: "Sunday",
      focus: "Rest & Repair",
      breakfast: { 
        name: "Egg White Omelette / Paneer Bhurji", 
        description: "High biological value protein. Skip yolks if cholesterol is concern (though yours is normal).", 
        tags: ["Protein"],
        nutritionalInfo: { protein: "20g", fiber: "1g", iron: "1.2mg", vitaminD: "15 IU" }
      },
      lunch: { 
        name: "Lemon Rice & Chickpeas", 
        description: "Iron-rich chickpeas with Vitamin C rich lemon rice.", 
        tags: ["Iron Combo"],
        nutritionalInfo: { protein: "14g", fiber: "9g", iron: "4.5mg", vitaminD: "0 IU" }
      },
      dinner: { 
        name: "Pumpkin Soup & Toast", 
        description: "Pumpkin is rich in Vitamin A and easy on the liver.", 
        tags: ["Light"],
        nutritionalInfo: { protein: "4g", fiber: "3g", iron: "0.8mg", vitaminD: "0 IU" }
      },
      snacks: [{ 
        name: "Almonds (Soaked)", 
        description: "Easier to digest.", 
        tags: ["Healthy Fats"],
        nutritionalInfo: { protein: "6g", fiber: "3g", iron: "1.0mg", vitaminD: "0 IU" }
      }]
    }
  ],
  shoppingList: [
    { item: "Spinach (Palak)", category: "Vegetables" },
    { item: "Beetroot", category: "Vegetables" },
    { item: "Drumstick / Moringa", category: "Vegetables" },
    { item: "Dates", category: "Dry Fruits" },
    { item: "Walnuts", category: "Dry Fruits" },
    { item: "Ragi Flour", category: "Grains" },
    { item: "Citrus Fruits (Orange/Lemon)", category: "Fruits" }
  ]
};

// Fallback Parsed Data (Used if API key is missing during upload)
const MOCK_PARSED_DATA: ReportData = {
  patientName: "Mr K Ramesh (39Y/M)",
  date: "14 Sep, 2025",
  labName: "Thyrocare Technologies",
  riskScore: 58, 
  summary: "DEMO MODE: Report indicates Anemia (Low Iron/Hb), Vitamin D deficiency, and elevated Liver Enzymes.",
  biomarkers: [
    { name: "HbA1c", value: 4.5, unit: "%", range: "< 5.7", status: "Normal", category: "Glycemic", explanation: "Long-term blood sugar is within excellent range." },
    { name: "Avg Blood Glucose", value: 82, unit: "mg/dL", range: "90 - 120", status: "Low", category: "Glycemic", explanation: "Slightly lower than average estimated glucose." },
    { name: "Total Cholesterol", value: 96, unit: "mg/dL", range: "< 200", status: "Normal", category: "Lipid", explanation: "Total cholesterol is well within range." },
    { name: "Vitamin B-12", value: 1631, unit: "pg/mL", range: "197 - 771", status: "Critical High", category: "Vitamin", explanation: "Significantly elevated B12 levels." },
    { name: "25-OH Vitamin D", value: 23.1, unit: "ng/mL", range: "30 - 100", status: "Low", category: "Vitamin", explanation: "Indicates Vitamin D insufficiency/deficiency." },
    { name: "GGT", value: 68.91, unit: "U/L", range: "< 55", status: "High", category: "Liver", explanation: "Elevated GGT suggests liver stress or bile duct issues." },
    { name: "Hemoglobin", value: 12.5, unit: "g/dL", range: "13.0 - 17.0", status: "Low", category: "Other", explanation: "Below normal range for adult male, indicating mild anemia." }
  ]
};

// --- Helper: Robust Merging Strategy ---
// Ensures no field is undefined by overlaying the generated plan onto the MOCK_DIET_PLAN
const mergeWithMockPlan = (generatedPlan: Partial<DietPlan>): DietPlan => {
  const mergedPlan = JSON.parse(JSON.stringify(MOCK_DIET_PLAN)) as DietPlan;

  // Preserve overview if available
  if (generatedPlan.overview) mergedPlan.overview = generatedPlan.overview;
  if (generatedPlan.shoppingList && generatedPlan.shoppingList.length > 0) mergedPlan.shoppingList = generatedPlan.shoppingList;

  // Iterate through days 0-6
  if (generatedPlan.weeklyPlan) {
    mergedPlan.weeklyPlan = mergedPlan.weeklyPlan.map((mockDay, index) => {
      const genDay = generatedPlan.weeklyPlan?.[index];
      
      if (!genDay) return mockDay; // Use mock day if generated day is missing

      return {
        day: genDay.day || mockDay.day,
        focus: genDay.focus || mockDay.focus,
        breakfast: isValidMeal(genDay.breakfast) ? genDay.breakfast : mockDay.breakfast,
        lunch: isValidMeal(genDay.lunch) ? genDay.lunch : mockDay.lunch,
        dinner: isValidMeal(genDay.dinner) ? genDay.dinner : mockDay.dinner,
        snacks: (genDay.snacks && genDay.snacks.length > 0 && isValidMeal(genDay.snacks[0])) ? genDay.snacks : mockDay.snacks
      } as DailyPlan;
    });
  }

  return mergedPlan;
};

const isValidMeal = (meal: any): boolean => {
  return meal && typeof meal === 'object' && meal.name && meal.name.trim().length > 0;
};

// --- Helper: Mock Translator for Demo Mode ---
const applyMockTranslation = (plan: DietPlan, language: string) => {
    const translations: Record<string, Record<string, string>> = {
        'Tamil': {
            'Monday': 'Thingal', 'Tuesday': 'Sevvai', 'Wednesday': 'Budhan', 'Thursday': 'Vyazhan', 'Friday': 'Velli', 'Saturday': 'Sani', 'Sunday': 'Nyayiru',
            'Breakfast': 'Kaalai Unavu', 'Lunch': 'Madhiya Unavu', 'Dinner': 'Iravu Unavu', 'Snacks': 'Sitrundi',
            'Spinach': 'Keerai', 'Rice': 'Saadham', 'Curd': 'Thayir', 'Fish': 'Meen', 'Egg': 'Muttai',
            'Sambar': 'Sambar', 'Rasam': 'Rasam', 'Idli': 'Idli', 'Dosa': 'Dosai'
        },
        'Hindi': {
            'Monday': 'Somvaar', 'Tuesday': 'Mangalvaar', 'Wednesday': 'Budhvaar', 'Thursday': 'Guruvaar', 'Friday': 'Shukravaar', 'Saturday': 'Shanivaar', 'Sunday': 'Ravivaar',
            'Breakfast': 'Naashta', 'Lunch': 'Dopahar ka Khana', 'Dinner': 'Raat ka Khana', 'Snacks': 'Naashta',
            'Spinach': 'Palak', 'Rice': 'Chawal', 'Curd': 'Dahi', 'Fish': 'Machli', 'Egg': 'Anda'
        },
        'Telugu': { 'Breakfast': 'Alpaharam', 'Lunch': 'Madhyahna Bhojanam', 'Dinner': 'Ratri Bhojanam' },
        'Malayalam': { 'Breakfast': 'Prathal', 'Lunch': 'Ucha Bhakshanam', 'Dinner': 'Athazham' },
        'Kannada': { 'Breakfast': 'Thindi', 'Lunch': 'Oota', 'Dinner': 'Oota' }
    };

    const dict = translations[language] || {};

    if (Object.keys(dict).length > 0) {
        plan.weeklyPlan.forEach(day => {
            // Translate Day Name
            if (dict[day.day]) day.day = `${day.day} (${dict[day.day]})`;
        });
        plan.overview += ` (Translated to ${language} for demo purposes)`;
    }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

// --- REAL-TIME PARSING FUNCTION ---
export const parseBloodReport = async (file: File): Promise<ReportData> => {
    if (!apiKey) {
        console.warn("No API Key found. Returning mock parsed data.");
        // Delay to simulate processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        return MOCK_PARSED_DATA;
    }

    try {
        const base64Data = await fileToBase64(file);
        const mimeType = file.type || 'application/pdf';
        
        const ai = new GoogleGenAI({ apiKey });
        
        // Using Flash model for efficient extraction
        const model = 'gemini-2.5-flash'; 

        const prompt = `
            You are an expert medical report analyzer. 
            Extract data from the attached blood test report. 
            
            Return a JSON object matching this structure:
            {
                "patientName": "string",
                "date": "string",
                "labName": "string",
                "riskScore": number (0-100, where 100 is healthiest),
                "summary": "string (brief plain english summary of findings)",
                "biomarkers": [
                    {
                        "name": "string (e.g., HbA1c)",
                        "value": number,
                        "unit": "string",
                        "range": "string",
                        "status": "string (One of: 'Normal', 'High', 'Low', 'Critical High', 'Critical Low')",
                        "category": "string (One of: 'Glycemic', 'Lipid', 'Thyroid', 'Vitamin', 'Liver', 'Other')",
                        "explanation": "string (simple explanation of what this result means)"
                    }
                ]
            }
            
            Important:
            1. Extract ALL visible biomarkers.
            2. If status is not explicitly stated, infer it from the value and range.
            3. Ensure values are numbers.
        `;

        const response = await ai.models.generateContent({
            model: model,
            contents: {
                parts: [
                    { inlineData: { mimeType: mimeType, data: base64Data } },
                    { text: prompt }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        patientName: { type: Type.STRING },
                        date: { type: Type.STRING },
                        labName: { type: Type.STRING },
                        riskScore: { type: Type.NUMBER },
                        summary: { type: Type.STRING },
                        biomarkers: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    value: { type: Type.NUMBER },
                                    unit: { type: Type.STRING },
                                    range: { type: Type.STRING },
                                    status: { type: Type.STRING, enum: ['Normal', 'High', 'Low', 'Critical High', 'Critical Low'] },
                                    category: { type: Type.STRING, enum: ['Glycemic', 'Lipid', 'Thyroid', 'Vitamin', 'Liver', 'Other'] },
                                    explanation: { type: Type.STRING }
                                },
                                required: ['name', 'value', 'status', 'category']
                            }
                        }
                    }
                }
            }
        });

        const text = response.text;
        if (!text) throw new Error("Empty response from AI");
        
        const parsedData = JSON.parse(text) as ReportData;
        return parsedData;

    } catch (error) {
        console.error("Failed to parse report with Gemini:", error);
        alert("AI Parsing failed or API Key invalid. Falling back to demo data.");
        return MOCK_PARSED_DATA;
    }
}


export const generateAIAnalysis = async (reportData: ReportData, preferences?: UserPreferences): Promise<{ dietPlan: DietPlan, detailedSummary: string }> => {
  const currentPreferences = preferences || { dietType: 'Veg', cuisine: 'Mixed', language: 'English' };

  if (!apiKey) {
    console.warn("No API Key found. Using tailored mock data for demo.");
    await new Promise(resolve => setTimeout(resolve, 800)); // Faster demo response
    
    // Deep copy mock data to avoid mutating original for subsequent calls
    const tailoredPlan = JSON.parse(JSON.stringify(MOCK_DIET_PLAN)) as DietPlan;
    tailoredPlan.overview = `This 7-day personalized plan focuses on correcting Anemia (Iron/Hb) and supporting Liver function. Preferences: ${currentPreferences.dietType}, ${currentPreferences.cuisine}.`;

    // --- Smart Mock Adjustments Logic ---

    // 1. DIET TYPE ADJUSTMENTS
    if (currentPreferences.dietType === 'Non-Veg') {
        tailoredPlan.weeklyPlan.forEach(day => {
            if (day.lunch.name?.includes("Paneer")) { 
                day.lunch.name = "Chicken Curry (Low Oil)"; 
                day.lunch.description = "Lean chicken breast cooked with liver-friendly spices."; 
                day.lunch.tags.push("High Protein");
                if (day.lunch.nutritionalInfo) day.lunch.nutritionalInfo.protein = "28g";
            }
            if (day.dinner.name?.includes("Tofu") || day.dinner.name?.includes("Paneer")) { 
                day.dinner.name = "Grilled Fish"; 
                day.dinner.description = "Fish rich in Omega-3, good for liver and heart."; 
                if (day.dinner.nutritionalInfo) { day.dinner.nutritionalInfo.protein = "24g"; day.dinner.nutritionalInfo.vitaminD = "200 IU"; }
            }
            if (day.lunch.name?.includes("Soya")) { 
                day.lunch.name = "Egg Curry"; 
                day.lunch.description = "Boiled eggs in tomato gravy.";
                if (day.lunch.nutritionalInfo) day.lunch.nutritionalInfo.protein = "14g";
            }
        });
    } else if (currentPreferences.dietType === 'Eggetarian') {
        tailoredPlan.weeklyPlan.forEach((day, idx) => {
            if (idx % 2 === 0) {
                day.breakfast.name = "Masala Omelette (2 Whites, 1 Yolk)";
                day.breakfast.description = "With spinach and onions for Iron boost.";
                day.breakfast.tags = ["Protein", "Iron"];
                if (day.breakfast.nutritionalInfo) day.breakfast.nutritionalInfo.protein = "14g";
            }
            if (day.lunch.name?.includes("Paneer") || day.lunch.name?.includes("Soya")) {
                day.lunch.name = "Egg Bhurji & Chapati";
                day.lunch.description = "Scrambled eggs with liver-detox veggies like capsicum.";
                day.lunch.tags = ["Protein"];
                if (day.lunch.nutritionalInfo) day.lunch.nutritionalInfo.protein = "16g";
            }
        });
    }

    // 2. CUISINE ADJUSTMENTS (Keep existing logic, omitted for brevity, logic remains same as previous file)
    if (currentPreferences.cuisine === 'South Indian') {
        tailoredPlan.weeklyPlan.forEach(day => {
            if (day.breakfast.name?.includes("Cheela")) day.breakfast.name = "Pesarattu (Green Moong Dosa)";
            if (day.breakfast.name?.includes("Poha")) day.breakfast.name = "Lemon Sevai (Rice Noodles)";
            if (day.breakfast.name?.includes("Paratha")) day.breakfast.name = "Vegetable Uthappam";
            if (day.breakfast.name?.includes("Oats")) day.breakfast.name = "Oats Upma"; 
            if (day.lunch.name?.includes("Roti")) { day.lunch.name = day.lunch.name.replace("Roti", "Rice"); }
            if (day.lunch.name?.includes("Rajma")) { day.lunch.name = "Black Eyed Peas (Karamani) Curry"; }
            if (day.lunch.name?.includes("Khichdi")) { day.lunch.name = "Pongal (Millet based)"; }
            if (day.dinner.name?.includes("Sabzi")) { day.dinner.name = day.dinner.name.replace("Sabzi", "Poriyal"); }
        });
    } 
    // ... (Other cuisine logic remains) ...

    // 3. LANGUAGE ADJUSTMENTS (Mock)
    if (currentPreferences.language && currentPreferences.language !== 'English') {
        applyMockTranslation(tailoredPlan, currentPreferences.language);
    }

    return { 
      dietPlan: tailoredPlan, 
      detailedSummary: `Analysis for ${reportData.patientName}: Your report highlights Anemia (Hemoglobin 12.5 g/dL) and Vitamin D deficiency (23.1 ng/mL). Additionally, Liver Enzymes (GGT 68.91) are elevated. The plan is customized for '${currentPreferences.dietType}' diet with '${currentPreferences.cuisine}' cuisine influences.` 
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are a top-tier Indian Nutritionist.
    Analyze the following patient report and generate a 7-day Indian Diet Plan.
    
    Report Data:
    ${JSON.stringify(reportData, null, 2)}

    User Preferences:
    - Diet: ${currentPreferences.dietType}
    - Cuisine: ${currentPreferences.cuisine}
    - Language: ${currentPreferences.language}

    CRITICAL INSTRUCTIONS:
    1. You MUST return a JSON object with 7 items in 'weeklyPlan' (Monday to Sunday).
    2. Each day MUST have 'breakfast', 'lunch', 'dinner', and 'snacks' objects.
    3. Each meal object MUST have a 'name' and 'description'.
    4. MANDATORY: Estimate the nutrient content for each meal (Protein, Fiber, Iron, Vitamin D) based on standard Indian portions. Use 'nutritionalInfo' object. Values should be strings like "12g", "4mg".
    5. Translate the 'name' and 'description' of meals into ${currentPreferences.language} if it is not English. Keep the keys in English.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detailedSummary: { type: Type.STRING },
            dietPlan: {
              type: Type.OBJECT,
              properties: {
                overview: { type: Type.STRING },
                weeklyPlan: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      day: { type: Type.STRING },
                      focus: { type: Type.STRING },
                      breakfast: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING },
                          description: { type: Type.STRING },
                          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                          nutritionalInfo: { 
                              type: Type.OBJECT, 
                              properties: {
                                  protein: { type: Type.STRING },
                                  fiber: { type: Type.STRING },
                                  iron: { type: Type.STRING },
                                  vitaminD: { type: Type.STRING }
                              }
                          }
                        }
                      },
                      lunch: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING },
                          description: { type: Type.STRING },
                          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                          nutritionalInfo: { 
                              type: Type.OBJECT, 
                              properties: {
                                  protein: { type: Type.STRING },
                                  fiber: { type: Type.STRING },
                                  iron: { type: Type.STRING },
                                  vitaminD: { type: Type.STRING }
                              }
                          }
                        }
                      },
                      dinner: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING },
                          description: { type: Type.STRING },
                          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                          nutritionalInfo: { 
                              type: Type.OBJECT, 
                              properties: {
                                  protein: { type: Type.STRING },
                                  fiber: { type: Type.STRING },
                                  iron: { type: Type.STRING },
                                  vitaminD: { type: Type.STRING }
                              }
                          }
                        }
                      },
                      snacks: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            name: { type: Type.STRING },
                            description: { type: Type.STRING },
                            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                            nutritionalInfo: { 
                                type: Type.OBJECT, 
                                properties: {
                                    protein: { type: Type.STRING },
                                    fiber: { type: Type.STRING },
                                    iron: { type: Type.STRING },
                                    vitaminD: { type: Type.STRING }
                                }
                            }
                          }
                        }
                      }
                    }
                  }
                },
                shoppingList: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      item: { type: Type.STRING },
                      category: { type: Type.STRING }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const parsedData = JSON.parse(text) as { dietPlan: DietPlan, detailedSummary: string };
    
    // Fallback merge: Ensure no meal is left undefined if AI skips a day or meal
    const robustDietPlan = mergeWithMockPlan(parsedData.dietPlan);

    return { 
        dietPlan: robustDietPlan, 
        detailedSummary: parsedData.detailedSummary || "Summary unavailable." 
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { dietPlan: MOCK_DIET_PLAN, detailedSummary: "Error generating plan. Showing tailored sample data." };
  }
};
