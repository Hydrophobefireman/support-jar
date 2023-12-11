import {SearchResults, User} from "@/types";
import {requests, routes} from "@/util/http";
import {useAlerts} from "@hydrophobefireman/kit/alerts";
import {useResource} from "@hydrophobefireman/kit/hooks";
import {useEffect, useState} from "@hydrophobefireman/ui-lib";

export function useSearch(search: string) {
  const [results, setResults] = useState<SearchResults[]>([]);
  const {show} = useAlerts();
  const {resp, error, fetchResource} = useResource(
    (search) => requests.get<SearchResults[]>(routes.searchRoute(search)),
    [search],
  );
  useEffect(() => {
    if (error) {
      return show({type: "error", content: `Could not search: ${error}`});
    }
  }, [error]);

  return {data: resp || [], refetch: fetchResource};
}
