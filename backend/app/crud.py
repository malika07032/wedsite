from sqlalchemy.orm import Session
from . import models, schemas, auth

#########################
# Users
#########################


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate):
    hashed_pw = auth.hash_password(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_pw)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_users(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.User).offset(skip).limit(limit).all()


def get_website_by_user(db: Session, user_id: int):
    return (
        db.query(models.WeddingWebsite)
        .filter(models.WeddingWebsite.user_id == user_id)
        .first()
    )


#########################
# Guests
#########################


def add_guest(db: Session, wedding_id: int, guest_data: schemas.GuestCreate):
    guest = models.Guest(wedding_id=wedding_id, **guest_data.dict())
    db.add(guest)
    db.commit()
    db.refresh(guest)
    return guest


def update_guest(db: Session, guest_id: int, guest_data: schemas.GuestUpdate):
    guest = db.query(models.Guest).filter(models.Guest.id == guest_id).first()
    if not guest:
        return None
    update_data = guest_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(guest, key, value)
    db.commit()
    db.refresh(guest)
    return guest


def get_guests_by_wedding(db: Session, wedding_id: int):
    return db.query(models.Guest).filter(models.Guest.wedding_id == wedding_id).all()


def get_guest_by_token(db: Session, token: str):
    return db.query(models.Guest).filter(models.Guest.token == token).first()


def get_guest_by_id(db: Session, guest_id: int):
    return db.query(models.Guest).filter(models.Guest.id == guest_id).first()

#########################
# RSVPs
#########################


def get_rsvps_by_wedding(db: Session, wedding_id: int):
    return db.query(models.Guest).filter(models.Guest.wedding_id == wedding_id).all()
