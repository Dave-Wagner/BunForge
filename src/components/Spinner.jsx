import React from "react";

/**
 * Spinner Component
 * A generic spinner using inline SVG that serves as a fallback while content is loading.
 *
 * @returns {JSX.Element} The spinner element.
 */
const Spinner = () => (
  <div
    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
  >
    <svg width="24" height="24" viewBox="0 0 50 50">
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="#3498db"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="31.415, 31.415"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 25 25"
          to="360 25 25"
          dur="1s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  </div>
);

export default Spinner;
