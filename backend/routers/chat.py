"""
AI Chatbot Router - /api/chat
"""
import uuid
from fastapi import APIRouter, HTTPException, status
from backend.schemas.schemas import ChatMessage, ChatResponse
from backend.config import settings

router = APIRouter()

# Agriculture knowledge base for demo chatbot
KNOWLEDGE_BASE = {
    "crop recommendation": {
        "keywords": ["which crop", "what crop", "crop grow", "recommend crop", "suitable crop", "best crop", "grow which"],
        "response": """🌱 **Crop Selection Advice**

For the best crop selection, consider these key factors:

• **Soil Type & pH**: Different crops need different pH. Wheat prefers 6.0-7.5, Rice 5.0-7.0
• **Season**: Kharif (June-Oct) → Rice, Cotton, Maize, Soybean | Rabi (Oct-Mar) → Wheat, Mustard, Chickpea
• **Water Availability**: Rice needs 150-300mm, Mustard only 40-100mm
• **Soil Nutrients**: Use our **Crop Recommendation Tool** — enter your soil's N, P, K values and get AI recommendations!

💡 **Tip**: Use the Crop Recommendation module to get a personalized recommendation based on YOUR soil data."""
    },
    "yellow leaves": {
        "keywords": ["yellow leaf", "leaves turning yellow", "leaf yellowing", "yellow plant", "chlorosis"],
        "response": """🍃 **Yellow Leaves — Possible Causes & Solutions**

Yellow leaves can indicate several issues:

**1. Nitrogen Deficiency** (Most common)
   - Signs: Older/lower leaves turn yellow first
   - Fix: Apply Urea @ 10g/L as foliar spray

**2. Iron/Zinc Deficiency** (In alkaline soils)
   - Signs: Young leaves yellow with green veins (interveinal chlorosis)
   - Fix: Spray ferrous sulfate @ 5g/L or zinc sulfate @ 5g/L

**3. Waterlogging**
   - Signs: Entire plant yellowing from bottom up
   - Fix: Improve drainage, open furrows

**4. Disease**
   - Consider using our **Disease Detection** tool — upload a leaf photo for AI analysis!

💡 **Action**: Run a soil test to identify exact deficiency. Visit nearest KVK for guidance."""
    },
    "irrigation": {
        "keywords": ["when to irrigate", "irrigation", "how much water", "water crop", "watering", "when water"],
        "response": """💧 **Smart Irrigation Guidance**

Irrigation timing depends on multiple factors:

**Key Indicators to Irrigate:**
• Soil moisture drops below 40-50% (crop-specific)
• Wilting visible in early morning (not heat wilting in afternoon)
• Critical growth stages: Flowering, Grain filling

**General Schedule:**
| Crop | Critical Stages | Approx. Frequency |
|------|----------------|-------------------|
| Wheat | CRI, Tillering, Flowering | Every 15-20 days |
| Rice | Transplanting, Tillering | Maintain 5cm standing water |
| Cotton | Flowering, Boll | Every 10-15 days |

**Best Time**: 5-7 AM or after 5 PM to reduce evaporation losses.

💡 Use our **Smart Irrigation** module — enter your soil moisture and get an instant recommendation!"""
    },
    "soil health": {
        "keywords": ["soil", "soil health", "soil test", "soil quality", "soil type", "improve soil"],
        "response": """🌍 **Soil Health & Improvement**

Healthy soil = healthy crops. Here's what to check:

**Key Soil Parameters:**
• **pH**: 6.0-7.5 ideal for most crops. Use lime to raise pH, sulfur to lower
• **Nitrogen (N)**: For vegetative growth. Apply Urea, DAP, or farmyard manure
• **Phosphorus (P)**: Root development & flowering. Apply DAP or SSP
• **Potassium (K)**: Disease resistance & fruit quality. Apply MOP

**How to Improve Soil:**
1. Add organic compost or farmyard manure (5-10 tonnes/acre)
2. Practice crop rotation — include legumes for nitrogen fixing
3. Avoid over-tilling — preserves soil structure
4. Mulching reduces water loss and improves organic matter

💡 **Get Soil Tested**: Visit nearest soil testing laboratory or KVK — it's usually FREE!"""
    },
    "disease": {
        "keywords": ["disease", "pest", "fungus", "infection", "spray", "insect", "fungicide"],
        "response": """🔍 **Crop Disease Management**

Early detection is key to preventing major losses!

**Common Diseases by Crop:**
• **Rice**: Blast, Brown Planthopper, Sheath Blight
• **Wheat**: Rust (Yellow/Brown/Black), Powdery Mildew
• **Cotton**: Bollworm, Whitefly, Bacterial Blight
• **Tomato**: Early Blight, Late Blight, Wilt

**Integrated Disease Management:**
1. **Monitor** fields regularly — twice a week
2. **Remove** infected plants/leaves immediately
3. **Spray** appropriate fungicide/pesticide (consult KVK)
4. **Rotate** crops to break disease cycles
5. **Use** resistant varieties when available

💡 **Best Action**: Upload a photo of the affected leaf to our **Disease Detection** module for instant AI-based analysis!"""
    },
    "rainfall": {
        "keywords": ["rain", "rainfall", "monsoon", "heavy rain", "flood", "drought"],
        "response": """🌧️ **Managing Crops During Rain/Drought**

**During Heavy Rainfall:**
• Open drainage channels immediately to prevent waterlogging
• Avoid field operations — prevents soil compaction
• Postpone spraying — rain washes away chemicals
• Check and repair bunds/levees

**During Drought/Dry Spell:**
• Prioritize irrigation at critical growth stages
• Use mulching to conserve soil moisture
• Consider drought-tolerant varieties (Chickpea, Sorghum, Pearl Millet)
• Practice deficit irrigation — 70-80% of crop water requirement

**Monsoon Preparation:**
• Clean drainage channels before monsoon
• Apply contact fungicide preventively for blast/blight diseases
• Avoid excess nitrogen before expected rain

💡 Check our **Weather Intelligence** section for 5-day forecasts and farming advisories!"""
    },
    "hello": {
        "keywords": ["hello", "hi", "hey", "namaste", "good morning", "good evening", "how are you"],
        "response": """👋 **Namaste! Welcome to SmartFarm AI Assistant!**

I'm your digital farming assistant, here to help with:

🌱 **Crop Selection** — Which crop is best for your land
🔍 **Disease Detection** — Identify crop diseases from photos
💧 **Irrigation** — When and how much to water
🌡️ **Weather** — Farming advisories based on weather
🌍 **Soil Health** — How to improve your soil
📊 **Farm Planning** — Season-wise crop planning

**Ask me anything like:**
• "Which crop should I grow in Kharif season?"
• "My wheat leaves are showing rust spots — what to do?"
• "When should I irrigate my cotton crop?"

How can I help you today? 🙏"""
    },
    "fertilizer": {
        "keywords": ["fertilizer", "manure", "urea", "dap", "npk", "compost", "organic", "nutrient"],
        "response": """🌿 **Fertilizer & Nutrient Management Guide**

**Primary Nutrients (NPK):**
• **Nitrogen (N)** → Urea (46% N) or DAP (18% N, 46% P)
  - Apply in 3 splits: Basal + 30 days + 60 days
• **Phosphorus (P)** → DAP, SSP, Rock Phosphate
  - Apply at sowing as basal dose
• **Potassium (K)** → MOP (Muriate of Potash)
  - Apply at sowing, top-up at 45 days

**Recommended Doses (General):**
| Crop | N (kg/ha) | P (kg/ha) | K (kg/ha) |
|------|-----------|-----------|-----------|
| Wheat | 120 | 60 | 40 |
| Rice | 100 | 50 | 50 |
| Maize | 150 | 75 | 75 |

**Organic Options:**
• Farmyard Manure: 10-15 tonnes/acre before planting
• Vermicompost: 2-3 tonnes/acre for high-value crops
• Bio-fertilizers (Rhizobium, PSB) — free nitrogen fixing!

💡 **Pro Tip**: Always do soil test before fertilizer application to avoid over/under-dosing."""
    },
}

DEFAULT_RESPONSE = """🤔 I understand your question about farming.

For the most accurate advice, please ask me about:
• Crop selection and recommendation
• Disease identification and management
• Irrigation timing and scheduling
• Soil health and fertilizer application
• Weather and monsoon management
• Pest management

You can also use our specialized tools:
• 🌱 **Crop Recommendation** — AI-powered crop selection
• 🔍 **Disease Detection** — Upload leaf photo for analysis
• 💧 **Smart Irrigation** — Soil-based water recommendation
• 🌡️ **Weather** — Real-time farming advisories

Feel free to rephrase your question! 🙏"""

SUGGESTIONS = [
    "Which crop is best for Kharif season?",
    "My leaves are turning yellow. What should I do?",
    "When should I irrigate my wheat crop?",
    "How to improve soil health?",
    "What to do during heavy rainfall?",
    "How do I choose the right fertilizer?",
]


def _find_response(message: str) -> str:
    """Simple keyword-based response matching."""
    message_lower = message.lower()
    
    for topic, data in KNOWLEDGE_BASE.items():
        for keyword in data["keywords"]:
            if keyword in message_lower:
                return data["response"]
    
    return DEFAULT_RESPONSE


@router.post("/", response_model=ChatResponse)
async def chat(message: ChatMessage):
    """
    SmartFarm AI Assistant — agriculture Q&A chatbot.
    
    Demo mode: keyword-based intelligent responses
    Production: connect Gemini/GPT/Llama with agriculture system prompt
    """
    if not message.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    session_id = message.session_id or str(uuid.uuid4())
    
    # Demo: keyword-based matching
    # Production: call Gemini/GPT with agriculture system prompt
    reply = _find_response(message.message)

    # Pick 3 random follow-up suggestions (excluding the current topic)
    import random
    suggestions = random.sample(SUGGESTIONS, min(3, len(SUGGESTIONS)))

    return ChatResponse(
        reply=reply,
        session_id=session_id,
        suggestions=suggestions,
        is_demo=settings.CHAT_DEMO_MODE,
    )
