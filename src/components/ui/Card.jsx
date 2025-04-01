import React from "react";

export function Card({ className, ...props }) {
  return (
    <div
      className={`bg-gray-900 text-white shadow-sm rounded-xl ${className}`}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }) {
  return <div className={`p-4 ${className}`} {...props} />;
}
