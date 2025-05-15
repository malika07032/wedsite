from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import models, schemas
from app.dependencies import get_db, get_current_user

router = APIRouter(prefix="/me/website", tags=["Wedding Website"])


@router.get("/", response_model=schemas.WeddingWebsiteOut)
def get_my_website(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    website = current_user.website
    if not website:
        raise HTTPException(status_code=404, detail="Website not found.")
    return website


@router.post("/", response_model=schemas.WeddingWebsiteOut)
def create_website(
    website_data: schemas.WeddingWebsiteCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.website:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Website already exists for this user.",
        )

    new_website = models.WeddingWebsite(
        user_id=current_user.id,
        **website_data.dict(),
    )
    db.add(new_website)
    db.commit()
    db.refresh(new_website)
    return new_website


@router.put("/", response_model=schemas.WeddingWebsiteOut)
def update_website(
    website_data: schemas.WeddingWebsiteUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    website = current_user.website
    if not website:
        raise HTTPException(status_code=404, detail="Website not found.")

    for field, value in website_data.dict(exclude_unset=True).items():
        setattr(website, field, value)

    db.commit()
    db.refresh(website)
    return website