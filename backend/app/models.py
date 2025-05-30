from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy import Enum as SqlEnum
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base
import uuid
import enum

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    # One-to-one relationship with WeddingWebsite
    website = relationship("WeddingWebsite", back_populates="user", uselist=False, cascade="all, delete")

class WeddingWebsite(Base):
    __tablename__ = "wedding_websites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), unique=True, nullable=False)
    title = Column(String, index=True, nullable=False)
    date = Column(DateTime, nullable=False)
    location = Column(String, index=True, nullable=False)
    story = Column(String, index=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationship back to User
    user = relationship("User", back_populates="website")
    guests = relationship("Guest", back_populates="website", cascade="all, delete-orphan")

class RSVPStatusEnum(str, enum.Enum):
    pending = "Pending"
    yes = "Yes"
    no = "No"
    maybe = "Maybe"

class GuestGroupEnum(str, enum.Enum):
    family = "Family"
    friends = "Friends"
    coworkers = "Coworkers"
    others = "Others"

class Guest(Base):
    __tablename__ = "guests"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=True)
    group = Column(SqlEnum(GuestGroupEnum), nullable=True)
    token = Column(String, unique=True, default=lambda: str(uuid.uuid4()), nullable=False)
    rsvp_status = Column(SqlEnum(RSVPStatusEnum), default=RSVPStatusEnum.pending, nullable=False)
    attending = Column(SqlEnum(RSVPStatusEnum), default=RSVPStatusEnum.pending, nullable=False)
    meal_preference = Column(String, nullable=True)
    notes = Column(String, nullable=True)

    wedding_id = Column(Integer, ForeignKey("wedding_websites.id"), nullable=False)
    website = relationship("WeddingWebsite", back_populates="guests")

