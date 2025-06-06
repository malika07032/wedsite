from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from .models import RSVPStatusEnum, GuestGroupEnum


#########################
# User
#########################
class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserOut(UserBase):
    id: int

    class Config:
        orm_mode = True


#########################
# Token
#########################
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str | None = None


#########################
# Wedding Website
#########################
class WeddingWebsiteCreate(BaseModel):
    title: str
    date: datetime
    location: str
    story: str


class WeddingWebsiteUpdate(BaseModel):
    title: Optional[str] = None
    date: Optional[datetime] = None
    location: Optional[str] = None
    story: Optional[str] = None


class WeddingWebsiteOut(BaseModel):
    id: int
    title: str
    date: datetime
    location: str
    story: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


#########################
# Guests
#########################
class GuestCreate(BaseModel):
    name: str
    email: Optional[str] = None
    group: Optional[GuestGroupEnum] = None
    rsvp_status: Optional[RSVPStatusEnum] = RSVPStatusEnum.pending


class GuestUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    group: Optional[GuestGroupEnum] = None
    rsvp_status: Optional[RSVPStatusEnum] = None


class GuestOut(BaseModel):
    id: int
    name: str
    email: Optional[str]
    group: Optional[GuestGroupEnum]
    rsvp_status: RSVPStatusEnum
    token: str

    class Config:
        orm_mode = True


#########################
# Guest View
#########################
class GuestView(BaseModel):
    guest_name: str
    group: GuestGroupEnum
    rsvp_status: RSVPStatusEnum
    title: str
    date: datetime
    location: str
    story: Optional[str]  # Optional in case you want to hide it from some groups

    class Config:
        orm_mode = True


#########################
# RSVP
#########################
class RSVPSubmission(BaseModel):
    attending: RSVPStatusEnum
    group: GuestGroupEnum
    meal_preference: Optional[str] = None
    notes: Optional[str] = None
