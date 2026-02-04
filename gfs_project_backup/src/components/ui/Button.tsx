"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost" | "destructive";
    size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    // Variants
                    variant === "default" &&
                    "bg-primary text-white shadow-lg hover:bg-primary/90 hover:shadow-xl",
                    variant === "outline" &&
                    "border-2 border-primary text-primary bg-transparent hover:bg-primary/10",
                    variant === "ghost" &&
                    "text-primary hover:bg-primary/10",
                    variant === "destructive" &&
                    "bg-red-500 text-white hover:bg-red-600",
                    // Sizes
                    size === "default" && "h-12 px-6 py-3 text-base",
                    size === "sm" && "h-9 px-4 py-2 text-sm",
                    size === "lg" && "h-14 px-8 py-4 text-lg",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };
