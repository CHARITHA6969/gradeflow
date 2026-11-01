import os

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import hash_password, issue_access_token, read_access_token, verify_password
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["authentication"])
bearer = HTTPBearer(auto_error=False)


class Credentials(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    email: EmailStr
    password: str = Field(min_length=12, max_length=128)


class StudentRegistration(Credentials):
    signup_code: str = Field(min_length=8, max_length=128)


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    email: EmailStr
    role: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserRead


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer),
    db: Session = Depends(get_db),
) -> User:
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required.")
    payload = read_access_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session is invalid or expired.")
    user = db.get(User, int(payload["sub"]))
    if user is None or user.role != payload["role"]:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Account is no longer available.")
    return user


def require_role(role: str):
    def dependency(user: User = Depends(get_current_user)) -> User:
        if user.role != role:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"{role.title()} access required.")
        return user
    return dependency


@router.post("/register", response_model=TokenResponse, status_code=201)
def register_student(payload: StudentRegistration, db: Session = Depends(get_db)):
    signup_code = os.getenv("GRADEFLOW_STUDENT_SIGNUP_CODE")
    if not signup_code or payload.signup_code != signup_code:
        raise HTTPException(status_code=403, detail="Student registration is not enabled or the signup code is invalid.")
    email = str(payload.email).lower()
    if db.scalar(select(User).where(User.email == email)):
        raise HTTPException(status_code=409, detail="An account with this email already exists.")
    user = User(email=email, password_hash=hash_password(payload.password), role="student")
    db.add(user)
    db.commit()
    db.refresh(user)
    return TokenResponse(access_token=issue_access_token(user.id, user.role), user=user)


@router.post("/login", response_model=TokenResponse)
def login(payload: Credentials, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == str(payload.email).lower()))
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Email or password is incorrect.")
    return TokenResponse(access_token=issue_access_token(user.id, user.role), user=user)


@router.get("/me", response_model=UserRead)
def me(user: User = Depends(get_current_user)):
    return user
