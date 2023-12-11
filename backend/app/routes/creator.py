from app.db.mutations.post import create_post
from app.db.queries.subscriptions import get_subscribers_by_id
from app.db.queries.user import get_user_by_id
from app.decorators.api_response import api
from app.exceptions.app_exception import AppException
from app.internal.context import Context

from flask import Blueprint

router = Blueprint("creator", __name__, url_prefix="/creator")


@router.get("/subscribers")
@api.strict
def get_creators():
    req = Context()
    data = get_subscribers_by_id(req.auth.user_id)
    slf = get_user_by_id(req.auth.user_id)
    return [
        {
            **x.as_json,
            "is_subscribed": slf.is_subscribed_to(x) if slf != x else None,
            "is_subscribed_to_me": x.is_subscribed_to(slf) if slf != x else None,
        }
        for x in data
    ]


@router.post("/post")
@api.strict
def create_post_api():
    req = Context()
    content = req.json.get("content")
    title = req.json.get("title")
    if not content:
        raise AppException("Missing post content")
    if not title:
        raise AppException("Missing post title")
    return create_post(req.auth.user_id, title, content)
