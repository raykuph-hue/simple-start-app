import { forwardRef } from "react";
import { Link } from "react-router-dom";
import logoImage from "/logo.png";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  linkTo?: string;
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

const textSizeClasses = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
};

export const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ size = "md", showText = true, linkTo = "/", className = "" }, ref) => {
    const content = (
      <div ref={ref} className={`flex items-center gap-2 ${className}`}>
        <div className={`${sizeClasses[size]} rounded-lg overflow-hidden flex items-center justify-center glow-sm`}>
          <img 
            src={logoImage} 
            alt="Phosify" 
            className="w-full h-full object-cover"
          />
        </div>
        {showText && (
          <span className={`${textSizeClasses[size]} font-bold`}>Phosify</span>
        )}
      </div>
    );

    if (linkTo) {
      return <Link to={linkTo}>{content}</Link>;
    }

    return content;
  }
);

Logo.displayName = "Logo";
