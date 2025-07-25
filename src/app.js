import {
  createBot,
  createProvider
} from "@builderbot/bot";
import { JsonFileDB as Database } from "@builderbot/database-json";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";

const PORT = process.env.PORT ?? 3000;

const main = async () => {

  const adapterProvider = createProvider(Provider);

  const adapterDB = new Database({ filename: "db.json" });

  const { handleCtx, httpServer } = await createBot({
    provider: adapterProvider,
    database: adapterDB,
  });

  adapterProvider.server.post("/send-message", handleCtx(async (bot, req, res) => {
        const celular = req.body.celular
        const mensaje = req.body.mensaje
        const url = req.body.url
        await bot.sendMessage(celular, mensaje, {
            media: url,
            mediaName: 'ticket.pdf'
        })
        return res.end('enviado')
    })
  );

  httpServer(+PORT);
};

main();
