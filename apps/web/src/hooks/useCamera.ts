import { useState, useRef, useCallback, useEffect } from "react";

interface CameraState {
  isActive: boolean;
  isLoading: boolean;
  error: string | null;
  stream: MediaStream | null;
}

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<CameraState>({
    isActive: false,
    isLoading: false,
    error: null,
    stream: null,
  });

  const startCamera = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Check if camera is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Kamera wird von diesem Browser nicht unterstützt");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setState({
        isActive: true,
        isLoading: false,
        error: null,
        stream,
      });
    } catch (error) {
      let message = "Kamera konnte nicht gestartet werden";
      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          message =
            "Kamerazugriff wurde verweigert. Bitte erlauben Sie den Zugriff in den Browser-Einstellungen.";
        } else if (error.name === "NotFoundError") {
          message = "Keine Kamera gefunden";
        } else {
          message = error.message;
        }
      }
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (state.stream) {
      state.stream.getTracks().forEach((track) => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setState({
      isActive: false,
      isLoading: false,
      error: null,
      stream: null,
    });
  }, [state.stream]);

  const captureImage = useCallback((): string | null => {
    if (!videoRef.current || !state.isActive) return null;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL("image/jpeg", 0.9);
  }, [state.isActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (state.stream) {
        state.stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [state.stream]);

  return {
    videoRef,
    ...state,
    startCamera,
    stopCamera,
    captureImage,
  };
}

export default useCamera;
