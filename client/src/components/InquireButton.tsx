import { Link } from "wouter";
import { MessageSquare } from "lucide-react";

export default function InquireButton() {
  return (
    <Link href="/inquiries">
      {/* Lower-left on phones so it never overlaps body text; vertically
          centred on the left edge from md up where there is room. */}
      <button className="fixed left-0 bottom-24 md:bottom-auto md:top-1/2 md:-translate-y-1/2 bg-[#DC2626] text-white px-2 py-4 md:px-2.5 md:py-5 rounded-r-lg shadow-lg hover:bg-[#B91C1C] transition-colors z-40 flex flex-col items-center gap-1">
        <MessageSquare className="w-4 h-4 md:w-5 md:h-5" />
        <span
          className="text-[10px] md:text-xs font-semibold tracking-wide"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          INQUIRE
        </span>
      </button>
    </Link>
  );
}
