import React from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";

export function RoleToggleSwitch({ role, setRole }) {
    return (
        <div className="flex items-center p-1 bg-muted rounded-xl w-fit">
            <button
                type="button"
                onClick={() => setRole("student")}
                className={clsx(
                    "relative px-6 py-2 text-sm font-semibold rounded-lg transition-colors z-10",
                    role === "student" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
            >
                {role === "student" && (
                    <motion.div
                        layoutId="role-active"
                        className="absolute inset-0 bg-primary rounded-lg -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                )}
                Student
            </button>
            <button
                type="button"
                onClick={() => setRole("faculty")}
                className={clsx(
                    "relative px-6 py-2 text-sm font-semibold rounded-lg transition-colors z-10",
                    role === "faculty" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
            >
                {role === "faculty" && (
                    <motion.div
                        layoutId="role-active"
                        className="absolute inset-0 bg-primary rounded-lg -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                )}
                Faculty
            </button>
        </div>
    );
}
