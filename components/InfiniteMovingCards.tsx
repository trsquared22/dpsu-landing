"use client";

type Item = {
  title: string;
  desc: string;
};

export default function InfiniteMovingCards({
  items,
  speedSeconds = 40,
}: {
  items: Item[];
  speedSeconds?: number;
}) {
  const track = [...items, ...items];

  return (
    <div
      className="marquee-track relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]"
    >
      <ul
        className="animate-marquee flex w-max gap-6"
        style={{ ["--marquee-duration" as string]: `${speedSeconds}s` }}
      >
        {track.map((item, i) => (
          <li
            key={`${item.title}-${i}`}
            className="w-[320px] shrink-0 rounded-3xl border border-black/10 bg-neutral-50 p-6 shadow-sm"
          >
            <p className="mb-4 text-3xl text-blue-500/40">&ldquo;</p>
            <p className="mb-4 text-neutral-600">{item.desc}</p>
            <p className="text-sm font-semibold text-neutral-900">{item.title}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
