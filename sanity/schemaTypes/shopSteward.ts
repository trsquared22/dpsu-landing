import { defineField, defineType } from "sanity";

export default defineType({
  name: "shopSteward",
  title: "Shop Steward",
  type: "document",
  fields: [
    defineField({
      name: "entity",
      title: "Company / Establishment Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "stewardNames",
      title: "Shop Steward Name(s)",
      type: "text",
      rows: 3,
      description:
        "Name(s) of the shop steward(s) at this establishment. Separate multiple names with a comma or a new line.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Controls row order in the shop steward table (lower numbers first).",
      validation: (rule) => rule.integer(),
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "entity", subtitle: "stewardNames" },
  },
});
