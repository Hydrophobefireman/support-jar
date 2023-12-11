import {IPost} from "@/types";
import {requests, routes} from "@/util/http";
import {useAlerts} from "@hydrophobefireman/kit/alerts";
import {useResource} from "@hydrophobefireman/kit/hooks";
import {useEffect, useState} from "@hydrophobefireman/ui-lib";

export function useFeed() {
  const {show} = useAlerts();
  const {resp, error} = useResource(
    () => requests.get<IPost[]>(routes.feedRoute),
    [],
  );
  useEffect(() => {
    if (error) {
      show({content: `Could not fetch feed: ${error}`, type: "error"});
    }
  }, [error]);
  return resp;
}
