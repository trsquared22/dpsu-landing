import type { SchemaTypeDefinition } from "sanity";

import newsPost from "./newsPost";
import service from "./service";
import shopSteward from "./shopSteward";
import siteSettings from "./siteSettings";

export const schemaTypes: SchemaTypeDefinition[] = [newsPost, service, shopSteward, siteSettings];
