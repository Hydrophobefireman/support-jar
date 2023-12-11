import {IPost, User} from "@/types";
import {requests, routes} from "@/util/http";
import {useAlerts} from "@hydrophobefireman/kit/alerts";
import {useResource} from "@hydrophobefireman/kit/hooks";
import {useEffect} from "@hydrophobefireman/ui-lib";

export function useProfile(idx: string) {
  const {show} = useAlerts();
  const {error, resp, fetchResource} = useResource(
    (idx) =>
      requests.get<{
        posts: IPost[];
        user: User;
        is_subscribed: boolean;
        is_subscribed_to_me: boolean;
      }>(routes.profile(idx)),
    [idx],
    null,
    [idx || null],
  );
  useEffect(() => {
    if (error) {
      show({content: `Could not fetch feed: ${error}`, type: "error"});
    }
  }, [error]);
  return {resp, refetch: fetchResource};
}
