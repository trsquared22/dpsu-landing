import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "contact", title: "Contact Info", default: true },
    { name: "about", title: "About Section" },
  ],
  fields: [
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
      group: "contact",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "contactPhone",
      title: "Contact Phone",
      type: "string",
      group: "contact",
      description: "Include country code, e.g. +1767XXXXXXX",
    }),
    defineField({
      name: "facebookUrl",
      title: "Facebook Page URL",
      type: "url",
      group: "contact",
    }),
    defineField({
      name: "aboutThemeLabel",
      title: "About Theme Label",
      type: "string",
      group: "about",
      description: 'Small eyebrow label above the theme paragraph, e.g. "2026 – 2028 Theme".',
    }),
    defineField({
      name: "aboutThemeText",
      title: "About Theme Text",
      type: "text",
      rows: 4,
      group: "about",
    }),
    defineField({
      name: "aboutPillars",
      title: "About Pillars",
      type: "array",
      group: "about",
      of: [
        defineField({
          name: "pillar",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "desc", title: "Description", type: "text", rows: 2, validation: (rule) => rule.required() }),
          ],
          preview: {
            select: { title: "title", subtitle: "desc" },
          },
        }),
      ],
    }),
    defineField({
      name: "aboutValues",
      title: "About Values",
      type: "array",
      group: "about",
      of: [{ type: "string" }],
      description: 'Short value tags, e.g. "Integrity", "Unity", "Fairness".',
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
