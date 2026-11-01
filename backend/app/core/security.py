import hashlib
import hmac
import os
import secrets

from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer

SECRET_KEY = os.getenv("GRADEFLOW_SECRET_KEY", "local-development-only-change-this-secret")
if os.getenv("APP_ENV", "development").lower() == "production" and SECRET_KEY == "local-development-only-change-this-secret":
    raise RuntimeError("GRADEFLOW_SECRET_KEY must be set to a private random value in production.")


def hash_password(password: str) -> str:
    if len(password) < 12:
        raise ValueError("Password must contain at least 12 characters.")
    salt = secrets.token_bytes(16)
    digest = hashlib.scrypt(password.encode("utf-8"), salt=salt, n=2**14, r=8, p=1)
    return "scrypt$" + salt.hex() + "$" + digest.hex()


def verify_password(password: str, encoded: str) -> bool:
    try:
        algorithm, salt_hex, digest_hex = encoded.split("$", 2)
        if algorithm != "scrypt":
            return False
        salt = bytes.fromhex(salt_hex)
        expected = bytes.fromhex(digest_hex)
        actual = hashlib.scrypt(password.encode("utf-8"), salt=salt, n=2**14, r=8, p=1)
        return hmac.compare_digest(actual, expected)
    except (ValueError, TypeError):
        return False


def issue_access_token(user_id: int, role: str) -> str:
    serializer = URLSafeTimedSerializer(SECRET_KEY, salt="gradeflow-access")
    return serializer.dumps({"sub": str(user_id), "role": role})


def read_access_token(token: str, max_age: int = 8 * 60 * 60) -> dict | None:
    serializer = URLSafeTimedSerializer(SECRET_KEY, salt="gradeflow-access")
    try:
        payload = serializer.loads(token, max_age=max_age)
        if not isinstance(payload, dict) or payload.get("role") not in {"instructor", "student"}:
            return None
        return payload
    except (BadSignature, SignatureExpired):
        return None
