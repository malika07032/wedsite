from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas, models, dependencies
from app.dependencies import get_db

router = APIRouter(tags=["Guest View"])


@router.get("/guest-view/{token}", response_model=schemas.GuestView)
def guest_view(token: str, db: Session = Depends(get_db)):
    guest = crud.get_guest_by_token(db, token)
    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found")

    website = guest.website
    if not website:
        raise HTTPException(status_code=404, detail="Wedding website not found")

    # Customize view based on group
    group = guest.group
    story = website.story if group in ["Family", "Friends"] else None

    return schemas.GuestView(
        guest_name=guest.name,
        group=group,
        title=website.title,
        date=website.date,
        location=website.location,
        story=story
    )