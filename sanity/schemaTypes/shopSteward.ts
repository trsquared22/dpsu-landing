import { defineArrayMember, defineField, defineType } from "sanity";

import { StewardDepartmentInput } from "../components/StewardDepartmentInput";

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
      name: "subOptions",
      title: "Ministries / Departments (optional)",
      type: "array",
      of: [{ type: "string" }],
      description:
        'If this establishment is a broad category (e.g. "Government Establishments"), list the specific ministries or departments here. Set this first - each shop steward below can then be assigned to one. They\'ll also appear as a follow-up dropdown on the membership registration form. Leave empty for a standalone employer.',
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
            defineField({
              name: "department",
              title: "Ministry / Department",
              type: "string",
              description:
                "If this establishment has a ministries/departments list above, assign this steward to one so members who select it see only them. Leave as \"General\" to show for everyone by default.",
              components: { input: StewardDepartmentInput },
            }),
          ],
          preview: {
            select: { title: "name", phone: "phone", email: "email", department: "department" },
            prepare({ title, phone, email, department }) {
              return { title, subtitle: [department, phone, email].filter(Boolean).join(" · ") };
            },
          },
        }),
      ],
      validation: (rule) => rule.min(1),
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
