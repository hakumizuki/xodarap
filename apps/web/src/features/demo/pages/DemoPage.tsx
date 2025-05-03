import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTRPC, useTRPCClient } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

export const DemoPage = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [streamedResponse, setStreamedResponse] = useState<string>("");
  const [httpStreamedResponse, setHttpStreamedResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isHttpStreaming, setIsHttpStreaming] = useState(false);
  const [streamingComplete, setStreamingComplete] = useState(false);
  const [httpStreamingComplete, setHttpStreamingComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trpc = useTRPC();
  const tClient = useTRPCClient();

  // Use tRPC hello query
  const helloQuery = useQuery(
    trpc.app.hello.queryOptions(undefined, {
      enabled: false, // Don't run automatically
    }),
  );

  // Use tRPC hello stream subscription
  useSubscription(
    trpc.app.helloStream.subscriptionOptions(undefined, {
      onData: (chunk) => {
        setStreamedResponse((prev) => prev + chunk);
      },
      onError: (err) => {
        setError(err.message);
        setIsStreaming(false);
      },
    }),
  );

  // Handle manual subscription disabling
  useEffect(() => {
    // If streaming was manually disabled (e.g., by unmounting)
    // but we have content and haven't marked as complete yet
    if (!isStreaming && streamedResponse && !streamingComplete) {
      console.log("Manually marking WebSocket streaming as complete");
      setStreamingComplete(true);
    }

    // Same for HTTP streaming
    if (!isHttpStreaming && httpStreamedResponse && !httpStreamingComplete) {
      console.log("Manually marking HTTP streaming as complete");
      setHttpStreamingComplete(true);
    }
  }, [
    isStreaming,
    streamedResponse,
    streamingComplete,
    isHttpStreaming,
    httpStreamedResponse,
    httpStreamingComplete,
  ]);

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

  const handleFetchHelloHttpStream = async () => {
    setHttpStreamedResponse("");
    setIsHttpStreaming(true);
    setHttpStreamingComplete(false);
    setError(null);

    try {
      // Start the HTTP streaming query
      const result = await tClient.app.helloHttpStream.query();

      // Handle the streamed response
      for await (const chunk of result) {
        // Append the chunk to the response
        setHttpStreamedResponse((prev) => prev + chunk);
      }

      // Mark the streaming as complete
      setHttpStreamingComplete(true);
      setIsHttpStreaming(false);
    } catch (err) {
      handleError(err as Error);
      setIsHttpStreaming(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>tRPC Demo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button
              onClick={handleFetchHello}
              disabled={isLoading || isStreaming || isHttpStreaming}
              className="flex-1"
            >
              {isLoading ? "Loading..." : "Fetch Hello"}
            </Button>

            <Button
              onClick={handleFetchHelloStream}
              disabled={isLoading || isStreaming || isHttpStreaming}
              className="flex-1"
              variant="secondary"
            >
              {isStreaming ? "Streaming..." : "WebSocket Stream"}
            </Button>
          </div>

          <Button
            onClick={handleFetchHelloHttpStream}
            disabled={isLoading || isStreaming || isHttpStreaming}
            variant="outline"
          >
            {isHttpStreaming ? "HTTP Streaming..." : "HTTP Batch Stream"}
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
              WebSocket Streamed Response
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

        {httpStreamedResponse && (
          <Alert
            variant="default"
            className={`${
              httpStreamingComplete
                ? "bg-blue-100 border-blue-200"
                : "bg-blue-50/50 border-blue-100/50"
            } transition-colors duration-300`}
          >
            <CheckCircle
              className={`h-4 w-4 ${httpStreamingComplete ? "text-blue-500" : "text-blue-300"}`}
            />
            <AlertTitle className="flex items-center gap-2">
              HTTP Streamed Response
              {isHttpStreaming && (
                <span className="text-sm font-normal text-amber-600 animate-pulse">
                  (receiving...)
                </span>
              )}
              {httpStreamingComplete && (
                <span className="text-sm font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  Complete ✓
                </span>
              )}
            </AlertTitle>
            <AlertDescription className="font-mono">
              {httpStreamedResponse}
              {isHttpStreaming && <span className="animate-pulse">|</span>}
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
