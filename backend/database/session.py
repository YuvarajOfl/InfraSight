import logging
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from backend.config.settings import settings

logger = logging.getLogger("backend.database")

def mask_database_url(url: str) -> str:
    from urllib.parse import urlparse
    try:
        parsed = urlparse(url)
        if parsed.password:
            username = parsed.username or ""
            netloc = f"{username}:***"
            if parsed.hostname:
                netloc += f"@{parsed.hostname}"
            if parsed.port:
                netloc += f":{parsed.port}"
            parsed = parsed._replace(netloc=netloc)
        return parsed.geturl()
    except Exception:
        return url

def ensure_sqlite_dir_exists(url: str):
    if url.startswith("sqlite:///"):
        import os
        path = url.replace("sqlite:///", "")
        if os.name == 'nt' and path.startswith("/") and len(path) > 2 and path[2] == ":":
            path = path.lstrip("/")
        db_dir = os.path.dirname(path)
        if db_dir:
            os.makedirs(db_dir, exist_ok=True)

# MySQL connection engine, with automatic fallback to SQLite for local development
try:
    ensure_sqlite_dir_exists(settings.database_url)
    # Set a short connection timeout to prevent hanging on startup if server is down
    if settings.database_url.startswith("sqlite"):
        engine = create_engine(
            settings.database_url,
            connect_args={"check_same_thread": False}
        )
    else:
        connect_args = {"connect_timeout": 5}
        engine = create_engine(
            settings.database_url,
            pool_pre_ping=True,      # Check connection health before queries
            pool_recycle=3600,       # Recycle connections after an hour
            pool_size=10,            # Core pool size
            max_overflow=20,         # Max overflow connections during spikes
            connect_args=connect_args
        )
    # Test connection
    with engine.connect() as conn:
        db_type = "SQLite" if settings.database_url.startswith("sqlite") else "MySQL"
        logger.info(f"Successfully connected to {db_type} database.")
    logger.info(f"Database engine initialized with URL: {mask_database_url(settings.database_url)}")
except Exception as conn_err:
    logger.warning(f"MySQL server connection failed: {conn_err}. Falling back to local SQLite database.")
    # Initialize SQLite database file locally
    import os
    if os.path.exists("/.dockerenv") or os.environ.get("APP_ENV") == "production" or os.path.exists("/app"):
        db_dir = "/app/data"
    else:
        db_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "database"))
    os.makedirs(db_dir, exist_ok=True)
    db_path = os.path.join(db_dir, "infrasight.db")
    sqlite_url = f"sqlite:///{db_path}"
    engine = create_engine(
        sqlite_url,
        connect_args={"check_same_thread": False}
    )
    logger.info(f"Database engine initialized with URL: {mask_database_url(sqlite_url)}")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency to retrieve database session inside routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
