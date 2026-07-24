import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// "Packaging in Action" — a peek carousel of application scenes with working
// prev/next arrows plus a gentle auto-scroll. Cards link to the product-by-use
// page; a "View All Products" button sits below.
type Slide = {
  image: string;
  eyebrow: string;
  title: string;
};

const SLIDES: Slide[] = [
  { image: "/media/3_weedbarrier_vividpoly_Usage_export_cc1ca5bb.webp", eyebrow: "Agriculture", title: "Weed Barrier & Ground Cover" },
  { image: "/industries/rice-product.jpg", eyebrow: "Food & Grains", title: "Rice, Sugar & Flour Packing" },
  { image: "/media/cement-chemical_851cfe59.jpg", eyebrow: "Construction", title: "Cement, Minerals & Chemicals" },
  { image: "/media/carry-bag-black_58a9284f.webp", eyebrow: "Retail", title: "Custom Printed Carry Bags" },
  { image: "/media/fabric-rolls_faa8de4c.jpg", eyebrow: "Industry", title: "PP Woven Fabric Rolls" },
  { image: "/media/animal-feed-product_dbdf3256.jpg", eyebrow: "Feed", title: "Poultry, Cattle & Pet Feed" },
];

export default function ShowcaseSlider() {
  const track = useRef<HTMLDivElement>(null);

  const step = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.9, 460), behavior: "smooth" });
  };

  // Gentle auto-scroll; loops back to the start when it reaches the end.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const timer = setInterval(() => {
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 8) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: el.clientWidth * 0.5, behavior: "smooth" });
      }
    }, 4000);
    return () => clearInterval(timer);
  }, []);

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

        <div className="relative">
          <div
            ref={track}
            className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {SLIDES.map((s, i) => (
              <Link
                key={i}
                href="/product-by-use"
                className="group relative snap-start shrink-0 w-[82%] sm:w-[48%] lg:w-[38%] overflow-hidden rounded-2xl"
              >
                <div className="relative h-72 md:h-80">
                  <img src={s.image} alt={s.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <span className="text-[#EF4444] text-xs font-bold uppercase tracking-widest">{s.eyebrow}</span>
                    <h3 className="mt-1 text-xl font-bold">{s.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Slide arrows */}
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous"
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 hidden h-11 w-11 place-items-center rounded-full bg-[#DC2626] text-white shadow-lg transition hover:bg-[#B91C1C] md:grid"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next"
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 hidden h-11 w-11 place-items-center rounded-full bg-[#DC2626] text-white shadow-lg transition hover:bg-[#B91C1C] md:grid"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="text-center mt-10">
          <Link href="/products">
            <button className="btn-primary text-sm px-8 py-3 inline-flex items-center">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
