"""
SQLAlchemy models - all in one file for simplicity
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from backend.database import Base


class Farmer(Base):
    __tablename__ = "farmers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), unique=True, index=True)
    location = Column(String(200))
    state = Column(String(100))
    district = Column(String(100))
    experience_years = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    farms = relationship("Farm", back_populates="farmer")


class Farm(Base):
    __tablename__ = "farms"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id"), nullable=False)
    name = Column(String(100))
    area_acres = Column(Float)
    soil_type = Column(String(50))
    irrigation_type = Column(String(50))
    location = Column(String(200))
    latitude = Column(Float)
    longitude = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)

    farmer = relationship("Farmer", back_populates="farms")


class SoilData(Base):
    __tablename__ = "soil_data"

    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id"), nullable=False)
    nitrogen = Column(Float)
    phosphorus = Column(Float)
    potassium = Column(Float)
    ph = Column(Float)
    organic_matter = Column(Float)
    moisture = Column(Float)
    recorded_at = Column(DateTime, default=datetime.utcnow)


class CropRecommendation(Base):
    __tablename__ = "crop_recommendations"

    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id"), nullable=True)
    nitrogen = Column(Float)
    phosphorus = Column(Float)
    potassium = Column(Float)
    ph = Column(Float)
    temperature = Column(Float)
    humidity = Column(Float)
    rainfall = Column(Float)
    season = Column(String(50))
    recommended_crop = Column(String(100))
    suitability_score = Column(Float)
    alternative_crops = Column(JSON)
    tips = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


class DiseaseDetection(Base):
    __tablename__ = "disease_detections"

    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id"), nullable=True)
    image_path = Column(String(500))
    disease_name = Column(String(200))
    confidence = Column(Float)
    description = Column(Text)
    causes = Column(JSON)
    prevention = Column(JSON)
    next_steps = Column(Text)
    is_demo = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class IrrigationRecommendation(Base):
    __tablename__ = "irrigation_recommendations"

    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id"), nullable=True)
    soil_moisture = Column(Float)
    temperature = Column(Float)
    humidity = Column(Float)
    rainfall = Column(Float)
    crop_type = Column(String(100))
    growth_stage = Column(String(100))
    irrigation_required = Column(Boolean)
    recommended_amount_mm = Column(Float)
    reason = Column(Text)
    next_check_hours = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)


class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(100), index=True)
    role = Column(String(20))  # "user" or "assistant"
    message = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
