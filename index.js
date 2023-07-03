const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const SESSION_FILE_PATH = './session.json';
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionCfg = require(SESSION_FILE_PATH);
}

const client = new Client({ puppeteer: { headless: true }, session: sessionCfg });

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('authenticated', (session) => {
    console.log('Authenticated');
    sessionCfg = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
        if (err) {
            console.error(err);
        }
    });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async (msg) => {
    if (msg.body === '!ping') {
        msg.reply('Pong!');
    } else if (msg.body === '!join') {
        const groupInviteCode = 'GROUP_INVITE_CODE';
        const group = await client.acceptInvite(groupInviteCode);
        console.log(`Joined group ${group.name}`);
    } else if (msg.body === '!kick') {
        const group = await msg.getChat();
        if (group.isGroup && group.isAdminOnly) {
            const targetNumber = 'TARGET_PHONE_NUMBER';
            const target = group.participants.find((participant) => participant.id._serialized === targetNumber);
            if (target) {
                await group.removeParticipant(target);
                console.log(`Kicked ${target.pushname}`);
            }
        } else {
            msg.reply('Anda bukan admin grup');
        }
    } else if (msg.body === '!changepic') {
        const group = await msg.getChat();
        if (group.isGroup && group.isAdminOnly) {
            // Ganti foto profil grup di sini
            console.log('Foto profil grup telah diganti');
        } else {
            msg.reply('Anda bukan admin grup');
        }
    } else if (msg.body === '!sticker') {
        // Buat stiker di sini
    } else if (msg.body === '!medium') {
        // Game matematika tingkat medium
    } else if (msg.body === '!difficult') {
        // Game matematika tingkat sulit
    }
});

client.initialize();
