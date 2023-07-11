import { WebSocketServer } from "ws";
import { Midjourney } from "midjourney";
import { config } from "dotenv";

config();

const wss = new WebSocketServer({ port: Number(process.env.PORT) });

wss.on("connection", (ws) => {
  ws.on("message", async (event) => {
    try {
      const data = event.toString();

      const { generationType, prompt, content, index } = JSON.parse(data);
      //      console.log("generationType", generationType);
      //      console.log("data", data);
      //      console.log("prompt", prompt);
      //      console.log("content", content);
      //      console.log("index", index);

      const client = new Midjourney({
        ServerId: <string>process.env.SERVER_ID,
        ChannelId: <string>process.env.CHANNEL_ID,
        SalaiToken: <string>process.env.DISCORD_SALAI_TOKEN,
        HuggingFaceToken: <string>process.env.HUGGINGFACE_TOKEN,
        Debug: true,
        Ws: true,
      });
      await client.init();

      let result;

      switch (generationType) {
        case "imagine":
          result = await client.Imagine(
            prompt,
            (uri: string, progress: string) => {
              ws.send(JSON.stringify({ uri, progress }));
            }
          );
          break;
        case "upscale":
          result = await client.Upscale({
            index,
            msgId: content.id,
            hash: content.hash,
            flags: null,
            loading: (uri: string, progress: string) => {
              ws.send(JSON.stringify({ uri, progress }));
            },
          });
          break;
          case "variation":
            result = await client.Variation({
              index,
              msgId: content.id,
              hash: content.hash,
              flags: null,
              loading: (uri: string, progress: string) => {
                ws.send(JSON.stringify({ uri, progress }));
                },
            });
            break;
        default:
          client.Close();
      }

      ws.send(JSON.stringify({ ...result, generationType }));
      client.Close();
    } catch (error) {
      console.error("An error occurred:", error);
      ws.send(JSON.stringify({ error: error.message }));
    }
  });
});

// const interval = keepAlive(wss);
// wss.on("close", () => clearInterval(interval));
