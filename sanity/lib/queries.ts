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

export interface ShopStewardData {
  entity: string;
  stewardNames: string;
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

// Fall back to Next's default fetch cache; the /api/revalidate webhook
// invalidates it on-demand, this is just a safety net if a webhook is missed.
const FETCH_OPTIONS = { next: { revalidate: 3600 } } as const;

const newsPostsQuery = /* groq */ `*[_type == "newsPost"] | order(date desc){ title, description }`;

const servicesQuery = /* groq */ `*[_type == "service"] | order(order asc, _createdAt asc){
  title, description, image, imagePosition, icon, info, infoList, infoOutro
}`;

const shopStewardsQuery = /* groq */ `*[_type == "shopSteward"] | order(order asc, _createdAt asc){ entity, stewardNames }`;

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

export async function getSiteSettings(): Promise<SiteSettingsData> {
  const settings = await client.fetch<SiteSettingsData | null>(
    siteSettingsQuery,
    {},
    FETCH_OPTIONS
  );
  return settings ?? {};
}
