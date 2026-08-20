import { defineField, defineType } from "sanity";

export default defineType({
  name: "membershipStat",
  title: "Membership Stat",
  type: "document",
  fields: [
    defineField({
      name: "entity",
      title: "Company / Entity Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "members",
      title: "Active Members",
      type: "number",
      validation: (rule) => rule.required().min(0).integer(),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Controls row order in the membership table (lower numbers first).",
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
    select: { title: "entity", subtitle: "members" },
    prepare({ title, subtitle }) {
      return { title, subtitle: subtitle != null ? `${subtitle} members` : undefined };
    },
  },
});
