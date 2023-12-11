import {css} from "catom";

import {AuthGuard} from "@/components/AuthGuard/AuthGuard";
import {MainRoot} from "@/components/MainRoot/Root";
import {PostRenderer} from "@/components/Post/PostRenderer";
import {SubscribeButton} from "@/components/SubscribeButton";
import {UserItem} from "@/components/UserItem";
import {useProfile} from "@/hooks/profile";
import {SearchResults} from "@/types";
import {requests, useUser} from "@/util/bridge";
import {routes} from "@/util/http";
import {TextButton} from "@hydrophobefireman/kit/button";
import {Box} from "@hydrophobefireman/kit/container";
import {Modal} from "@hydrophobefireman/kit/modal";
import {loadURL, useRoute, useState} from "@hydrophobefireman/ui-lib";

const enum ViewingMode {
  Followers,
  Following,
}
function Profile() {
  const {params} = useRoute();
  const [current] = useUser();
  const {resp, refetch} = useProfile(params.id);
  const [loading, setLoading] = useState(false);
  const [viewing, setViewing] = useState(false);
  const [userList, setUserList] = useState<SearchResults[]>([]);
  const [mode, setMode] = useState<ViewingMode | null>(null);

  if (!resp) return <div>...</div>;
  const {posts, user} = resp;
  async function fetchUserConnectionData(isFollowers: boolean) {
    setMode(isFollowers ? ViewingMode.Followers : ViewingMode.Following);
    setViewing(true);
    setLoading(true);
    const {result} = requests.get<SearchResults[]>(
      isFollowers ? routes.followerRoute : routes.subscriptionsRoute,
    );
    const {data} = await result;
    setLoading(false);
    setUserList(data);
  }
  async function viewData(e: JSX.TargetedMouseEvent<HTMLButtonElement>) {
    const {dataset} = e.currentTarget;
    const {action} = dataset;
    const isFollowers = action === "followers";
    fetchUserConnectionData(isFollowers);
  }
  const canView = resp.is_subscribed || resp?.user?.id_ === current?.id_;
  function close() {
    setLoading(false);
    setViewing(false);
    setMode(null);
    setUserList([]);
  }
  const isSelf = current?.id_ === resp?.user?.id_;
  return (
    <div>
      {isSelf && (
        <Modal
          onClickOutside={close}
          onEscape={close}
          class={loading && css({filter: "blur(10px)"})}
          active={viewing}
        >
          <Modal.Body>
            <Modal.Title>
              {mode === ViewingMode.Followers
                ? `${resp.user.name}'s Followers`
                : "Following"}
            </Modal.Title>
            {userList?.length !== 0 && (
              <>
                {" "}
                <div>{userList.length} People</div>
                <div>
                  {userList.map((x) => (
                    <div>
                      <UserItem
                        p={x}
                        onSubscribeComplete={() =>
                          fetchUserConnectionData(
                            mode === ViewingMode.Followers,
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </Modal.Body>
        </Modal>
      )}
      <Box horizontal="center">
        <h2>{user.name}'s Profile</h2>
      </Box>
      {isSelf && (
        <Box row class={css({gap: "1rem", margin: "1rem 0 1rem 0"})}>
          <TextButton onClick={viewData} data-action="followers">
            Subscribers
          </TextButton>
          <TextButton onClick={viewData} data-action="following">
            Subscribing to
          </TextButton>
        </Box>
      )}
      <Box class={css({marginTop: "2rem", gap: "1rem"})}>
        {resp &&
          (canView ? (
            posts.map((x) => (
              <PostRenderer
                onClick={() => loadURL(`/posts/${x.id_}`)}
                post={x}
              />
            ))
          ) : (
            <div>
              <div>
                You do not follow {resp.user.name} (@{resp.user.user}).
                Subscribe to view their posts!
              </div>
              <div>
                <SubscribeButton
                  id={resp.user.id_}
                  isSubscribed={false}
                  name={resp.user.name}
                  user={resp.user.user}
                  onSubscribeComplete={() => refetch(true)}
                />
              </div>
            </div>
          ))}
      </Box>
    </div>
  );
}

export default function () {
  return (
    <AuthGuard>
      <MainRoot>
        <Profile />
      </MainRoot>
    </AuthGuard>
  );
}
