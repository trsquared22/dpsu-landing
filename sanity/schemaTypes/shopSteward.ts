import { defineArrayMember, defineField, defineType } from "sanity";

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
      name: "stewards",
      title: "Shop Stewards",
      type: "array",
      description: "One entry per shop steward at this establishment, with their contact info.",
      of: [
        defineArrayMember({
          type: "object",
          name: "steward",
          fields: [
            defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "phone", title: "Phone", type: "string" }),
            defineField({ name: "email", title: "Email", type: "string" }),
          ],
          preview: {
            select: { title: "name", phone: "phone", email: "email" },
            prepare({ title, phone, email }) {
              return { title, subtitle: [phone, email].filter(Boolean).join(" · ") };
            },
          },
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "subOptions",
      title: "Ministries / Departments (optional)",
      type: "array",
      of: [{ type: "string" }],
      description:
        'If this establishment is a broad category (e.g. "Government Establishments"), list the specific ministries or departments here. They\'ll appear as a follow-up dropdown on the membership registration form. Leave empty for a standalone employer.',
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
    select: { title: "entity", stewards: "stewards" },
    prepare({ title, stewards }) {
      const names = Array.isArray(stewards) ? stewards.map((s: { name?: string }) => s.name).filter(Boolean) : [];
      return { title, subtitle: names.join(", ") };
    },
  },
});
