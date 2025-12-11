import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { portalApi, setAuthToken } from "@/services/apiClient";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function PortalVerify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"verifying" | "error">(() =>
    token ? "verifying" : "error",
  );

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        const { accessToken } = await portalApi.verifyToken(token);
        setAuthToken(accessToken);
        toast.success("Successfully logged in!");
        navigate("/portal/projects");
      } catch (error) {
        console.error(error);
        setStatus("error");
        toast.error("Invalid or expired link");
      }
    };

    verify();
  }, [token, navigate]);

  if (status === "error") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-2">Login Failed</h1>
        <p className="text-slate-600 mb-4">
          The link is invalid or has expired.
        </p>
        <button
          className="text-blue-600 hover:underline"
          onClick={() => navigate("/portal/login")}
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
      <p className="text-slate-600">Verifying your access...</p>
    </div>
  );
}
