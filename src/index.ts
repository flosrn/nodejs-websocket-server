import { config } from "dotenv";
config();

import { createServer } from "http";
import { Server as WebsocketServer } from "ws";
import { Midjourney } from "midjourney";

const httpServer = createServer();

httpServer.listen(process.env.PORT, () => {
  console.log(`Server is listening on ${process.env.PORT}`);
});

const wsServer = new WebsocketServer({ server: httpServer });

wsServer.on("connection", (ws) => {
  ws.on("message", async (event) => {
    const prompt = event.toString();
    console.log("prompt:", prompt);

    const client = new Midjourney({
      ServerId: <string>process.env.SERVER_ID,
      ChannelId: <string>process.env.CHANNEL_ID,
      SalaiToken: <string>process.env.DISCORD_SALAI_TOKEN,
      HuggingFaceToken: <string>process.env.HUGGINGFACE_TOKEN,
      Debug: true,
      Ws: true,
    });
    await client.init();

    const result = await client.Imagine(
      prompt,
      (uri: string, progress: string) => {
        ws.send(JSON.stringify({ uri, progress }));
      }
    );

    ws.send(JSON.stringify(result));
    client.Close();
  });
});
