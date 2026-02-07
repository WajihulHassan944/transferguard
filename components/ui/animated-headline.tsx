import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedHeadlineProps {
  lines: {
    text: string;
    className?: string;
  }[];
  className?: string;
  wordDelay?: number;
  lineDelay?: number;
}

export const AnimatedHeadline = ({
  lines,
  className,
  wordDelay = 100,
  lineDelay = 300,
}: AnimatedHeadlineProps) => {
  const [visibleWords, setVisibleWords] = useState<number[][]>([]);

  useEffect(() => {
    // Initialize with empty arrays for each line
    setVisibleWords(lines.map(() => []));

    let totalDelay = 0;
    const timeouts: NodeJS.Timeout[] = [];

    lines.forEach((line, lineIndex) => {
      const words = line.text.split(" ");
      
      // Add line delay for subsequent lines
      if (lineIndex > 0) {
        totalDelay += lineDelay;
      }

      words.forEach((_, wordIndex) => {
        const timeout = setTimeout(() => {
          setVisibleWords((prev) => {
            const newState = [...prev];
            newState[lineIndex] = [...(newState[lineIndex] || []), wordIndex];
            return newState;
          });
        }, totalDelay);
        
        timeouts.push(timeout);
        totalDelay += wordDelay;
      });
    });

    return () => {
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, [lines, wordDelay, lineDelay]);

  return (
    <h1 className={cn("text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1]", className)}>
      {lines.map((line, lineIndex) => {
        const words = line.text.split(" ");
        return (
          <span key={lineIndex} className={cn("block", lineIndex > 0 && "mt-2", line.className)}>
            {words.map((word, wordIndex) => {
              const isVisible = visibleWords[lineIndex]?.includes(wordIndex);
              return (
                <span
                  key={wordIndex}
                  className={cn(
                    "inline-block transition-all duration-300 ease-out",
                    isVisible 
                      ? "opacity-100 translate-y-0 blur-0" 
                      : "opacity-0 translate-y-4 blur-sm"
                  )}
                >
                  {word}
                  {wordIndex < words.length - 1 && "\u00A0"}
                </span>
              );
            })}
          </span>
        );
      })}
    </h1>
  );
};
