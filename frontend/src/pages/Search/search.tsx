import {css} from "catom";
import {subscribe} from "statedrive";

import {AuthGuard} from "@/components/AuthGuard/AuthGuard";
import {MainRoot} from "@/components/MainRoot/Root";
import {SubscribeButton} from "@/components/SubscribeButton";
import {UserItem} from "@/components/UserItem";
import {useSearch} from "@/hooks/search";
import {User} from "@/types";
import {requests, routes} from "@/util/http";
import {useAlerts} from "@hydrophobefireman/kit/alerts";
import {TextButton} from "@hydrophobefireman/kit/button";
import {Box} from "@hydrophobefireman/kit/container";
import {A} from "@hydrophobefireman/ui-lib";
import {useLocation} from "@kit/hooks";

function Search() {
  const {qs} = useLocation();
  const sp = new URLSearchParams(qs).get("q");
  const {data: results, refetch} = useSearch(sp);
  const {show} = useAlerts();

  return (
    <div>
      <Box horizontal="center">
        <h2
          class={css({
            fontSize: "1.25rem",
            fontWeight: "bold",
            marginTop: "1rem",
          })}
        >
          Creator search
        </h2>
      </Box>
      <div>
        {results.map((p) => (
          <div
            class={css({
              marginTop: ".5rem",
              marginBottom: ".5rem",
              borderBottom: "2px solid #e3e3e3",
              padding: ".5rem",
              display: "flex",
              justifyContent: "space-between",
            })}
          >
            <UserItem
              showSubscribe
              p={p}
              onSubscribeComplete={() => refetch(true)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function () {
  return (
    <AuthGuard>
      <MainRoot>
        <hr />
        <Search />
      </MainRoot>
    </AuthGuard>
  );
}
