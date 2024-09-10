import { fun } from "./fun";

console.log("Starting Bun...");

await new Promise(r => setTimeout(() => {
  fun();
  r(void 0);
}, 1000));
