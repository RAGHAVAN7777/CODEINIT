import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { RoleToggle } from "../components/ui/RoleToggle";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
    const [isLoading, setIsLoading] = useState(false);
    const [role, setRole] = useState("student");
    const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { signup } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const result = await signup({
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            password: formData.password,
            role: role
        });

        setIsLoading(false);
        if (result.success) {
            navigate("/dashboard");
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative py-12">
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
                    <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
                    <p className="text-muted-foreground text-sm mt-1 font-normal">Start organizing your academic life</p>
                </div>

                <div className="flex flex-col items-center">
                    <RoleToggle role={role} setRole={setRole} />

                    <Card className="w-full border border-border shadow-sm mt-2">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg">Register as {role === "faculty" ? "Faculty" : "Student"}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSignup} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="First Name"
                                        placeholder="John"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Input
                                        label="Last Name"
                                        placeholder="Doe"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <Input
                                    label="Email"
                                    placeholder="name@university.edu"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    label="Password"
                                    placeholder="••••••••"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    error={error}
                                />
                                <Button type="submit" className="w-full py-2.5 mt-2" isLoading={isLoading}>
                                    {isLoading ? "Creating..." : "Create Account"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <p className="text-center text-sm text-muted-foreground mt-8">
                    Member already?{" "}
                    <Link to="/login" className="text-foreground font-semibold hover:underline">
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
