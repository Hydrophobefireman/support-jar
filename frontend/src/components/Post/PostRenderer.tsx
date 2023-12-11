import {css} from "catom";

import {IPost} from "@/types";
import {requests, useUser} from "@/util/bridge";
import {routes} from "@/util/http";
import {useAlerts} from "@hydrophobefireman/kit/alerts";
import {Button} from "@hydrophobefireman/kit/button";
import {Box} from "@hydrophobefireman/kit/container";
import {A, redirect} from "@hydrophobefireman/ui-lib";
import {TrashIcon} from "@kit/icons";

export function PostRenderer({
  post,
  onClick,
  full,
}: {
  post: IPost;
  onClick?: JSX.MouseEventHandler<HTMLDivElement>;
  full?: boolean;
}) {
  const {show} = useAlerts();
  async function deletePost(e: MouseEvent) {
    e.stopPropagation();
    const {result} = requests.del(routes.viewPostRoute(post.id_));
    const {data, error} = await result;
    if (error) {
      return show({type: "error", content: `Could not delete post: ${error}`});
    }
    return redirect("/profile/me");
  }
  const [user] = useUser();
  const content = full ? post.content : post.content.substring(0, 200);
  return (
    <div
      onClick={onClick}
      class={css({
        margin: "auto",
        border: "2px solid #e3e3e3",
        maxWidth: "600px",
        width: "80%",
        padding: "0.5rem",
        borderRadius: "8px",
      })}
    >
      <Box horizontal="center">
        <A href={`/profile/${post.user_id}`}>{post.user.name}</A>
        <A class={css({color: "grey"})} href={`/profile/${post.user_id}`}>
          @{post.user.user}
        </A>
      </Box>
      <div class={css({marginTop: "1rem"})}>
        <h2 class={css({fontWeight: "bold", fontSize: "1.25rem"})}>
          {post.title}
        </h2>
        <div>
          <div class={full ? null : css({})}>
            {content.split("\n").map((x) => (
              <p class={css({margin: ".5rem 0 .5rem 0"})}>{x}</p>
            ))}
            {content.length === post.content.length ? (
              <></>
            ) : (
              <span title="continued">...</span>
            )}
          </div>
          <div>
            Posted on:{" "}
            {`${new Date(post.posted_at * 1000).toTimeString()} ${new Date(
              post.posted_at * 1000,
            ).toDateString()}`}
          </div>
          <div>Views: {post.views}</div>
        </div>
      </div>
      {user?.id_ == post.user_id && (
        <Box horizontal="right">
          <Button
            onClick={deletePost}
            prefix={<TrashIcon />}
            label="Delete"
            variant="shadow"
            mode="secondary"
          ></Button>
        </Box>
      )}
    </div>
  );
}
