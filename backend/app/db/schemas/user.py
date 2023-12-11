from secrets import token_urlsafe
from time import time

from sqlalchemy.dialects.postgresql import TEXT
from .user_subscriptions import user_subscriptions
from .post import Post
from ..base import db


class User(db.Model):
    __tablename__ = "users"
    # pylint: disable=E1101
    id_: str = db.Column(TEXT, unique=True, nullable=False, primary_key=True)
    user: str = db.Column(db.String(50), unique=True, nullable=False)
    name: str = db.Column(db.String(100), nullable=False)
    password_hash: str = db.Column(TEXT, nullable=False)
    created_at: int = db.Column(db.Integer)
    is_admin: bool = db.Column(db.Boolean, default=False)

    subscribed = db.relationship(
        "User",
        secondary=user_subscriptions,
        primaryjoin=(user_subscriptions.c.follower_id == id_),
        secondaryjoin=(user_subscriptions.c.creator_id == id_),
        backref=db.backref("subscribers", lazy="dynamic"),
        lazy="dynamic",
    )

    posts = db.relationship(
        "Post", cascade="all,delete-orphan", backref="user", lazy=True
    )

    # pylint: enable=E1101

    def __init__(
        self,
        user: str = None,
        name: str = None,
        password_hash: str = None,
    ):
        self.id_ = token_urlsafe(20)
        self.user = user.lower()
        self.name = name
        self.password_hash = password_hash
        self.created_at = time()

    def is_subscribed_to(self, to: "User"):
        return bool(self.subscribed.filter_by(id_=to.id_).count())

    def subscribe_to(self, to: "User"):
        if not self.is_subscribed_to(to) and self.id_ != to.id_:
            self.subscribed.add(to)
            db.session.commit()

    def unsubscribe(self, from_: "User"):
        if self.is_subscribed_to(from_):
            from_.subscribers.remove(self)
            db.session.commit()

    def delete_user(self):
        self.subscribers = self.subscribed = []
        db.session.delete(self)
        db.session.commit()

    @property
    def as_json(self):
        return {
            "id_": self.id_,
            "name": self.name,
            "user": self.user,
            "created_at": self.created_at,
            "is_admin": self.is_admin,
            "_secure_": {},
        }
