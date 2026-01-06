
import { useEffect } from "react";

interface ScrollToTopProps {
  /** The value to watch for changes to trigger the scroll (e.g., activeTab or view) */
  watch: any;
}

export default function ScrollToTop({ watch }: ScrollToTopProps) {
  useEffect(() => {
    // 1. Reset window scroll
    window.scrollTo(0, 0);

    // 2. Target the specific scroll container in the main app layout
    // In our App.tsx, the scrollable area is the div with 'overflow-y-auto'
    const scrollContainer = document.querySelector('.overflow-y-auto');
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto" // Instant reset for better UX during navigation
      });
    }
  }, [watch]);

  return null;
}
