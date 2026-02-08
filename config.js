const fs = require('fs');

global.owner = ['6281929461281']; // Ganti dengan nomor lu
global.botname = 'REYZ GOD ENGINE';
global.ownername = 'Reyz4YouXGod';

global.mess = {
    wait: '🔍 Memproses...',
    owner: '❌ Fitur Khusus Owner Sang Dewa!',
    group: '❌ Fitur Hanya untuk Grup!',
    admin: '❌ Fitur Khusus Admin!'
}

// Auto Update Config
let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(`Update ${__filename}`);
    delete require.cache[file];
    require(file);
});
