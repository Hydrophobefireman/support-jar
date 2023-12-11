import {AuthGuard} from "@/components/AuthGuard/AuthGuard";
import {MainRoot} from "@/components/MainRoot/Root";
import {PostRenderer} from "@/components/Post/PostRenderer";
import {IPost} from "@/types";
import {requests, routes} from "@/util/http";
import {useAlerts} from "@hydrophobefireman/kit/alerts";
import {useEffect, useRoute, useState} from "@hydrophobefireman/ui-lib";

function PostViewer() {
  const {params, path} = useRoute();
  const {id} = params;
  const {show} = useAlerts();
  const [post, setPost] = useState<IPost>(null);
  if (!id) return <div>Invalid post</div>;
  useEffect(() => {
    if (!path.startsWith("/posts")) return;
    const {controller, result} = requests.get<IPost>(routes.viewPostRoute(id));
    (async function () {
      const {data, error} = await result;
      if (error) {
        return show({
          type: "error",
          content: `Could not render post: ${error}`,
        });
      }
      setPost(data);
    })();

    return () => controller.abort();
  }, [id, path]);
  if (post) {
    return <PostRenderer post={post} full />;
  }
  return <div>...</div>;
}

export default function () {
  return (
    <AuthGuard>
      <MainRoot>
        <PostViewer />
      </MainRoot>
    </AuthGuard>
  );
}
