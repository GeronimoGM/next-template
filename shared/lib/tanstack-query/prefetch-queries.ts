import "server-only"

import {
  dehydrate,
  type DehydratedState,
  type QueryClient,
} from "@tanstack/react-query"
import { getQueryClient } from "./get-query-client"

export type PrefetchableQuery = Parameters<QueryClient["prefetchQuery"]>[0]

export async function prefetchQueries(
  queries: PrefetchableQuery[]
): Promise<DehydratedState> {
  const queryClient = getQueryClient()
  await Promise.all(queries.map((query) => queryClient.prefetchQuery(query)))
  return dehydrate(queryClient)
}
