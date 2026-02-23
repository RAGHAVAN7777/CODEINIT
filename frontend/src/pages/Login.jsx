import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { RoleToggle } from "../components/ui/RoleToggle";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const [role, setRole] = useState("student");
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        setTimeout(() => {
            setIsLoading(false);
            if (credentials.email === "." && credentials.password === ".") {
                login(role);
                navigate("/dashboard");
            } else {
                setError("Invalid credentials. Hint: Use '.' for both fields.");
            }
        }, 800);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative">
            <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-[400px]"
            >
                <div className="text-center mb-8">
                    <div className="w-10 h-10 bg-foreground rounded flex items-center justify-center text-background mx-auto mb-4 font-bold">C</div>
                    <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
                    <p className="text-muted-foreground text-sm mt-1 font-normal">Choose your role and enter credentials</p>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <RoleToggle role={role} setRole={setRole} />

                    <Card className="w-full border border-border shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg">Login as {role === "faculty" ? "Faculty" : "Student"}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin} className="space-y-4">
                                <Input
                                    label="Username / Email"
                                    placeholder="Enter '.'"
                                    type="text"
                                    name="email"
                                    value={credentials.email}
                                    onChange={handleChange}
                                    required
                                />
                                <div className="space-y-1">
                                    <Input
                                        label="Password"
                                        placeholder="Enter '.'"
                                        type="password"
                                        name="password"
                                        value={credentials.password}
                                        onChange={handleChange}
                                        required
                                        error={error}
                                    />
                                    <div className="flex justify-end pr-0.5">
                                        <button type="button" className="text-[10px] text-muted-foreground font-medium hover:text-foreground">
                                            Forgot password?
                                        </button>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full py-2.5 mt-2" isLoading={isLoading}>
                                    {isLoading ? "Checking..." : "Sign In"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <p className="text-center text-sm text-muted-foreground mt-6">
                    New here?{" "}
                    <Link to="/signup" className="text-foreground font-semibold hover:underline">
                        Create account
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
