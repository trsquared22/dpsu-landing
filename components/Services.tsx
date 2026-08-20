"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Scale,
  Handshake,
  GraduationCap,
  HeartHandshake,
  Banknote,
  BookOpen,
} from "lucide-react";
import { CardContainer, CardBody, CardItem } from "./ui/3d-card";

interface Service {
  title: string;
  desc: string;
  image?: string;
  imagePosition?: "top" | "center" | "bottom";
  icon?: string; // key into `icons` below; used when there's no dedicated photo yet
  info?: string;
  infoList?: { label: string; text: string }[];
  infoOutro?: string;
}

const icons = {
  legal: Scale,
  bargaining: Handshake,
  training: GraduationCap,
  community: HeartHandshake,
  cash: Banknote,
  education: BookOpen,
};

const objectPositionClass = {
  top: "object-top",
  center: "object-center",
  bottom: "object-bottom",
} as const;

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <CardContainer className="w-full" containerClassName="py-0">
      <CardBody
        onClick={() => setIsRevealed((prev) => !prev)}
        className="group relative w-full cursor-pointer overflow-hidden rounded-3xl border border-black/10 bg-white p-8 shadow-sm transition hover:border-gold/50 hover:shadow-md"
      >
        <CardItem translateZ={40} className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold/20 blur-3xl transition group-hover:bg-gold/30" />

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

        {!service.image && service.icon && icons[service.icon as keyof typeof icons] && (
          <div className="relative -mx-8 -mt-8 mb-6 flex h-40 items-center justify-center bg-gradient-to-br from-forest to-forest-light">
            {(() => {
              const Icon = icons[service.icon as keyof typeof icons];
              return <Icon strokeWidth={1.2} className="h-16 w-16 text-gold" />;
            })()}
          </div>
        )}

        <CardItem
          translateZ={60}
          className="relative mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-gold/40 bg-gold/10 text-lg font-semibold text-forest"
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
            className={`absolute inset-0 z-20 flex translate-y-4 flex-col rounded-3xl bg-forest p-6 text-white opacity-0 transition duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 ${
              isRevealed ? "translate-y-0 opacity-100" : ""
            }`}
          >
            <h4 className="mb-2 shrink-0 text-lg font-semibold">{service.title}</h4>
            <div className="min-h-0 flex-1 overflow-y-auto pr-1 text-sm leading-relaxed text-white/85">
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

export default function Services({ services }: { services: Service[] }) {
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
