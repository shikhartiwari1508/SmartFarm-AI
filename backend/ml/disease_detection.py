"""
SmartFarm AI - Disease Detection ML Module
==========================================
Architecture: Provides a clean interface for plant disease detection from images.

DEMO MODE: Returns realistic simulated predictions with disease information
           based on common Indian crop diseases.

PRODUCTION MODE: Replace the _demo_predict() with:
    - TensorFlow/Keras: model.predict(preprocessed_image)
    - PyTorch: model(tensor_image)
    - Trained on PlantVillage dataset or similar
"""
import random
from pathlib import Path
from backend.config import settings


# Common crop diseases database (for demo mode)
DISEASE_DATABASE = {
    "Rice Blast": {
        "crop": "Rice",
        "severity": "High",
        "description": "Rice blast is caused by the fungus Magnaporthe oryzae. It affects leaves, stems, and panicles, causing significant yield loss. Diamond-shaped lesions with gray centers are characteristic.",
        "causes": [
            "High humidity (>90%) combined with cool nights",
            "Excess nitrogen application",
            "Dense crop stand limiting air circulation",
            "Wind-driven rain spreading spores"
        ],
        "prevention": [
            "Use blast-resistant rice varieties",
            "Avoid excessive nitrogen — apply in splits",
            "Spray tricyclazole or isoprothiolane fungicide at early signs",
            "Maintain field sanitation — remove infected stubble"
        ],
        "next_steps": "Immediately isolate infected plants. Apply tricyclazole 75 WP @ 0.6g/L spray. Consult local Krishi Vigyan Kendra (KVK) for resistant variety recommendations."
    },
    "Wheat Rust": {
        "crop": "Wheat",
        "severity": "High",
        "description": "Wheat rust (yellow, brown, or black rust) is caused by Puccinia species. Infected plants show rust-colored pustules on leaves, reducing photosynthesis and grain filling.",
        "causes": [
            "Cool moist weather (10-20°C) favoring spore germination",
            "High humidity and dew formation",
            "Presence of susceptible varieties",
            "Wind dispersal of urediospores"
        ],
        "prevention": [
            "Grow rust-resistant varieties (HD-2967, GW-322)",
            "Apply propiconazole @ 1ml/L at first sign of rust",
            "Early sowing to avoid peak rust season",
            "Balanced fertilization — avoid excess nitrogen"
        ],
        "next_steps": "Apply mancozeb + propiconazole spray immediately. Report outbreak to local agricultural extension office. Monitor neighboring fields for spread."
    },
    "Tomato Early Blight": {
        "crop": "Tomato",
        "severity": "Medium",
        "description": "Early blight, caused by Alternaria solani, produces dark spots with concentric rings on lower leaves. It spreads upward, causing defoliation and fruit damage.",
        "causes": [
            "Warm temperatures (24-29°C) combined with wet conditions",
            "Plant stress from inadequate nutrition or water",
            "Infected plant debris in soil",
            "Overhead irrigation wetting foliage"
        ],
        "prevention": [
            "Use certified disease-free seeds and transplants",
            "Apply copper-based fungicide or mancozeb preventively",
            "Avoid overhead irrigation — use drip system",
            "Rotate crops with non-solanaceous crops"
        ],
        "next_steps": "Remove and destroy infected leaves. Spray mancozeb 75 WP @ 2.5g/L. Improve drainage and air circulation. Switch to drip irrigation if possible."
    },
    "Cotton Bollworm": {
        "crop": "Cotton",
        "severity": "High",
        "description": "Bollworm (Helicoverpa armigera) is the most destructive pest of cotton. Larvae bore into bolls, causing direct yield loss. Even BT cotton can be affected under high pest pressure.",
        "causes": [
            "High temperatures and dry conditions favor pest multiplication",
            "Resistance development in some bollworm populations",
            "Non-BT refuge areas not maintained",
            "Chemical spray schedule not followed"
        ],
        "prevention": [
            "Install pheromone traps (5 per acre) for monitoring",
            "Spray profenophos + cypermethrin at early infestation",
            "Maintain 20% non-Bt refuge crop",
            "Use HaNPV (nuclear polyhedrosis virus) for biological control"
        ],
        "next_steps": "Count bollworm egg masses — if >5/plant, spray immediately. Apply chlorantraniliprole or indoxacarb. Consult pest advisory from state agriculture department."
    },
    "Leaf Yellowing (Nutrient Deficiency)": {
        "crop": "General",
        "severity": "Low",
        "description": "Yellowing leaves (chlorosis) can indicate nitrogen deficiency (older leaves turn yellow first), iron deficiency (young leaves yellow with green veins), or magnesium deficiency (interveinal yellowing).",
        "causes": [
            "Nitrogen deficiency — inadequate fertilization",
            "Iron/zinc micronutrient deficiency in alkaline soils",
            "Poor root health due to waterlogging",
            "Disease affecting nutrient uptake"
        ],
        "prevention": [
            "Test soil for nutrient levels and apply as recommended",
            "For nitrogen deficiency: apply urea @ 10g/L as foliar spray",
            "For iron deficiency: spray ferrous sulfate @ 5g/L",
            "Ensure proper drainage to prevent waterlogging"
        ],
        "next_steps": "Conduct a soil test to identify deficiency. Apply micronutrient mixture as foliar spray. If whole plant is affected, check root health for rot or pests."
    },
    "Powdery Mildew": {
        "crop": "Vegetables / Fruits",
        "severity": "Medium",
        "description": "Powdery mildew appears as white powdery coating on leaf surfaces. Caused by various fungi (Erysiphe, Podosphaera), it reduces photosynthesis and weakens the plant.",
        "causes": [
            "High humidity with dry leaf surface",
            "Moderate temperatures (15-28°C)",
            "Dense planting with poor air circulation",
            "Susceptible crop varieties"
        ],
        "prevention": [
            "Spray wettable sulfur @ 3g/L at early stage",
            "Use carbendazim or triadimefon for severe cases",
            "Improve plant spacing for better air circulation",
            "Avoid excessive nitrogen fertilization"
        ],
        "next_steps": "Apply sulfur-based fungicide immediately. Prune overcrowded branches to improve air flow. If seed-borne, use treated seeds next season."
    },
    "Healthy Crop": {
        "crop": "General",
        "severity": "None",
        "description": "Your crop appears healthy! Leaves show normal color and no obvious disease symptoms. Continue with regular crop management practices.",
        "causes": [],
        "prevention": [
            "Continue regular field monitoring (twice weekly)",
            "Maintain balanced nutrition program",
            "Practice preventive fungicide sprays during high-risk periods",
            "Keep field sanitation — remove crop debris"
        ],
        "next_steps": "No immediate action needed. Schedule next field inspection in 7 days. Consider preventive spray if humidity remains high."
    },
}


class DiseaseDetectionML:
    """
    ML interface for plant disease detection from images.
    
    DEMO MODE: Returns realistic simulated disease predictions.
    PRODUCTION: Load TensorFlow/PyTorch model and run image inference.
    """

    def __init__(self):
        self.model = None
        self.demo_mode = settings.ML_DEMO_MODE
        if not self.demo_mode:
            self._load_model()

    def _load_model(self):
        """Load trained deep learning model."""
        try:
            import tensorflow as tf
            self.model = tf.keras.models.load_model(settings.DISEASE_MODEL_PATH)
            self.demo_mode = False
        except Exception as e:
            print(f"⚠️  Could not load disease model: {e}. Falling back to demo mode.")
            self.demo_mode = True

    def predict(self, image_path: str) -> dict:
        """
        Predict disease from uploaded image.
        
        Production: preprocess image → run model → map class index to disease name
        """
        if not self.demo_mode and self.model is not None:
            return self._model_predict(image_path)
        return self._demo_predict(image_path)

    def _demo_predict(self, image_path: str) -> dict:
        """
        Demo prediction. In production, this entire method is replaced
        with actual model inference.
        """
        # Simulate realistic confidence scores
        diseases = list(DISEASE_DATABASE.keys())
        weights = [15, 12, 18, 10, 20, 10, 15]  # Healthy most common
        chosen_disease = random.choices(diseases, weights=weights, k=1)[0]

        # Simulate confidence: healthy=high, diseases=medium-high
        if chosen_disease == "Healthy Crop":
            confidence = random.uniform(82, 96)
        else:
            confidence = random.uniform(71, 92)

        disease_info = DISEASE_DATABASE[chosen_disease]

        return {
            "disease_name": chosen_disease,
            "confidence": round(confidence, 1),
            "severity": disease_info["severity"],
            "description": disease_info["description"],
            "causes": disease_info["causes"],
            "prevention": disease_info["prevention"],
            "next_steps": disease_info["next_steps"],
            "is_demo": True,
        }

    def _model_predict(self, image_path: str) -> dict:
        """Production TensorFlow model prediction."""
        import numpy as np
        from PIL import Image

        img = Image.open(image_path).resize((224, 224))
        arr = np.array(img) / 255.0
        arr = np.expand_dims(arr, axis=0)

        predictions = self.model.predict(arr)
        class_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][class_idx]) * 100

        disease_names = list(DISEASE_DATABASE.keys())
        disease_name = disease_names[class_idx % len(disease_names)]
        disease_info = DISEASE_DATABASE[disease_name]

        return {
            "disease_name": disease_name,
            "confidence": round(confidence, 1),
            "severity": disease_info["severity"],
            "description": disease_info["description"],
            "causes": disease_info["causes"],
            "prevention": disease_info["prevention"],
            "next_steps": disease_info["next_steps"],
            "is_demo": False,
        }


# Singleton instance
disease_detector = DiseaseDetectionML()
