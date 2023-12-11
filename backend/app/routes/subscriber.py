from app.db.queries.subscriptions import get_subscriptions_by_id, get_post_by_id
from app.db.queries.user import get_user_by_id, search_user
from app.decorators.api_response import api
from app.db.mutations.util import commit
from app.db.mutations.post import delete_post
from app.db.queries.subscriptions import get_feed
from app.internal.context import Context
from app.exceptions.app_exception import AppException


from flask import Blueprint

router = Blueprint("subscriber", __name__, url_prefix="/subscriber")


@router.get("/creators")
@api.strict
def get_creators():
    req = Context()
    slf = get_user_by_id(req.auth.user_id)
    data = get_subscriptions_by_id(req.auth.user_id)
    return [
        {
            **x.as_json,
            "is_subscribed": slf.is_subscribed_to(x) if slf != x else None,
            "is_subscribed_to_me": x.is_subscribed_to(slf) if slf != x else None,
        }
        for x in data
    ]


@router.get("/feed")
@api.strict
def get_feed_api():
    req = Context()
    return get_feed(req.auth.user_id)


@router.get("/posts/<idx>")
@api.strict
def get_post_content(idx):
    current = get_user_by_id(Context().auth.user_id)
    post_data = get_post_by_id(idx)
    if current.is_subscribed_to(post_data.user) or current.id_ == post_data.user_id:
        post_data.views += 1
        commit()
        return post_data.as_json
    raise AppException("Access not allowed")


@router.delete("/posts/<idx>")
@api.strict
def api_delete_post(idx):
    current = get_user_by_id(Context().auth.user_id)
    post_data = get_post_by_id(idx)
    if current.id_ != post_data.user_id:
        raise AppException("Not authorised to delete", 401)
    delete_post(post_data)
    return {}


@router.get("/profile/<idx>")
@api.strict
def get_profile(idx):
    current = get_user_by_id(Context().auth.user_id)
    if idx == "me":
        idx = current.id_
    if idx == current.id_:
        return {
            "user": current.as_json,
            "posts": sorted(
                (x.as_json for x in current.posts),
                key=lambda x: x["posted_at"],
                reverse=True,
            ),
        }
    other = get_user_by_id(idx)
    posts = []
    if current.is_subscribed_to(other):
        posts = sorted(
            (x.as_json for x in other.posts), key=lambda x: x["posted_at"], reverse=True
        )
    return {
        "user": other.as_json,
        "posts": posts,
        "is_subscribed": current.is_subscribed_to(other),
        "is_subscribed_to_me": other.is_subscribed_to(current),
    }


@router.get("/subscribe/<idx>")
@api.strict
def subscribe_to_user(idx):
    ctx = Context()
    slf = get_user_by_id(ctx.auth.user_id)
    other = get_user_by_id(idx)
    slf.subscribe_to(other)
    return {"success": True}


@router.get("/search")
@api.strict
def search_creators():
    ctx = Context()
    slf = get_user_by_id(ctx.auth.user_id)
    if not (q := ctx.args.get("q")):
        return []
    data = search_user(q)
    return [
        {
            **x.as_json,
            "is_subscribed": slf.is_subscribed_to(x),
            "is_subscribed_to_me": x.is_subscribed_to(slf),
        }
        for x in data
        if x.id_ != slf.id_
    ]
