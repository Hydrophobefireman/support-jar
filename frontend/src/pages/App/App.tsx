import {css} from "catom";

import {AuthGuard} from "@/components/AuthGuard/AuthGuard";
import {MainRoot} from "@/components/MainRoot/Root";
import {PostRenderer} from "@/components/Post/PostRenderer";
import {useFeed} from "@/hooks/feed";
import {useCurrentAuthState, useUser} from "@/util/bridge";
import {Box} from "@hydrophobefireman/kit/container";
import {loadURL} from "@hydrophobefireman/ui-lib";

function App() {
  const [state] = useUser();
  const feed = useFeed();

  return (
    <MainRoot>
      <div>
        <Box horizontal="center">
          <h1 class={css({fontSize: "1.5rem", fontWeight: "bold"})}>
            Your feed
          </h1>
        </Box>
        <Box class={css({gap: "1rem"})}>
          {feed?.map((p) => (
            <div class={css({width: "100%"})}>
              <PostRenderer
                onClick={() => loadURL(`/posts/${p.id_}`)}
                post={p}
              />
            </div>
          ))}
        </Box>
      </div>
    </MainRoot>
  );
}

export default function () {
  return (
    <AuthGuard>
      <App />
    </AuthGuard>
  );
}
