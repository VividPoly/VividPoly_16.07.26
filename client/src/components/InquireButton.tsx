import { Link } from "wouter";
import { MessageSquare } from "lucide-react";

export default function InquireButton() {
  return (
    <Link href="/inquiries">
      <button className="fixed left-0 top-1/2 -translate-y-1/2 bg-[#DC2626] text-white px-3 py-6 rounded-r-lg shadow-lg hover:bg-[#DC2626] transition-colors z-40 flex flex-col items-center gap-1">
        <MessageSquare className="w-5 h-5" />
        <span 
          className="text-xs font-semibold"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          INQUIRE
        </span>
      </button>
    </Link>
  );
}
