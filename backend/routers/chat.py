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


HINDI_RESPONSES = {
    "crop recommendation": """🌱 **फसल चुनने की सलाह**

सही फसल चुनने से पहले इन बातों पर ध्यान दें:

• **मिट्टी का प्रकार और pH:** गेहूँ के लिए सामान्यतः pH 6.0–7.5 और धान के लिए 5.0–7.0 उपयुक्त हो सकता है।
• **मौसम:** खरीफ (जून–अक्टूबर) में धान, कपास, मक्का और सोयाबीन; रबी (अक्टूबर–मार्च) में गेहूँ, सरसों और चना उगाए जाते हैं।
• **पानी और पोषक तत्व:** फसल की जरूरत मिट्टी और स्थानीय मौसम के अनुसार बदलती है।

💡 अपने खेत के NPK और pH मान डालकर फसल सुझाव टूल का उपयोग करें।""",
    "yellow leaves": """🍃 **पत्तियाँ पीली होने के संभावित कारण**

1. **नाइट्रोजन की कमी:** अक्सर पुरानी या नीचे की पत्तियाँ पहले पीली होती हैं।
2. **आयरन या जिंक की कमी:** नई पत्तियों में नसें हरी रहते हुए बाकी हिस्सा पीला हो सकता है।
3. **ज्यादा पानी:** खेत में जलभराव होने पर जड़ों को नुकसान पहुँच सकता है।
4. **रोग या कीट:** पत्तियों पर धब्बे, मुड़ना या सड़न भी देखें।

**क्या करें:** पहले खेत की जल निकासी और मिट्टी की जाँच करें। बिना पुष्टि के उर्वरक या कीटनाशक की अधिक मात्रा न डालें। जरूरत पड़ने पर नजदीकी कृषि विज्ञान केंद्र (KVK) से सलाह लें।""",
    "irrigation": """💧 **सिंचाई के लिए सामान्य सलाह**

सिंचाई का समय फसल, मिट्टी, मौसम और विकास की अवस्था पर निर्भर करता है।

• मिट्टी में नमी कम हो और बारिश की संभावना न हो तो सिंचाई की जरूरत जाँचें।
• फूल आने और दाना भरने जैसी अवस्थाओं में पानी की कमी से नुकसान हो सकता है।
• जहाँ संभव हो, सुबह जल्दी या शाम को सिंचाई करें ताकि पानी का वाष्पीकरण कम हो।
• धान, गेहूँ और कपास की पानी की जरूरत अलग-अलग होती है।

💡 अधिक उपयुक्त सुझाव के लिए स्मार्ट सिंचाई मॉड्यूल में अपनी फसल और मिट्टी की जानकारी भरें।""",
    "soil health": """🌍 **मिट्टी की सेहत कैसे सुधारें**

• मिट्टी की pH और NPK जाँच कराएँ।
• सड़ी हुई गोबर की खाद या कम्पोस्ट का उचित मात्रा में उपयोग करें।
• दलहनी फसलों के साथ फसल चक्र अपनाएँ।
• खेत में जल निकासी ठीक रखें और जरूरत से ज्यादा खाद न डालें।
• उर्वरक की मात्रा मिट्टी की जाँच और स्थानीय कृषि सलाह के अनुसार तय करें।

💡 नजदीकी मिट्टी परीक्षण प्रयोगशाला या कृषि विज्ञान केंद्र से संपर्क करें।""",
    "disease": """🔍 **फसल में रोग या कीट का प्रबंधन**

• खेत का नियमित निरीक्षण करें और लक्षणों की फोटो लें।
• संक्रमित पत्तियों, धब्बों और कीटों की पहचान करने की कोशिश करें।
• रोग की पुष्टि के बिना तेज रसायन या कीटनाशक का इस्तेमाल न करें।
• साफ औजार, उचित जल निकासी और फसल चक्र मदद कर सकते हैं।
• समस्या फैल रही हो तो कृषि विशेषज्ञ या KVK से सलाह लें।

💡 आप रोग पहचान मॉड्यूल में प्रभावित पत्ती की फोटो अपलोड कर सकते हैं।""",
    "rainfall": """🌧️ **बारिश और सूखे के दौरान फसल की देखभाल**

**तेज बारिश में:**
• खेत से अतिरिक्त पानी निकालने की व्यवस्था करें।
• गीली मिट्टी में अनावश्यक काम करने से बचें।
• बारिश के ठीक पहले छिड़काव करने से बचें।

**सूखे में:**
• पानी का उपयोग महत्वपूर्ण विकास अवस्थाओं में प्राथमिकता से करें।
• मिट्टी की नमी बनाए रखने के लिए मल्चिंग पर विचार करें।
• स्थानीय मौसम पूर्वानुमान और कृषि सलाह देखते रहें।

💡 मौसम मॉड्यूल में पूर्वानुमान और कृषि सलाह देखें।""",
    "hello": """🙏 **नमस्ते! SmartFarm AI में आपका स्वागत है।**

मैं खेती से जुड़े सवालों में आपकी मदद कर सकता हूँ:

🌱 फसल चुनना और फसल सुझाव
🔍 फसल के रोग और कीट
💧 सिंचाई का समय
🌦️ मौसम के अनुसार खेती
🌍 मिट्टी और उर्वरक प्रबंधन

अपना सवाल लिखें—जैसे “मेरी गेहूँ की पत्तियाँ पीली हो रही हैं, क्या करूँ?”""",
    "fertilizer": """🌿 **उर्वरक और पोषक तत्व प्रबंधन**

• नाइट्रोजन (N) पत्तियों और बढ़वार में मदद करता है।
• फॉस्फोरस (P) जड़ों और फूल बनने के लिए जरूरी है।
• पोटैशियम (K) पौधों की मजबूती और गुणवत्ता में मदद करता है।
• गोबर की सड़ी खाद और कम्पोस्ट मिट्टी की संरचना सुधार सकते हैं।

**ध्यान दें:** उर्वरक की सही मात्रा फसल, मिट्टी की जाँच और विकास अवस्था पर निर्भर करती है। अधिक मात्रा में खाद डालने से नुकसान हो सकता है। मिट्टी की जाँच के आधार पर स्थानीय कृषि विशेषज्ञ की सलाह लें।"""
}
HINDI_DEFAULT_RESPONSE = """🙏 मैं खेती से जुड़े सवालों में मदद कर सकता हूँ।

आप मुझसे इन विषयों पर पूछ सकते हैं:
• फसल का चुनाव और फसल सुझाव
• फसल में रोग और कीट
• सिंचाई का समय और पानी का प्रबंधन
• मिट्टी की सेहत और उर्वरक
• मौसम और बारिश के अनुसार खेती

आप अपना सवाल थोड़े विस्तार से लिखें ताकि मैं बेहतर सहायता कर सकूँ।"""

HINDI_SUGGESTIONS = [
    "खरीफ में कौन-सी फसल उगाना सही रहेगा?",
    "मेरी फसल के पत्ते पीले हो रहे हैं, क्या करूँ?",
    "गेहूँ में सिंचाई कब करनी चाहिए?",
    "मिट्टी की सेहत कैसे सुधारें?",
    "तेज बारिश में फसल की देखभाल कैसे करें?",
    "सही उर्वरक कैसे चुनें?",
]

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


def _find_response(message: str, language: str = "hi") -> str:
    """Return a demo response in the selected language."""
    message_lower = message.lower()

    hindi_keywords = {
        "crop recommendation": ["खरीफ", "रबी", "कौन सी फसल", "कौन-सी फसल", "फसल सुझाव", "क्या उगाऊँ", "कौन सी उगाऊँ"],
        "yellow leaves": ["पीले पत्ते", "पत्ते पीले", "पत्तियाँ पीली", "पत्ती पीली", "पीली हो", "पत्ते पीले हो"],
        "irrigation": ["सिंचाई", "पानी कब", "पानी देना", "कितना पानी"],
        "soil health": ["मिट्टी", "मृदा", "मिट्टी की सेहत", "मिट्टी की जाँच"],
        "disease": ["रोग", "बीमारी", "कीट", "फफूंद", "दाग", "संक्रमण"],
        "rainfall": ["बारिश", "वर्षा", "सूखा", "तेज बारिश", "भारी बारिश"],
        "hello": ["नमस्ते", "नमस्कार", "हैलो", "हाय", "कैसे हो"],
        "fertilizer": ["खाद", "उर्वरक", "यूरिया", "डीएपी", "एनपीके", "कम्पोस्ट"],
    }

    for topic, data in KNOWLEDGE_BASE.items():
        keywords = list(data["keywords"])
        if language == "hi":
            keywords.extend(hindi_keywords.get(topic, []))
        if any(keyword in message_lower for keyword in keywords):
            return HINDI_RESPONSES.get(topic, HINDI_DEFAULT_RESPONSE) if language == "hi" else data["response"]

    return HINDI_DEFAULT_RESPONSE if language == "hi" else DEFAULT_RESPONSE


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
    reply = _find_response(message.message, message.language)

    # Pick 3 random follow-up suggestions (excluding the current topic)
    import random
    suggestion_pool = HINDI_SUGGESTIONS if message.language == "hi" else SUGGESTIONS
    suggestions = random.sample(suggestion_pool, min(3, len(suggestion_pool)))

    return ChatResponse(
        reply=reply,
        session_id=session_id,
        suggestions=suggestions,
        is_demo=settings.CHAT_DEMO_MODE,
    )
