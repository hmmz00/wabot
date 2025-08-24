import express from "express"
import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys"

const app = express()

// route utama biar Glitch gak kasih "Page Not Found"
app.get("/", (req, res) => {
  res.send("🤖 Bot WhatsApp aktif dan berjalan di Glitch!")
})

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth")
  const sock = makeWASocket({ auth: state })

  // simpan sesi login (biar gak scan QR terus)
  sock.ev.on("creds.update", saveCreds)

  // event pesan masuk
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message) return

    const from = msg.key.remoteJid
    const text = msg.message.conversation || ""

    console.log("Pesan masuk:", text)

    // balas pesan otomatis
    await sock.sendMessage(from, { text: "Kamu mengirim: " + text })
  })
}

startBot()

// pakai PORT dari Glitch (bukan 3000 fix)
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`✅ Server berjalan di port ${port}`))