import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // false so revalidatePath()/revalidateTag() from the webhook actually
  // bust cached data instead of racing Sanity's own CDN cache.
  useCdn: false,
});
