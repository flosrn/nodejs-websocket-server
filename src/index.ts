import { WebSocketServer } from "ws";
import { Midjourney } from "midjourney";
import { config } from "dotenv";

config();

const wss = new WebSocketServer({ port: Number(process.env.PORT) });

wss.on("connection", (ws) => {
  ws.on("message", async (event) => {
    try {
      const data = event.toString();
      const parsedData = JSON.parse(data);
      console.log("parsedData", parsedData);

      const { generationType, prompt, content, index, option } = parsedData;

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
            flags: content.flags,
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
            flags: content.flags,
            loading: (uri: string, progress: string) => {
              ws.send(JSON.stringify({ uri, progress }));
            },
          });
          break;
        case "vary":
          const varyOption = option.charAt(0).toUpperCase() + option.slice(1);
          const varyStrong = content.options?.find(
            (option) => option.label === `Vary (${varyOption})`
          );
          result = await client.Custom({
            msgId: content.id,
            flags: content.flags,
            content: prompt,
            customId: varyStrong.custom,
            loading: (uri: string, progress: string) => {
              ws.send(JSON.stringify({ uri, progress }));
            },
          });
          break;
        case "zoomOut":
          result = await client.ZoomOut({
            level: option,
            msgId: content.id,
            hash: content.hash,
            flags: content.flags,
            loading: (uri: string, progress: string) => {
              ws.send(JSON.stringify({ uri, progress }));
            },
          });
          break;
        default:
          client.Close();
      }

      ws.send(JSON.stringify({ ...result, generationType, index }));
      client.Close();
    } catch (error) {
      console.error("An error occurred:", error);
      ws.send(JSON.stringify({ error: error.message }));
    }
  });
});

// const interval = keepAlive(wss);
// wss.on("close", () => clearInterval(interval));
