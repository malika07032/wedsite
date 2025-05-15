from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from . import models, schemas, crud, auth
from .database import engine
from .dependencies import get_db

from app.routers import wedding_website, guests, guest_view


models.Base.metadata.create_all(bind=engine)

app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
app.include_router(wedding_website.router)
app.include_router(guests.router)
app.include_router(guest_view.router)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if crud.get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db, user)


@app.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}


@app.get("/me", response_model=schemas.UserOut)
def read_users_me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        token_data = auth.decode_token(token)
    except:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = crud.get_user_by_email(db, token_data.email)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# for testing
@app.get("/users", response_model=list[schemas.UserOut])
def read_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users