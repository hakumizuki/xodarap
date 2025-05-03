import { trpc } from "@/utils/trpc";
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
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">tRPC Demo</h1>

      <button
        type="button"
        onClick={handleFetchHello}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {isLoading ? "Loading..." : "Fetch Hello from API"}
      </button>

      {response && (
        <div className="mt-4 p-3 bg-green-100 rounded">
          <h2 className="font-semibold">Response:</h2>
          <p className="mt-1">{response}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 rounded">
          <h2 className="font-semibold">Error:</h2>
          <p className="mt-1 text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};
