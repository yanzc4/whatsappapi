import { createBot, createFlow, MemoryDB, createProvider } from "@bot-whatsapp/bot"
import { BaileysProvider, handleCtx } from "@bot-whatsapp/provider-baileys"


const main = async () => {

    const provider = createProvider(BaileysProvider)

    provider.initHttpServer(3000)

    provider.http.server.post('/send-message', handleCtx(async (bot, req, res) =>{
        const celular = req.body.celular
        const mensaje = req.body.mensaje
        const url = req.body.url
        await bot.sendMessage(celular, mensaje, {
            media: url,
            mediaName: 'ticket.pdf'
        })
        res.end('enviado')
    }))

    await createBot({
        flow: createFlow([]),
        database: new MemoryDB(),
        provider
    })

}
main()