import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/utils/trpc";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useState } from "react";

export const DemoPage = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use tRPC hello query
  const helloQuery = trpc.app.hello.useQuery(undefined, {
    enabled: false, // Don't run automatically
  });

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

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>tRPC Demo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleFetchHello}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Loading..." : "Fetch Hello from API"}
        </Button>

        {response && (
          <Alert variant="default" className="bg-primary/10 border-primary/20">
            <CheckCircle className="h-4 w-4 text-primary" />
            <AlertTitle>Response</AlertTitle>
            <AlertDescription>{response}</AlertDescription>
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
