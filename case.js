/**
 * REYZ4YOUXGOD - FINAL CASE HANDLER
 */
module.exports = async (sock, m) => {
    try {
        const { type, pushName, remoteJid: from, sender } = m;
        const body = (type === 'conversation') ? m.message.conversation : 
                     (type === 'extendedTextMessage') ? m.message.extendedTextMessage.text : 
                     (type === 'imageMessage') ? m.message.imageMessage.caption : 
                     (type === 'videoMessage') ? m.message.videoMessage.caption : '';

        // LOGIKA MULTI-PREFIX & NO-PREFIX
        const prefixes = ['.', '/', '!', '#'];
        const prefix = prefixes.find(p => body.startsWith(p)) || "";
        const isCmd = prefix !== "";
        const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : body.trim().split(' ').shift().toLowerCase();
        const args = body.trim().split(/ +/).slice(1);
        const text = q = args.join(' ');
        const isOwner = global.owner.includes(sender.split('@')[0]);

        // Helper Reply
        const reply = (teks) => sock.sendMessage(from, { text: teks }, { quoted: m });

        // --- HANDLER ---
        if (isCmd) {
            switch (command) {
                case 'menu':
                    reply(`*${global.botname}* 👑\n\nHalo ${pushName}!\nPrefix: [ ${prefix} ]\n\n• ${prefix}ping\n• ${prefix}tesbug\n• ${prefix}owner`);
                    break;

                case 'ping':
                    reply('Pong! Mesin ReyZ lancar jaya 🏎️💨');
                    break;

                case 'tesbug':
                    // Fungsi relySendMessage dari library lu
                    await sock.relySendMessage(from, { text: "⚡ Mengirim raw data bug..." });
                    break;

                case 'owner':
                    reply(`Owner gue adalah *${global.ownername}*`);
                    break;
            }
        } else {
            // RESPON TANPA PREFIX
            switch (command) {
                case 'p':
                case 'halo':
                    reply(`Halo *${pushName}*! Ada yang bisa mesin ReyZ bantu? Ketik .menu ya.`);
                    break;
            }
        }

    } catch (err) {
        console.log(err);
    }
}
