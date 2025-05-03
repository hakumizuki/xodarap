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
}
