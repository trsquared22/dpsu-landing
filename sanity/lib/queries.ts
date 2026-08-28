import type { SanityImageSource } from "@sanity/image-url";

import { client } from "./client";
import { urlForImage } from "./image";

export interface NewsPostData {
  title: string;
  desc: string;
}

export interface ServiceData {
  title: string;
  desc: string;
  image?: string;
  imagePosition?: "top" | "center" | "bottom";
  icon?: string;
  info?: string;
  infoList?: { label: string; text: string }[];
  infoOutro?: string;
}

export interface StewardData {
  name: string;
  phone?: string;
  email?: string;
}

export interface ShopStewardData {
  entity: string;
  stewards: StewardData[];
}

export interface EstablishmentData {
  entity: string;
  subOptions?: string[];
}

export interface CarouselSlideData {
  src: string;
  alt: string;
  caption?: string;
  fit: "cover" | "contain";
}

export interface AboutPillarData {
  title: string;
  desc: string;
}

export interface SiteSettingsData {
  contactEmail?: string;
  contactPhone?: string;
  facebookUrl?: string;
  aboutThemeLabel?: string;
  aboutThemeText?: string;
  aboutPillars?: AboutPillarData[];
  aboutValues?: string[];
}

interface RawService {
  title: string;
  description: string;
  image?: SanityImageSource;
  imagePosition?: "top" | "center" | "bottom";
  icon?: string;
  info?: string;
  infoList?: { label: string; text: string }[];
  infoOutro?: string;
}

interface RawCarouselSlide {
  image: SanityImageSource;
  caption?: string;
  alt?: string;
  showFullImage?: boolean;
}

// perspective: "published" pins every query to published content only - without
// it, this API version can silently return an empty result set for documents
// that have never been opened as a draft in Studio (seen with freshly
// API-created carouselSlide docs). The /api/revalidate webhook is the primary
// freshness mechanism (near-instant on publish); this revalidate window is
// just a safety net in case that webhook is ever missed.
const FETCH_OPTIONS = { next: { revalidate: 60 }, perspective: "published" } as const;

const newsPostsQuery = /* groq */ `*[_type == "newsPost"] | order(date desc){ title, description }`;

const servicesQuery = /* groq */ `*[_type == "service"] | order(order asc, _createdAt asc){
  title, description, image, imagePosition, icon, info, infoList, infoOutro
}`;

const shopStewardsQuery = /* groq */ `*[_type == "shopSteward"] | order(order asc, _createdAt asc){
  entity, stewards[]{ name, phone, email }
}`;

const establishmentsQuery = /* groq */ `*[_type == "shopSteward"] | order(order asc, _createdAt asc){ entity, subOptions }`;

const carouselSlidesQuery = /* groq */ `*[_type == "carouselSlide"] | order(order asc, _createdAt asc){
  image, caption, alt, showFullImage
}`;

const siteSettingsQuery = /* groq */ `*[_type == "siteSettings"][0]{
  contactEmail, contactPhone, facebookUrl,
  aboutThemeLabel, aboutThemeText, aboutPillars, aboutValues
}`;

export async function getNewsPosts(): Promise<NewsPostData[]> {
  const posts = await client.fetch<{ title: string; description: string }[]>(
    newsPostsQuery,
    {},
    FETCH_OPTIONS
  );
  return posts.map((post) => ({ title: post.title, desc: post.description }));
}

export async function getServices(): Promise<ServiceData[]> {
  const services = await client.fetch<RawService[]>(servicesQuery, {}, FETCH_OPTIONS);
  return services.map((service) => ({
    title: service.title,
    desc: service.description,
    image: service.image ? urlForImage(service.image).width(768).height(320).url() : undefined,
    imagePosition: service.imagePosition,
    icon: service.icon,
    info: service.info,
    infoList: service.infoList,
    infoOutro: service.infoOutro,
  }));
}

export async function getShopStewards(): Promise<ShopStewardData[]> {
  return client.fetch<ShopStewardData[]>(shopStewardsQuery, {}, FETCH_OPTIONS);
}

export async function getEstablishments(): Promise<EstablishmentData[]> {
  return client.fetch<EstablishmentData[]>(establishmentsQuery, {}, FETCH_OPTIONS);
}

export async function getCarouselSlides(): Promise<CarouselSlideData[]> {
  const slides = await client.fetch<RawCarouselSlide[]>(carouselSlidesQuery, {}, FETCH_OPTIONS);
  return slides.map((slide) => ({
    src: slide.showFullImage
      ? urlForImage(slide.image).width(1600).url()
      : urlForImage(slide.image).width(1600).height(900).url(),
    alt: slide.alt || slide.caption || "DPSU carousel image",
    caption: slide.caption,
    fit: slide.showFullImage ? "contain" : "cover",
  }));
}

export async function getSiteSettings(): Promise<SiteSettingsData> {
  const settings = await client.fetch<SiteSettingsData | null>(
    siteSettingsQuery,
    {},
    FETCH_OPTIONS
  );
  return settings ?? {};
}
