import type { StructureResolver } from "sanity/structure";

// Pins Site Settings as a singleton (single edit screen, no create/duplicate/delete)
// and lists every other document type beneath it.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => listItem.getId() !== "siteSettings"
      ),
    ]);
