import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// Premium auto-rotating showcase that replaces the old static "Product by Use"
// card grid on the home page. Full-width cinematic slides give the site the
// industrial, high-end feel while still routing to the product-by-use page.
type Slide = {
  image: string;
  eyebrow: string;
  title: string;
  copy: string;
};

const SLIDES: Slide[] = [
  {
    image: "/media/3_weedbarrier_vividpoly_Usage_export_cc1ca5bb.webp",
    eyebrow: "Agriculture",
    title: "Weed Barrier & Ground Cover",
    copy: "UV-stabilised woven fabric for horticulture, nurseries and landscaping, engineered for years of outdoor service.",
  },
  {
    image: "/industries/rice-product.jpg",
    eyebrow: "Food & Grains",
    title: "Rice, Sugar & Flour Packing",
    copy: "Food-grade BOPP and laminated woven sacks that keep grains fresh and shelf-ready for export markets.",
  },
  {
    image: "/media/cement-chemical_851cfe59.jpg",
    eyebrow: "Construction",
    title: "Cement, Minerals & Chemicals",
    copy: "Sift-proof valve and block-bottom sacks built for automated filling of powders and building materials.",
  },
  {
    image: "/media/carry-bag-black_58a9284f.webp",
    eyebrow: "Retail",
    title: "Custom Printed Carry Bags",
    copy: "Durable, vividly printed woven shopping bags that carry your brand across every touchpoint.",
  },
  {
    image: "/media/fabric-rolls_faa8de4c.jpg",
    eyebrow: "Industry",
    title: "PP Woven Fabric Rolls",
    copy: "Coated and uncoated fabric on rolls in custom width and GSM for converters and bag makers worldwide.",
  },
];

export default function ShowcaseSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const go = (dir: 1 | -1) =>
    setIndex((i) => (i + dir + SLIDES.length) % SLIDES.length);

  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <span className="text-[#DC2626] text-xs font-bold uppercase tracking-widest">Applications</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mt-3">Packaging in Action</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            From 50kg polypropylene woven sacks to custom printed carry bags
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto overflow-hidden rounded-2xl shadow-2xl">
          <div className="relative h-[360px] md:h-[460px]">
            {SLIDES.map((s, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-opacity duration-1000 ${i === index ? "opacity-100" : "opacity-0 pointer-events-none"}`}
              >
                <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-center max-w-xl p-8 md:p-14 text-white">
                  <span className="text-[#EF4444] text-xs font-bold uppercase tracking-widest">{s.eyebrow}</span>
                  <h3 className="text-2xl md:text-4xl font-bold mt-2">{s.title}</h3>
                  <p className="mt-3 text-white/85 text-sm md:text-base">{s.copy}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => go(-1)}
            aria-label="Previous"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 text-[#1A1A1A] flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 text-[#1A1A1A] flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2.5 rounded-full transition-all ${i === index ? "bg-[#DC2626] w-8" : "bg-white/60 w-2.5"}`}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <Link href="/product-by-use">
            <button className="btn-primary text-sm px-8 py-3 inline-flex items-center">
              View All Applications
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
