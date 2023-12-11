from sqlalchemy.dialects.postgresql import TEXT
from time import time
from secrets import token_urlsafe

from ..base import db


class Post(db.Model):
    # pylint: disable=E1101
    id_: str = db.Column(TEXT, unique=True, nullable=False, primary_key=True)
    title: str = db.Column(db.String(255), nullable=False)
    user_id: str = db.Column(TEXT, db.ForeignKey("user.id_"), nullable=False)
    content: str = db.Column(TEXT, nullable=False)
    posted_at: int = db.Column(db.Integer, nullable=False)
    views: int = db.Column(db.Integer, default=0)

    def __init__(self, title=None, user_id=None, content=None, posted_at=None):
        self.id_ = token_urlsafe(25)
        self.title = title
        self.user_id = user_id
        self.content = content
        self.posted_at = posted_at or time()
        self.views = 0

    @property
    def as_json(self):
        return {
            "id_": self.id_,
            "title": self.title,
            "user_id": self.user_id,
            "content": self.content,
            "posted_at": self.posted_at,
            "user": self.user.as_json,
            "views": self.views,
        }
