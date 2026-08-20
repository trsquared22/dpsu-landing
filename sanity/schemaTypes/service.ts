import { defineField, defineType } from "sanity";

const ICON_OPTIONS = [
  { title: "Legal (Scale)", value: "legal" },
  { title: "Bargaining (Handshake)", value: "bargaining" },
  { title: "Training (Graduation Cap)", value: "training" },
  { title: "Community (Heart Handshake)", value: "community" },
  { title: "Cash (Banknote)", value: "cash" },
  { title: "Education (Book Open)", value: "education" },
];

export default defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      description: "Optional photo for the card header. If left empty, the icon below is used instead.",
    }),
    defineField({
      name: "imagePosition",
      title: "Image Position",
      type: "string",
      options: { list: ["top", "center", "bottom"] },
      initialValue: "center",
      hidden: ({ document }) => !document?.image,
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      options: { list: ICON_OPTIONS },
      description: "Used for the card header when no image is set.",
      hidden: ({ document }) => Boolean(document?.image),
    }),
    defineField({
      name: "info",
      title: "Hover Info",
      type: "text",
      rows: 4,
      description: "Longer detail text revealed on hover/tap.",
    }),
    defineField({
      name: "infoList",
      title: "Hover Info List",
      type: "array",
      of: [
        defineField({
          name: "item",
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "text", title: "Text", type: "string", validation: (rule) => rule.required() }),
          ],
          preview: {
            select: { title: "label", subtitle: "text" },
          },
        }),
      ],
    }),
    defineField({
      name: "infoOutro",
      title: "Hover Info Outro",
      type: "text",
      rows: 2,
      description: "Optional closing line shown after the info list.",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Controls display order on the site (lower numbers first).",
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
    select: { title: "title", subtitle: "description", media: "image" },
  },
});
