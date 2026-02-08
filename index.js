require('./config');
const { 
    makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason, 
    pino 
} = require("@whiskeysockets/baileys"); // Memanggil Engine ReyZ
const readline = require("readline");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

async function startReyz() {
    const { state, saveCreds } = await useMultiFileAuthState("session");
    
    const sock = makeWASocket({
        logger: pino({ level: "silent" }),
        printQRInTerminal: false, // Kita pake Pairing Code
        auth: state,
        browser: ["Ubuntu", "Chrome", "20.0.04"]
    });

    // SISTEM PAIRING CODE
    if (!sock.authState.creds.registered) {
        console.clear();
        const phoneNumber = await question('\x1b[33mMasukkan Nomor WA Bot (Contoh: 628xxx):\x1b[0m ');
        const code = await sock.requestPairingCode(phoneNumber.trim());
        console.log(`\x1b[32mPAIRING CODE LU:\x1b[0m \x1b[1m${code}\x1b[0m`);
    }

    sock.ev.on("messages.upsert", async (chat) => {
        try {
            const m = chat.messages[0];
            if (!m.message || m.key.remoteJid === 'status@broadcast') return;
            require("./case")(sock, m); // Lempar ke case.js
        } catch (e) { console.log(e) }
    });

    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "close") {
            let reason = lastDisconnect?.error?.output?.statusCode;
            if (reason !== DisconnectReason.loggedOut) startReyz();
        } else if (connection === "open") {
            console.log("\x1b[36m[SYSTEM]\x1b[0m Reyz Engine Aktif & Pairing Berhasil!");
        }
    });

    sock.ev.on("creds.update", saveCreds);
}

startReyz();
