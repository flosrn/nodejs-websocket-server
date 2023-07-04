import { config } from "dotenv";
config();

import { createServer } from "http";

createServer((_, res) => {
  console.log("process.env.PORT : ", process.env.PORT);
  res.write("Hello World!");
  res.end();
}).listen(process.env.PORT);
