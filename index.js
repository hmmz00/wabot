import express from "express"
import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys"

const app = express()
app.get("/", (req, res) => res.send("Bot WA aktif 🚀"))

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth")
  const sock = makeWASocket({ auth: state })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message) return
    const from = msg.key.remoteJid
    const text = msg.message.conversation || ""

    console.log("Pesan masuk:", text)

    // Balas pesan otomatis
    await sock.sendMessage(from, { text: "Kamu mengirim: " + text })
  })
}

startBot()
app.listen(3000, () => console.log("Server berjalan di port 3000"))
