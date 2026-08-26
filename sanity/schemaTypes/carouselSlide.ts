import { defineField, defineType } from "sanity";

export default defineType({
  name: "carouselSlide",
  title: "Carousel Slide",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      description: "Set the hotspot on the subject so cropping keeps it in frame at every screen size.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Short line shown over the image in the carousel.",
    }),
    defineField({
      name: "alt",
      title: "Alt Text",
      type: "string",
      description: "Describes the image for screen readers. Falls back to the caption if left blank.",
    }),
    defineField({
      name: "showFullImage",
      title: "Show full image (no cropping)",
      type: "boolean",
      initialValue: false,
      description:
        "Turn on for posters or graphics with text, so nothing gets cropped off. Leave off for regular photos so they fill the frame.",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Controls slide order in the carousel (lower numbers first).",
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
    select: { title: "caption", media: "image" },
    prepare({ title, media }) {
      return { title: title || "Untitled slide", media };
    },
  },
});
