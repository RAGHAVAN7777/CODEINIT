import React from "react";

export const Card = ({ className = "", children, ...props }) => (
    <div
        className={`rounded-lg border border-border bg-card text-card-foreground shadow-premium transition-all hover:shadow-lg hover:border-foreground/10 ${className}`}
        {...props}
    >
        {children}
    </div>
);

export const CardHeader = ({ className = "", ...props }) => (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
);

export const CardTitle = ({ className = "", ...props }) => (
    <h3 className={`text-xl font-semibold leading-none tracking-tight ${className}`} {...props} />
);

export const CardContent = ({ className = "", ...props }) => (
    <div className={`p-6 pt-0 ${className}`} {...props} />
);
