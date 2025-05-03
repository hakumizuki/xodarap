import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/utils/trpc";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

export const DemoPage = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [streamedResponse, setStreamedResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingComplete, setStreamingComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use tRPC hello query
  const helloQuery = trpc.app.hello.useQuery(undefined, {
    enabled: false, // Don't run automatically
  });

  // Use tRPC hello stream subscription
  trpc.app.helloStream.useSubscription(undefined, {
    enabled: isStreaming,
    onData: (chunk) => {
      setStreamedResponse((prev) => prev + chunk);

      if (chunk.includes("[end]")) {
        console.log("Detected server completion marker in chunk:", chunk);
        // Wait a bit to show the final character before marking as complete
        setTimeout(() => {
          setIsStreaming(false);
          setStreamingComplete(true);
        }, 500);
      }
    },
    onError: (err) => {
      setError(err.message);
      setIsStreaming(false);
    },
  });

  // Handle manual subscription disabling
  useEffect(() => {
    // If streaming was manually disabled (e.g., by unmounting)
    // but we have content and haven't marked as complete yet
    if (!isStreaming && streamedResponse && !streamingComplete) {
      console.log("Manually marking streaming as complete");
      setStreamingComplete(true);
    }
  }, [isStreaming, streamedResponse, streamingComplete]);

  // Handle success and error states
  const handleSuccess = (data: string) => {
    setResponse(data);
    setIsLoading(false);
    setError(null);
  };

  const handleError = (err: Error) => {
    setError(err.message);
    setIsLoading(false);
    setResponse(null);
  };

  const handleFetchHello = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await helloQuery.refetch();
      if (result.data) {
        handleSuccess(result.data);
      }
    } catch (err) {
      handleError(err as Error);
    }
  };

  const handleFetchHelloStream = () => {
    setStreamedResponse("");
    setIsStreaming(true);
    setStreamingComplete(false);
    setError(null);
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>tRPC Demo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            onClick={handleFetchHello}
            disabled={isLoading || isStreaming}
            className="flex-1"
          >
            {isLoading ? "Loading..." : "Fetch Hello"}
          </Button>

          <Button
            onClick={handleFetchHelloStream}
            disabled={isLoading || isStreaming}
            className="flex-1"
            variant="secondary"
          >
            {isStreaming ? "Streaming..." : "Fetch Hello Stream"}
          </Button>
        </div>

        {response && (
          <Alert variant="default" className="bg-primary/10 border-primary/20">
            <CheckCircle className="h-4 w-4 text-primary" />
            <AlertTitle>Response</AlertTitle>
            <AlertDescription>{response}</AlertDescription>
          </Alert>
        )}

        {streamedResponse && (
          <Alert
            variant="default"
            className={`${
              streamingComplete
                ? "bg-green-100 border-green-200"
                : "bg-secondary/10 border-secondary/20"
            } transition-colors duration-300`}
          >
            <CheckCircle
              className={`h-4 w-4 ${streamingComplete ? "text-green-500" : "text-secondary"}`}
            />
            <AlertTitle className="flex items-center gap-2">
              Streamed Response
              {isStreaming && (
                <span className="text-sm font-normal text-amber-600 animate-pulse">
                  (receiving...)
                </span>
              )}
              {streamingComplete && (
                <span className="text-sm font-normal text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  Complete ✓
                </span>
              )}
            </AlertTitle>
            <AlertDescription className="font-mono">
              {streamedResponse}
              {isStreaming && <span className="animate-pulse">|</span>}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
