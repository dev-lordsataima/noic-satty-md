// ===== NOIC SATTY MD BOT - For Lord Sataima - V5 =====
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, downloadMediaMessage } = require('@whiskeysockets/baileys');
const pino = require('pino');
const { Telegraf } = require('telegraf');

const TELEGRAM_TOKEN = "9143477186:AAF7iUAIU-hnWLpWYpzdRmF6OqMhe2-U4ME";
const BOT_NAME = "Noic Satty MD";
const OWNER_NAME = "Lord Sataima";
const OWNER_NUMBER = "2347032483946";
const PREFIX = ".";

const tgBot = new Telegraf(TELEGRAM_TOKEN);
let waSock = null;
let isConnected = false;

const jokes = ["Why did the chicken cross the road? To get to the other side! 😂","Why don't skeletons fight? They don't have the guts! 💀","What do you call a fake noodle? An impasta! 🍝","Why did the scarecrow win an award? He was outstanding in his field! 🌾"];
const quotes = ["Believe you can and you're halfway there.","Success is not final, failure is not fatal.","Don't watch the clock; do what it does. Keep going.","Hard work beats talent when talent doesn't work hard."];
const truths = ["What is your biggest secret?","Who is your crush?","What is the most embarrassing thing you did?","Have you ever lied to your best friend?"];
const dares = ["Send a voice note singing your favourite song","Change your profile pic for 1 hour","Text your crush 'Hi'","Do 10 pushups and send a video"];
const eightball = ["Yes definitely ✅","No way ❌","Maybe 🤔","Ask again later 🔮","Absolutely! 💯","I don't think so 😅"];
const facts = ["Honey never expires! 🍯","Bananas are berries, but strawberries are not! 🍌","Your heart beats about 100,000 times a day! ❤️","Octopuses have 3 hearts! 🐙","Nigeria has over 500 languages! 🇳🇬"];
const compliments = ["You have a smile that can light up a whole group chat 😊","You are smarter than you think, trust me ✨","Your energy is so nice, everyone likes you 💖","You have main character energy 👑"];
const pickups = ["Are you WiFi? Because I'm really feeling the connection 📶","Are you a magician? Because whenever I look at you, everyone else disappears ✨","Do you have a map? I keep getting lost in your eyes 🗺️"];
const affirmations = ["I am strong and capable 💪","Today will be a good day ✨","I deserve good things 👑","I am becoming the best version of me 🚀"];
const roasts = ["Your comebacks are so slow, even my grandma types faster 😂","You bring everyone so much joy... when you leave the group 😅","I'd agree with you but then we'd both be wrong 🤷","You have the personality of a loading screen... just buffering 😂","Your brain is like WiFi in the village... weak connection 📶"];
const savages = ["Be quiet, your voice is giving my phone low battery 🔋","You talk too much for someone with no points 😂","Your opinion was not requested, please return it to sender 📦","I would roast you more but I'm afraid your ego might not survive it 😅"];
const motivates = ["Don't give up, Lord Sataima believes in you! 👑","Small steps every day = big results! 🚀","You are one decision away from changing your life!"];
const memes = ["Me: I'll sleep early tonight\nAlso me at 3am: watching 'how to make soap' on YouTube 😂","My bank account: ₦0\nMe: Add to cart anyway 🛒😭","Teacher: This exam is easy\nThe exam: *in Chinese* 🤯","Me pretending to listen in class while thinking about food 🍔","When your mum says 'I want to talk' and you start packing your bags 😂"];
const aiAnswers = ["That's a great question! Here's what I think: You should go for it, but do it smart. Plan first, then act. 👑","Honestly? You already know the answer, you just need confidence. Trust yourself! ✨","My AI brain says: Yes, do it! But start small, test it, then go big. 🚀","Hmm, let me think like Lord Sataima would... He would say: Don't overthink, just execute! 💪","Good question! The best move is to stay consistent. Small wins every day will change your life."];

async function startWhatsApp() {
  const { version } = await fetchLatestBaileysVersion();
  const { state, saveCreds } = await useMultiFileAuthState('session');
  waSock = makeWASocket({ version, logger: pino({ level: 'silent' }), auth: state, printQRInTerminal: false, browser: [BOT_NAME, 'Chrome', '1.0.0'] });
  waSock.ev.on('creds.update', saveCreds);
  waSock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'open') { isConnected = true; console.log(`✅ ${BOT_NAME} Connected!`); }
    if (connection === 'close') { isConnected = false; const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut; if (shouldReconnect) startWhatsApp(); }
  });

  waSock.ev.on('messages.upsert', async ({ messages }) => {
    try {
      const m = messages[0];
      if (!m.message || m.key.fromMe) return;
      const from = m.key.remoteJid;
      const isGroup = from.endsWith('@g.us');
      const sender = m.key.participant || m.key.remoteJid;
      const senderNum = sender.split('@')[0];
      const isOwner = senderNum === OWNER_NUMBER || senderNum === OWNER_NUMBER.replace('234','0');
      const text = m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || m.message.videoMessage?.caption || "";
      if (!text.startsWith(PREFIX)) return;
      const cmd = text.slice(1).trim().split(" ")[0].toLowerCase();
      const args = text.trim().split(" ").slice(1).join(" ");
      const reply = (txt) => waSock.sendMessage(from, { text: txt }, { quoted: m });
      const getQuoted = () => m.message.extendedTextMessage?.contextInfo?.participant;
      const isAdmin = async () => { if (!isGroup) return false; const meta = await waSock.groupMetadata(from); const p = meta.participants.find(x => x.id === sender); return p?.admin === 'admin' || p?.admin === 'superadmin'; };
      const pick = (arr) => arr[Math.floor(Math.random()*arr.length)];

      if (cmd === "menu" || cmd === "help") {
        return reply(`*🤖 ${BOT_NAME} - MEGA MENU V5*\n*Owner: ${OWNER_NAME} 👑*\n\n*🔰 GENERAL*\n.ping .alive .owner .menu .time .date .id .calc\n\n*😂 FUN*\n.say .joke .quote .truth .dare .8ball .dice .coin .ship .slap .hug .meme\n\n*💖 VIBAL*\n.compliment .pickup .fact .affirmation .motivate .roast .savage\n\n*🤖 AI & MEDIA*\n.ai .play .sticker / .s .toimg\n\n*🌦️ NEW - SEARCH & DOWNLOAD*\n.weather <city>\n.lyrics <song>\n.tiktok <link>\n.insta <link>\n.yt <link>\n\n*👥 GROUP*\n.tagall .hidetag .groupinfo .link .admins .meadmin\n\n*🛡️ ADMIN*\n.kick .add .promote .demote .mute .unmute .close .open .revoke .setname .setdesc\n\n*👑 OWNER*\n.broadcast .restart\n\n*Made by ${OWNER_NAME}*`);
      }

      if (cmd === "ping") { const s = Date.now(); await reply("Pong! 🏓"); return reply(`Pong! 🏓\nSpeed: ${Date.now()-s}ms\n*${BOT_NAME}* Online ✅`); }
      if (cmd === "alive") return reply(`*I'm Alive!* ✅\n*${BOT_NAME}* running\nOwner: ${OWNER_NAME} 👑`);
      if (cmd === "owner") return reply(`*Owner:* ${OWNER_NAME} 👑\n*Number:* wa.me/${OWNER_NUMBER}\n*Bot:* ${BOT_NAME}`);
      if (cmd === "time") return reply(`🕐 *Time:* ${new Date().toLocaleTimeString()}`);
      if (cmd === "date") return reply(`📅 *Date:* ${new Date().toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`);
      if (cmd === "id") return reply(`*Your JID:* ${sender}\n*Number:* ${senderNum}`);
      if (cmd === "calc") { if(!args) return reply("Use: .calc 2+2"); try { let res = eval(args.replace(/[^0-9+\-*/(). ]/g,'')); return reply(`🧮 ${args} = *${res}*`); } catch { return reply("❌ Invalid"); } }
      if (cmd === "say") { if(!args) return reply("Use: .say hello"); return reply(args); }

      if (cmd === "joke") return reply(`😂 ${pick(jokes)}`);
      if (cmd === "quote") return reply(`💡 ${pick(quotes)}`);
      if (cmd === "truth") return reply(`🤔 *TRUTH:*\n${pick(truths)}`);
      if (cmd === "dare") return reply(`😈 *DARE:*\n${pick(dares)}`);
      if (cmd === "8ball") { if(!args) return reply("Ask: .8ball will I pass?"); return reply(`🎱 *Q:* ${args}\n*A:* ${pick(eightball)}`); }
      if (cmd === "dice") return reply(`🎲 You rolled: *${Math.floor(Math.random()*6)+1}*`);
      if (cmd === "coin") return reply(`🪙 *${Math.random()>0.5 ? 'HEADS' : 'TAILS'}*`);
      if (cmd === "ship") { let t = getQuoted() || args; let p = Math.floor(Math.random()*101); return reply(`💘 *LOVE MATCH*\n${senderNum} + ${t}\n*${p}%* ${p>80?'Perfect! 💍':p>50?'Good! 😍':'Just friends 😅'}`); }
      if (cmd === "slap") return reply(`👋 @${senderNum} slapped someone! Ouch! 😂`);
      if (cmd === "hug") return reply(`🤗 @${senderNum} gave a big hug! ❤️`);
      if (cmd === "meme") return reply(`😂 *MEME:*\n\n${pick(memes)}`);
      if (cmd === "compliment" || cmd === "praise") return reply(`💖 ${pick(compliments)}`);
      if (cmd === "pickup") return reply(`😍 ${pick(pickups)}`);
      if (cmd === "fact") return reply(`🧠 *Did you know?*\n${pick(facts)}`);
      if (cmd === "affirmation") return reply(`✨ ${pick(affirmations)}`);
      if (cmd === "motivate") return reply(`🚀 ${pick(motivates)}`);
      if (cmd === "roast") { let t = getQuoted(); let target = t ? `@${t.split('@')[0]}` : (args || "you"); return reply(`🔥 *ROAST for ${target}:*\n${pick(roasts)}`); }
      if (cmd === "savage" || cmd === "diss" || cmd === "clapback") { let t = getQuoted(); let target = t ? `@${t.split('@')[0]}` : (args || "you"); return reply(`😈 *SAVAGE for ${target}:*\n${pick(savages)}`); }

      // AI & MEDIA
      if (cmd === "ai") {
        if (!args) return reply("Ask me something:\n.ai how do I make money?");
        let lower = args.toLowerCase();
        if (lower.includes("who are you") || lower.includes("your name")) return reply(`I'm *${BOT_NAME}* 🤖, made by *${OWNER_NAME}* 👑. I can make stickers, roasts, memes, and manage your group!`);
        if (lower.includes("owner")) return reply(`My owner is *${OWNER_NAME}* 👑 - wa.me/${OWNER_NUMBER}`);
        if (lower.includes("hello") || lower.includes("hi")) return reply(`Hello! 👋 How are you? Ask me anything with .ai, or try .menu!`);
        if (lower.includes("money") || lower.includes("rich")) return reply(`To make money: 1. Learn a skill 2. Post it every day 3. Stay consistent for 90 days. Don't give up! 💰`);
        if (lower.includes("love") || lower.includes("crush")) return reply(`Love is tricky 😅 If you like them, be honest but be respectful. ❤️`);
        if (lower.includes("sad") || lower.includes("tired")) return reply(`Hey, it's okay to feel tired. Take a break, drink water, talk to someone you trust. You got this! 💖`);
        return reply(`🤖 *${BOT_NAME} AI:*\n\n${pick(aiAnswers)}\n\n*Your Q:* ${args}`);
      }
      if (cmd === "play") {
        if (!args) return reply("Use: .play Asake Lonely At The Top");
        let search = encodeURIComponent(args);
        return reply(`🎵 *Now Playing Search:*\n*Song:* ${args}\n\n▶️ *YouTube:*\nhttps://www.youtube.com/results?search_query=${search}\n\n🎧 *Spotify:*\nhttps://open.spotify.com/search/${search}\n\n*Requested by:* @${senderNum}\n*Powered by ${BOT_NAME}*`);
      }
      if (cmd === "sticker" || cmd === "s") {
        try {
          let mediaMsg = null;
          if (m.message.imageMessage || m.message.videoMessage) mediaMsg = m;
          else { const quoted = m.message.extendedTextMessage?.contextInfo?.quotedMessage; if (quoted?.imageMessage || quoted?.videoMessage) mediaMsg = { key: m.key, message: quoted }; }
          if (!mediaMsg) return reply("❌ *How to make sticker:*\n\n1. Send image/video with caption `.sticker`\nOR\n2. Reply to image/video with `.sticker`");
          await reply("⏳ Making your sticker... 1 sec...");
          const buffer = await downloadMediaMessage(mediaMsg, 'buffer', {});
          await waSock.sendMessage(from, { sticker: buffer }, { quoted: m });
        } catch (e) { return reply("❌ Could not make sticker. Try smaller image/video."); }
        return;
      }
      if (cmd === "toimg") {
        try {
          const quoted = m.message.extendedTextMessage?.contextInfo?.quotedMessage;
          if (!quoted?.stickerMessage) return reply("Reply to a sticker with .toimg");
          const buffer = await downloadMediaMessage({ key: m.key, message: quoted }, 'buffer', {});
          await waSock.sendMessage(from, { image: buffer, caption: `✅ Sticker to image - by ${BOT_NAME}` }, { quoted: m });
        } catch (e) { return reply("❌ Could not convert sticker."); }
        return;
      }

      // NEW V5 - WEATHER / LYRICS / DOWNLOAD HELPERS
      if (cmd === "weather") {
        if (!args) return reply("Use: .weather Lagos\nExample: .weather Abuja, .weather London");
        let city = args.trim();
        let search = encodeURIComponent(city + " weather today");
        // Simple live-feeling weather - gives real link + tips
        return reply(`🌦️ *WEATHER - ${city.toUpperCase()}*\n\n📍 City: ${city}\n🕐 Checked: ${new Date().toLocaleTimeString()}\n\n☀️ Lagos / Nigeria is usually hot & humid. Carry water!\n🌧️ If it's rainy season, carry umbrella.\n\n🔗 *Live Weather:*\nhttps://www.google.com/search?q=${search}\n\n*Tip:* Tap the link for exact live temperature now.\n*Powered by ${BOT_NAME}*`);
      }
      if (cmd === "lyrics") {
        if (!args) return reply("Use: .lyrics Asake Lonely At The Top");
        let search = encodeURIComponent(args + " lyrics");
        return reply(`🎤 *LYRICS - ${args}*\n\n🔍 *Find full lyrics here:*\nhttps://genius.com/search?q=${search}\nhttps://www.google.com/search?q=${search}\n\n🎵 *Listen:*\nhttps://www.youtube.com/results?search_query=${encodeURIComponent(args)}\n\n*Requested by:* @${senderNum}`);
      }
      if (cmd === "tiktok") {
        if (!args) return reply("Use: .tiktok <paste tiktok link>\nExample: .tiktok https://www.tiktok.com/...");
        if (!args.includes("tiktok")) return reply("❌ Send a valid TikTok link.");
        return reply(`🎬 *TIKTOK DOWNLOADER*\n\n🔗 Link: ${args}\n\n⬇️ *Download without watermark:*\nhttps://ssstik.io/en\nhttps://tikwm.com\n\n1. Copy your link\n2. Open one of the sites above\n3. Paste link > Download\n\n*Powered by ${BOT_NAME}*`);
      }
      if (cmd === "insta" || cmd === "ig") {
        if (!args) return reply("Use: .insta <paste instagram link>");
        return reply(`📸 *INSTAGRAM DOWNLOADER*\n\n🔗 Link: ${args}\n\n⬇️ *Download here:*\nhttps://saveinsta.app\nhttps://igram.world\n\nPaste your link there to download Reels / Photos.\n*Powered by ${BOT_NAME}*`);
      }
      if (cmd === "yt" || cmd === "youtube") {
        if (!args) return reply("Use: .yt <paste youtube link>");
        return reply(`▶️ *YOUTUBE DOWNLOADER*\n\n🔗 Link: ${args}\n\n⬇️ *Download MP3 / MP4:*\nhttps://ytmp3.nu\nhttps://savefrom.net\n\nPaste link there to download.\n*Powered by ${BOT_NAME}*`);
      }

      // GROUP
      if (cmd === "tagall") { if(!isGroup) return reply("Group only."); const meta = await waSock.groupMetadata(from); const members = meta.participants.map(p=>p.id); let txt = `*📢 TAG ALL - ${meta.subject}*\n\n`; members.forEach((id,i)=>{ txt += `${i+1}. @${id.split('@')[0]}\n`; }); return waSock.sendMessage(from, { text: txt, mentions: members }, { quoted: m }); }
      if (cmd === "hidetag") { if(!isGroup) return reply("Group only."); const meta = await waSock.groupMetadata(from); const members = meta.participants.map(p=>p.id); return waSock.sendMessage(from, { text: args || "📢 Attention!", mentions: members }, { quoted: m }); }
      if (cmd === "groupinfo") { if(!isGroup) return reply("Group only."); const meta = await waSock.groupMetadata(from); return reply(`*Group:* ${meta.subject}\n*Members:* ${meta.participants.length}\n*Admins:* ${meta.participants.filter(p=>p.admin).length}\n*Desc:* ${meta.desc || 'No desc'}`); }
      if (cmd === "link") { if(!isGroup) return reply("Group only."); const code = await waSock.groupInviteCode(from); return reply(`🔗 https://chat.whatsapp.com/${code}`); }
      if (cmd === "admins") { if(!isGroup) return reply("Group only."); const meta = await waSock.groupMetadata(from); const admins = meta.participants.filter(p=>p.admin); let txt = `*👑 ADMINS - ${meta.subject}*\nTotal: ${admins.length}\n\n`; admins.forEach((p,i)=>{ txt += `${i+1}. @${p.id.split('@')[0]} ${p.admin==='superadmin'?'(Creator)':''}\n`; }); return waSock.sendMessage(from, { text: txt, mentions: admins.map(p=>p.id) }, { quoted: m }); }
      if (cmd === "meadmin") { if(!isGroup) return reply("Group only."); const admin = await isAdmin(); return reply(admin ? `✅ Yes! You ARE admin 👑` : `❌ No, you are NOT admin`); }

      // ADMIN
      if (cmd === "kick") { if(!isGroup) return reply("Group only."); if(!(await isAdmin()) && !isOwner) return reply("❌ Admins only!"); let t = getQuoted(); if(!t) return reply("Reply to someone to kick."); await waSock.groupParticipantsUpdate(from, [t], 'remove'); return reply("✅ Kicked!"); }
      if (cmd === "add") { if(!isGroup) return reply("Group only."); if(!(await isAdmin()) && !isOwner) return reply("❌ Admins only!"); if(!args) return reply("Use: .add 234..."); await waSock.groupParticipantsUpdate(from, [args.replace(/[^0-9]/g,'')+'@s.whatsapp.net'], 'add'); return reply("✅ Added!"); }
      if (cmd === "promote") { if(!isGroup) return reply("Group only."); if(!(await isAdmin()) && !isOwner) return reply("❌ Admins only!"); let t = getQuoted(); if(!t) return reply("Reply to promote."); await waSock.groupParticipantsUpdate(from, [t], 'promote'); return reply("✅ Promoted! 👑"); }
      if (cmd === "demote") { if(!isGroup) return reply("Group only."); if(!(await isAdmin()) && !isOwner) return reply("❌ Admins only!"); let t = getQuoted(); if(!t) return reply("Reply to demote."); await waSock.groupParticipantsUpdate(from, [t], 'demote'); return reply("✅ Demoted!"); }
      if (cmd === "mute") { if(!isGroup) return reply("Group only."); await waSock.groupSettingUpdate(from, 'announcement'); return reply("🔇 Muted!"); }
      if (cmd === "unmute") { if(!isGroup) return reply("Group only."); await waSock.groupSettingUpdate(from, 'not_announcement'); return reply("🔊 Unmuted!"); }
      if (cmd === "close") { if(!isGroup) return reply("Group only."); await waSock.groupSettingUpdate(from, 'announcement'); return reply("🔒 Closed!"); }
      if (cmd === "open") { if(!isGroup) return reply("Group only."); await waSock.groupSettingUpdate(from, 'not_announcement'); return reply("🔓 Opened!"); }
      if (cmd === "revoke") { if(!isGroup) return reply("Group only."); const code = await waSock.groupRevokeInvite(from); return reply(`🔗 New Link:\nhttps://chat.whatsapp.com/${code}`); }
      if (cmd === "setname") { if(!isGroup) return reply("Group only."); if(!args) return reply("Use: .setname New Name"); await waSock.groupUpdateSubject(from, args); return reply(`✅ Name: ${args}`); }
      if (cmd === "setdesc") { if(!isGroup) return reply("Group only."); if(!args) return reply("Use: .setdesc New Desc"); await waSock.groupUpdateDescription(from, args); return reply("✅ Desc updated!"); }

      // OWNER
      if (cmd === "broadcast") { if(!isOwner) return reply("❌ Owner only!"); if(!args) return reply("Use: .broadcast hi"); return reply(`📢 *BROADCAST FROM ${OWNER_NAME}*\n\n${args}`); }
      if (cmd === "restart") { if(!isOwner) return reply("❌ Owner only!"); await reply("🔄 Restarting..."); process.exit(0); }

    } catch (e) { console.log("Error:", e.message); }
  });
}

tgBot.start((ctx) => ctx.reply(`👋 Welcome to *${BOT_NAME}* Pair Bot\n\nOwner: ${OWNER_NAME} 👑\n\nTo link: Send /pair ${OWNER_NUMBER}\nCommands:\n/pair 234... - Get code\n/status - Check connection`, { parse_mode: 'Markdown' }));
tgBot.command('status', (ctx) => ctx.reply(isConnected ? `✅ *${BOT_NAME}* is CONNECTED` : `❌ Not connected yet. Send /pair to link.`));
tgBot.command('pair', async (ctx) => {
  try {
    let number = ctx.message.text.split(" ")[1];
    if (!number) return ctx.reply(`❌ Send like this:\n/pair ${OWNER_NUMBER}`);
    number = number.replace(/[^0-9]/g, "");
    if (number.leng < 10) return ctx.reply("❌ Invalid number.");
    if (!waSock) await startWhatsApp();
    if (isConnected) return ctx.reply(`✅ *${BOT_NAME}* already connected!`);
    ctx.reply("⏳ Generating code... wait 5 sec...");
    const code = await waSock.requestPairingCode(number);
    ctx.reply(`🔑 *YOUR ${BOT_NAME} PAIRING CODE:*\n\n\`${code}\`\n\nGo to WhatsApp > Linked Devices > Link with phone number > Enter this code.`, { parse_mode: 'Markdown' });
  } catch (e) { ctx.reply("❌ Error: " + e.message); }
});
(async () => { await startWhatsApp(); tgBot.launch(); console.log(`✅ ${BOT_NAME} Pair Bot Running...`); })();
