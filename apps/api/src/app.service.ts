import { observable } from "@trpc/server/observable";

export class AppService {
  getHello(): string {
    return "Hello World!";
  }

  // Get the array of words to stream
  getStreamWords(): string[] {
    return [
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
    ];
  }

  getHelloStream() {
    return observable<string>((observer) => {
      // Define the message parts to stream
      const words = this.getStreamWords().concat("[end]");
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
          observer.complete();
          clearInterval(interval);
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
