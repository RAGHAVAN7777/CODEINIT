import React, { createContext, useContext, useState, useEffect } from "react";

import { authService } from "../services/auth.service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = sessionStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [studyTime, setStudyTime] = useState(() => {
        const savedTime = sessionStorage.getItem("studyTime");
        return savedTime ? parseInt(savedTime, 10) : 0;
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setStudyTime(prev => {
                const newTime = prev + 1;
                sessionStorage.setItem("studyTime", newTime.toString());
                return newTime;
            });
        }, 60000); // Increment every minute

        return () => clearInterval(timer);
    }, []);

    const login = async (email, password, role) => {
        try {
            const data = await authService.login(email, password, role);
            const userData = { ...data.user, token: data.token };
            setUser(userData);
            sessionStorage.setItem("user", JSON.stringify(userData));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Login failed"
            };
        }
    };

    const signup = async (userData) => {
        try {
            const data = await authService.register(userData);
            const authData = { ...data.user, token: data.token };
            setUser(authData);
            sessionStorage.setItem("user", JSON.stringify(authData));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Registration failed"
            };
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, studyTime }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
