import { useState } from "react";
import { useForm } from "react-hook-form";
import { portalApi } from "@/services/apiClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function PortalLogin() {
    const { register, handleSubmit, formState: { errors } } = useForm<{ email: string }>();
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const onSubmit = async (data: { email: string }) => {
        setLoading(true);
        try {
            await portalApi.requestLink(data.email);
            setSent(true);
            toast.success("Magic Link sent!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to request link. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Check your inbox</CardTitle>
                        <CardDescription>
                            We have sent a magic link to your email address. Please click the link to log in.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button variant="outline" className="w-full" onClick={() => setSent(false)}>Back to Login</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Customer Portal</CardTitle>
                    <CardDescription>
                        Enter your email address to receive a secure login link.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@company.com"
                                {...register("email", { required: "Email is required" })}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Send Magic Link
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
