from app.db import db
from app.db.mutations.util import commit
from app.db.schemas import Post, User
from app.models.user import UserIn

# pylint: disable=E1101


def create_post(user: str, title: str, content: str):
    p = Post(title, user, content)
    db.session.add(p)
    commit()
    return p.as_json


def delete_post(post: Post):
    db.session.delete(post)
    commit()
