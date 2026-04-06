import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
  as?: "div" | "button" | "a";
  href?: string;
}

export default function Card({ children, className = "", hover = true, style, onClick, as: Tag = "div", href }: CardProps) {
  const base = `surface rounded-2xl transition-all duration-300 ${hover ? "grad-border" : ""} ${className}`;
  if (Tag === "button") {
    return (
      <button className={base} style={style} onClick={onClick}>
        {children}
      </button>
    );
  }
  if (Tag === "a") {
    return (
      <a className={base} style={style} href={href}>
        {children}
      </a>
    );
  }
  return (
    <div className={base} style={style} onClick={onClick}>
      {children}
    </div>
  );
}
