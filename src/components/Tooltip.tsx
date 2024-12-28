import React, { ReactNode, useState } from "react";

interface TooltipProps {
  text: string; // Tooltip content
  children: ReactNode; // Triggering element
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setTooltipPosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Trigger Element */}
      {children}

      {/* Tooltip Content */}
      {isVisible && (
        <div
          className="fixed bg-gray-800 whitespace-nowrap text-white text-sm rounded py-1 px-2 shadow-lg pointer-events-none"
          style={{
            top: tooltipPosition.y + 10, // Position slightly below the cursor
            left: tooltipPosition.x + 10, // Position slightly to the right of the cursor
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
