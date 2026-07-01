"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { CardContainer, CardBody, CardItem } from "./ui/3d-card";

interface Service {
  title: string;
  desc: string;
  image?: string;
  imagePosition?: "top" | "center" | "bottom";
  info?: string;
  infoList?: { label: string; text: string }[];
  infoOutro?: string;
}

const objectPositionClass = {
  top: "object-top",
  center: "object-center",
  bottom: "object-bottom",
} as const;

const services: Service[] = [
  {
    title: "Legal Representation",
    desc: "Support in workplace disputes and grievances.",
    image: "/images/pic.png",
    info: "Placeholder info: how to request representation and what's covered will go here.",
  },
  {
    title: "Collective Bargaining",
    desc: "Stronger negotiation power for fair wages and benefits.",
    image: "/images/pic.png",
    info: "Placeholder info: current bargaining priorities and timelines will go here.",
  },
  {
    title: "Training & Development",
    desc: "Workshops and programs to enhance skills.",
    image: "/images/pic.png",
    info: "Placeholder info: upcoming workshops and how to sign up will go here.",
  },
  {
    title: "Community Initiatives",
    desc: "Outreach programs to uplift society.",
    image: "/images/pic.png",
    info: "Placeholder info: active outreach programs and how to get involved will go here.",
  },
  {
    title: "Insurance Services",
    desc: "As Partners with the Nagico Insurance Group, DPSU Offers a great health insurance package for it's members.",
    image: "/images/PSU_NAGICO.jpg",
    imagePosition: "top",
    info: "The Dominica Public Service Union (DPSU) partners with Nagico Insurance, a well‑established institution with decades of experience, to provide members with a comprehensive Group Health Scheme. This is one of the most significant benefits negotiated by the DPSU, offering wide‑ranging coverage that includes:",
    infoList: [
      { label: "Hospitalization", text: "Inpatient care, surgery, and recovery costs" },
      { label: "Outpatient Services", text: "Doctor visits, diagnostics, and minor procedures" },
      { label: "Prescription Drugs", text: "Partial or full reimbursement for approved medications" },
      { label: "Maternity Benefits", text: "Coverage for prenatal, delivery, and postnatal care" },
      { label: "Overseas Treatment", text: "Limited coverage for procedures unavailable in Dominica" },
      { label: "Family Coverage", text: "Dependents may be added to the plan" },
    ],
    infoOutro: "Membership benefits under this scheme remain valid for the lifetime of the applicant or member.",
  },
  {
    title: "Instant Kash",
    desc: "DPSU offers a soft loans to it's members.",
    image: "/images/pic.png",
    info: "Placeholder info: loan limits, terms, and how to apply will go here.",
  },
  {
    title: "Education",
    desc: "As Partners with the Cipriani Collage of Labour and Co-Operative studies in Trinidad and Tobago, The DPSU officers scholarships to its members who wishes to study in any related feild being offered.",
    image: "/images/pic.png",
    info: "Placeholder info: scholarship eligibility and application steps will go here.",
  },
];

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <CardContainer className="w-full" containerClassName="py-0">
      <CardBody
        onClick={() => setIsRevealed((prev) => !prev)}
        className="group relative w-full cursor-pointer overflow-hidden rounded-3xl border border-black/10 bg-white p-8 shadow-sm transition hover:border-blue-400/50 hover:shadow-md"
      >
        <CardItem translateZ={40} className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-200/40 blur-3xl transition group-hover:bg-blue-300/40" />

        {service.image && (
          <div className="relative -mx-8 -mt-8 mb-6 h-40 overflow-hidden bg-white">
            <Image
              src={service.image}
              alt={service.title}
              fill
              sizes="(min-width: 640px) 24rem, 90vw"
              className={`object-cover ${objectPositionClass[service.imagePosition ?? "center"]}`}
            />
          </div>
        )}

        <CardItem
          translateZ={60}
          className="relative mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-lg font-semibold text-blue-600"
        >
          {index + 1}
        </CardItem>
        <CardItem as="h3" translateZ={50} className="relative mb-3 text-2xl font-semibold">
          {service.title}
        </CardItem>
        <CardItem as="p" translateZ={30} className="relative w-full text-neutral-500">
          {service.desc}
        </CardItem>

        {service.info && (
          <div
            className={`absolute inset-0 z-20 flex translate-y-4 flex-col rounded-3xl bg-blue-700 p-6 text-white opacity-0 transition duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 ${
              isRevealed ? "translate-y-0 opacity-100" : ""
            }`}
          >
            <h4 className="mb-2 shrink-0 text-lg font-semibold">{service.title}</h4>
            <div className="min-h-0 flex-1 overflow-y-auto pr-1 text-sm leading-relaxed text-blue-50">
              <p className={service.infoList ? "mb-3" : ""}>{service.info}</p>
              {service.infoList && (
                <ul className="mb-3 space-y-1.5">
                  {service.infoList.map((item) => (
                    <li key={item.label}>
                      <span className="font-semibold text-white">{item.label}:</span> {item.text}
                    </li>
                  ))}
                </ul>
              )}
              {service.infoOutro && <p>{service.infoOutro}</p>}
            </div>
          </div>
        )}
      </CardBody>
    </CardContainer>
  );
}

export default function Services() {
  return (
    <section id="services" className="relative bg-neutral-50 py-24 text-neutral-900">
      <div className="mx-auto max-w-6xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center text-4xl font-bold"
        >
          Our Services
        </motion.h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
            >
              <ServiceCard service={service} index={i} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
