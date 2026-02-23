import React from "react";

export const Input = React.forwardRef(({ className = "", type = "text", error, label, ...props }, ref) => {
    return (
        <div className="w-full space-y-1.5 text-left">
            {label && (
                <label className="text-xs font-semibold text-foreground/70 ml-0.5 uppercase tracking-wider">
                    {label}
                </label>
            )}
            <input
                type={type}
                className={`flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/5 focus-visible:border-foreground/30 disabled:cursor-not-allowed disabled:opacity-50 transition-all ${error ? "border-red-500 focus-visible:ring-red-500" : ""
                    } ${className}`}
                ref={ref}
                {...props}
            />
            {error && <p className="text-[10px] text-red-500 font-medium mt-1 ml-0.5">{error}</p>}
        </div>
    );
});
Input.displayName = "Input";
