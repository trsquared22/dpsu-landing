import type { SchemaTypeDefinition } from "sanity";

import carouselSlide from "./carouselSlide";
import newsPost from "./newsPost";
import service from "./service";
import shopSteward from "./shopSteward";
import siteSettings from "./siteSettings";

export const schemaTypes: SchemaTypeDefinition[] = [
  carouselSlide,
  newsPost,
  service,
  shopSteward,
  siteSettings,
];
