import { config } from "dotenv";
config();

import { WebSocketServer } from "ws";
import { keepAlive } from "./utils/keepalive";
// import { Midjourney } from "midjourney";

const wss = new WebSocketServer({ port: Number(process.env.PORT) });

wss.on("connection", (ws) => {
  ws.on("message", async (event) => {
    const prompt = event.toString();
    console.log("prompt:", prompt);

    // const client = new Midjourney({
    //   ServerId: <string>process.env.SERVER_ID,
    //   ChannelId: <string>process.env.CHANNEL_ID,
    //   SalaiToken: <string>process.env.DISCORD_SALAI_TOKEN,
    //   HuggingFaceToken: <string>process.env.HUGGINGFACE_TOKEN,
    //   Debug: true,
    //   Ws: true,
    // });
    // await client.init();

    // const result = await client.Imagine(
    //   prompt,
    //   (uri: string, progress: string) => {
    //     ws.send(JSON.stringify({ uri, progress }));
    //   }
    // );

    ws.send(JSON.stringify(prompt));
    // client.Close();
  });
});

const interval = keepAlive(wss);
wss.on("close", () => clearInterval(interval));
