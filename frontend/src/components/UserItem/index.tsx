import {css} from "catom";

import {SearchResults} from "@/types";
import {A} from "@hydrophobefireman/ui-lib";

import {SubscribeButton} from "../SubscribeButton";

export function UserItem({
  p,
  onSubscribeComplete,
  showSubscribe,
}: {
  p: SearchResults;
  onSubscribeComplete(): void | Promise<void>;
  showSubscribe?: boolean;
}) {
  return (
    <>
      <A href={`/profile/${p.id_}`}>
        {p.name} - <ins>@{p.user}</ins>{" "}
        {p.is_subscribed_to_me && (
          <span class={css({color: "grey", fontSize: "0.8rem"})}>
            (follows you)
          </span>
        )}
      </A>
      {showSubscribe && (
        <div>
          <SubscribeButton
            name={p.name}
            user={p.user}
            onSubscribeComplete={onSubscribeComplete}
            id={p.id_}
            isSubscribed={p.is_subscribed}
          />
        </div>
      )}
    </>
  );
}
