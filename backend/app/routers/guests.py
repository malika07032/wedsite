from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas, models, dependencies
from app.dependencies import get_db

router = APIRouter(tags=["Guests"])


@router.post("/me/guests", response_model=schemas.GuestOut)
def add_guest(
    guest: schemas.GuestCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(dependencies.get_current_user),
):
    wedding = crud.get_website_by_user(db, current_user.id)
    if not wedding:
        raise HTTPException(status_code=404, detail="Wedding website not found")
    return crud.add_guest(db, wedding_id=wedding.id, guest_data=guest)


@router.put("/me/guests/{guest_id}", response_model=schemas.GuestOut)
def update_guest(
    guest_id: int,
    guest_update: schemas.GuestUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(dependencies.get_current_user),
):
    wedding = crud.get_website_by_user(db, current_user.id)
    if not wedding:
        raise HTTPException(status_code=404, detail="Wedding website not found")
    guest = crud.get_guest_by_id(db, guest_id)
    if not guest or guest.wedding_id != wedding.id:
        raise HTTPException(status_code=404, detail="Guest not found")
    return crud.update_guest(db, guest_id=guest_id, guest_data=guest_update)


@router.delete("/me/guests/{guest_id}", status_code=204)
def delete_guest(
    guest_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(dependencies.get_current_user),
):
    wedding = crud.get_website_by_user(db, current_user.id)
    if not wedding:
        raise HTTPException(status_code=404, detail="Wedding website not found")
    guest = crud.get_guest_by_id(db, guest_id)
    if not guest or guest.wedding_id != wedding.id:
        raise HTTPException(status_code=404, detail="Guest not found")
    db.delete(guest)
    db.commit()
    return


@router.get("/me/guests", response_model=list[schemas.GuestOut])
def list_guests(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(dependencies.get_current_user),
):
    wedding = crud.get_website_by_user(db, current_user.id)
    if not wedding:
        raise HTTPException(status_code=404, detail="Wedding website not found")
    return crud.get_guests_by_wedding(db, wedding_id=wedding.id)


@router.get("/me/rsvps", response_model=list[schemas.GuestOut])
def get_rsvps(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(dependencies.get_current_user),
):
    wedding = crud.get_website_by_user(db, current_user.id)
    if not wedding:
        raise HTTPException(status_code=404, detail="Wedding website not found")
    return crud.get_rsvps_by_wedding(db, wedding.id)


@router.get("/guests/{token}", response_model=schemas.GuestOut)
def view_guest_by_token(token: str, db: Session = Depends(get_db)):
    guest = crud.get_guest_by_token(db, token=token)
    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found")
    return guest
