from app.db.base import db
from sqlalchemy.dialects.postgresql import TEXT

user_subscriptions = db.Table(
    "subscribers",
    db.Column("creator_id", TEXT, db.ForeignKey("user.id_"), primary_key=True),
    db.Column("follower_id", TEXT, db.ForeignKey("user.id_"), primary_key=True),
)
