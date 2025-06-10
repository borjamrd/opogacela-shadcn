"use client";

import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

interface HtmlPreviewProps {
  htmlContent: string;
}

export default function HtmlPreview({ htmlContent }: HtmlPreviewProps) {
  const [currentContent, setCurrentContent] = useState("");

  // Debounce the update to avoid too frequent iframe re-renders
  useEffect(() => {
    const handler = setTimeout(() => {
      setCurrentContent(htmlContent);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [htmlContent]);

  return (
    <div className="flex flex-col h-full w-full">
      <iframe
        srcDoc={currentContent}
        title="HTML Preview"
        sandbox="allow-scripts allow-same-origin" // Adjust sandbox attributes as needed for security vs functionality
        className="flex-grow w-full h-full border rounded-md shadow-sm bg-white min-h-[300px] lg:min-h-0"
        aria-label="HTML Live Preview"
      />
    </div>
  );
}
