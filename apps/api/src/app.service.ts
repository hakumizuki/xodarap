import { observable } from "@trpc/server/observable";

export class AppService {
  getHello(): string {
    return "Hello World!";
  }

  getHelloStream() {
    return observable<string>((observer) => {
      // Define the message parts to stream
      const words = [
        "Hello",
        " ",
        "World",
        "!",
        " ",
        "This",
        " ",
        "is",
        " ",
        "a",
        " ",
        "streaming",
        " ",
        "response!",
        "[end]",
      ];
      let index = 0;

      console.log("Starting stream...");

      // Send each word with a delay
      const interval = setInterval(() => {
        if (index < words.length) {
          observer.next(words[index]);
          console.log(`Sent chunk: "${words[index]}"`);
          index++;
        } else {
          console.log("Stream complete, sending completion signal");
          clearInterval(interval);

          // SERVER-CONTROLLED COMPLETION:
          // 1. We've already sent a period "." as the last character, which the client
          //    recognizes as a completion marker
          // 2. Now we explicitly call complete() to close the stream from the server side
          // This demonstrates that the server has full control over when streaming ends
          observer.complete();
        }
      }, 300); // 300ms delay between words

      // Return cleanup function
      return () => {
        console.log("Cleaning up stream");
        clearInterval(interval);
      };
    });
  }
}
