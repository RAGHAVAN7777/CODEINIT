import { motion } from 'framer-motion';

export const RoleToggle = ({ role, setRole }) => {
    return (
        <div className="relative flex p-1 bg-muted rounded-lg w-full max-w-[300px] mb-6">
            <motion.div
                className="absolute inset-y-1 bg-background rounded-md shadow-sm border border-border"
                initial={false}
                animate={{ x: role === 'faculty' ? '0%' : '100%', width: '50%' }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
            <button
                type="button"
                onClick={() => setRole('faculty')}
                className={`relative z-10 w-1/2 py-2 text-sm font-medium transition-colors ${role === 'faculty' ? 'text-foreground' : 'text-muted-foreground'}`}
            >
                Faculty
            </button>
            <button
                type="button"
                onClick={() => setRole('student')}
                className={`relative z-10 w-1/2 py-2 text-sm font-medium transition-colors ${role === 'student' ? 'text-foreground' : 'text-muted-foreground'}`}
            >
                Student
            </button>
        </div>
    );
};
