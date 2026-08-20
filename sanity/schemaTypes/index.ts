import type { SchemaTypeDefinition } from "sanity";

import newsPost from "./newsPost";
import service from "./service";
import membershipStat from "./membershipStat";
import siteSettings from "./siteSettings";

export const schemaTypes: SchemaTypeDefinition[] = [newsPost, service, membershipStat, siteSettings];
