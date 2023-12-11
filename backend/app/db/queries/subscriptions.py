from ..schemas.user import User
from ..schemas.post import Post
from app.internal.helpers.guard import guard
from sqlalchemy import text
from sqlalchemy.orm import aliased
from app.db.base import db

message = "User does not exist"


# def get_subscriptions_by_id(idx: str) -> list[User]:
#     user: User = guard(User.query.filter_by(id_=idx).first())
#     return user.subscribed.all() or []


def get_subscriptions_by_id(idx: str) -> list[User]:
    # Using a prepared statement
    query = text(
        """
        SELECT
                u.id_,
                u."user",
                u.name,
                u.password_hash,
                u.created_at,
                u.is_admin
        FROM
                "users" u
                JOIN subscribers s ON u.id_ = s.creator_id
        WHERE
                s.follower_id = :idx;
    """
    )
    subscriptions = (
        db.session.query(User).from_statement(query).params(idx=idx).all()
    )
    return subscriptions or []


def get_subscribers_by_id(idx: str) -> list[User]:
    # Using a prepared statement
    query = text(
        """
        SELECT
                u.id_,
                u."user",
                u.name,
                u.password_hash,
                u.created_at,
                u.is_admin
        FROM
                "users" u
                JOIN subscribers s ON u.id_ = s.follower_id
        WHERE
                s.creator_id = :idx;
    """
    )
    subscriptions = (
        db.session.query(User).from_statement(query).params(idx=idx).all()
    )
    return subscriptions or []


def get_feed(for_: str) -> list[Post]:
    subscriptions = get_subscriptions_by_id(for_)
    posts: list[Post] = []
    for sub in subscriptions:
        posts.extend(sub.posts)
    return sorted(
        (x.as_json for x in posts), key=lambda x: x["posted_at"], reverse=True
    )


def get_post_by_id(idx: str) -> Post:
    return guard(Post.query.filter_by(id_=idx).first())
