import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GraduationCap, Mail, Lock, ArrowRight, Github, Chrome, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Auth() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Mock Authentication Logic
        setTimeout(() => {
            setIsLoading(false);

            if (password !== "password123") {
                toast.error("Invalid password. Please use 'password123'.");
                return;
            }

            if (email === "teacher@pms.com") {
                toast.success("Welcome, Teacher!");
                navigate("/teacher");
            } else if (email === "schoolleader@pms.com") {
                toast.success("Welcome, School Leader!");
                navigate("/leader");
            } else if (email === "admin@pms.com") {
                toast.success("Welcome, Administrator!");
                navigate("/admin");
            } else {
                toast.error("Invalid email. Please use one of the test emails.");
            }
        }, 1200);
    };

    const handleSSO = (provider: string) => {
        setIsLoading(true);
        toast.info(`Redirecting to ${provider} login...`);
        setTimeout(() => {
            setIsLoading(false);
            toast.success(`${provider} login successful!`);
            navigate("/teacher"); // Default to teacher for SSO demo
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
            <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="text-center">
                    <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
                        <div className="p-2 rounded-lg bg-primary text-primary-foreground group-hover:scale-110 transition-transform">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold text-foreground tracking-tight">PD Platform</span>
                    </Link>
                    <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                        Sign in to your professional development account
                    </p>
                </div>

                <Alert className="bg-primary/5 border-primary/20">
                    <AlertCircle className="h-4 w-4 text-primary" />
                    <AlertDescription className="text-xs text-primary/80">
                        <strong>Test Credentials:</strong> teacher@pms.com, schoolleader@pms.com, or admin@pms.com with password123
                    </AlertDescription>
                </Alert>

                <Card className="border-none shadow-2xl bg-background/80 backdrop-blur-md overflow-hidden">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
                        <CardDescription>
                            Enter your test credentials to access your dashboard
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@pms.com"
                                        className="pl-10 h-11"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link
                                        to="#"
                                        className="text-xs text-primary hover:underline font-medium"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10 h-11"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <Button className="w-full h-11 text-base font-semibold" type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        Signing in...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Sign In
                                        <ArrowRight className="w-4 h-4" />
                                    </span>
                                )}
                            </Button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-muted" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground font-medium">
                                    Or continue with organization
                                </span>
                            </div>
                        </div>

                        <div className="grid gap-3">
                            <Button
                                variant="outline"
                                className="w-full h-11 flex items-center justify-center gap-3 border shadow-sm hover:bg-muted/50 transition-all font-medium"
                                onClick={() => handleSSO("Google")}
                                disabled={isLoading}
                            >
                                <Chrome className="w-5 h-5 text-[#4285F4]" />
                                Google
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full h-11 flex items-center justify-center gap-3 border shadow-sm hover:bg-muted/50 transition-all font-medium"
                                onClick={() => handleSSO("Microsoft")}
                                disabled={isLoading}
                            >
                                <svg className="w-5 h-5" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="#f3f3f3" d="M0 0h23v23H0z" />
                                    <path fill="#f35325" d="M1 1h10v10H1z" />
                                    <path fill="#81bc06" d="M12 1h10v10H12z" />
                                    <path fill="#05a6f0" d="M1 12h10v10H1z" />
                                    <path fill="#ffba08" d="M12 12h10v10H12z" />
                                </svg>
                                Microsoft 365
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full h-11 flex items-center justify-center gap-3 border shadow-sm hover:bg-muted/50 transition-all font-medium"
                                onClick={() => handleSSO("GitHub")}
                                disabled={isLoading}
                            >
                                <Github className="w-5 h-5" />
                                GitHub
                            </Button>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 bg-muted/30 py-6">
                        <p className="text-xs text-center text-muted-foreground px-8 leading-relaxed">
                            By signing in, you agree to our <Link to="#" className="underline">Terms of Service</Link> and <Link to="#" className="underline">Privacy Policy</Link>.
                        </p>
                    </CardFooter>
                </Card>

                <p className="text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link to="#" className="font-semibold text-primary hover:underline">
                        Contact your administrator
                    </Link>
                </p>
            </div>
        </div>
    );
}
