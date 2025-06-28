const mineflayer = require("mineflayer");

const HOST = "play.smgin.me";
const PORT = 58073;
const USERNAME = "SMGSecurity";
const VERSION = "1.21.4"; // or "auto"
const PASSWORD = "Securitybysmg007";

function createBot() {
  console.log("⏳ Creating bot…");

  const bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: USERNAME,
    version: VERSION,
  });

  bot.on("error", (err) => {
    console.error("❌ [error]", err);
  });

  bot.on("kicked", (reason) => {
    console.warn("⚠️ [kicked]", reason.toString());
  });

  bot.on("end", () => {
    console.log("🔁 [end] disconnected — retrying in 5s");
    setTimeout(createBot, 5000);
  });

  bot.once("login", () => {
    console.log("✅ [login] successful — in game world.");

    // Wait a moment before sending /vanish
    setTimeout(() => {
      console.log("🫥 Sending /vanish command");
      bot.chat("/vanish");
    }, 3000);
  });

  bot.on("spawn", () => {
    console.log("✅ [spawn] bot is alive in the world");

    // Anti-AFK: jump every 30 seconds
    setInterval(() => {
      bot.setControlState("jump", true);
      setTimeout(() => bot.setControlState("jump", false), 500);
    }, 30000);
  });

  // Login/Register automation
  bot.on("message", (msg) => {
    const text = msg.toString().toLowerCase();
    if (text.includes("register")) {
      console.log("🔐 Detected register prompt, sending /register");
      bot.chat(`/register ${PASSWORD} ${PASSWORD}`);
    } else if (text.includes("login")) {
      console.log("🔐 Detected login prompt, sending /login");
      bot.chat(`/login ${PASSWORD}`);
    }
  });
bot.on('spawn', () => {
    console.log("Bot spawned, starting anti-AFK.");

    setInterval(() => {
      const yaw = Math.random() * Math.PI * 2;
      const pitch = (Math.random() - 0.5) * Math.PI;
      bot.look(yaw, pitch, true);

      const movements = ['forward', 'back', 'left', 'right'];
      const move = movements[Math.floor(Math.random() * movements.length)];
      bot.setControlState(move, true);

      setTimeout(() => {
        bot.setControlState(move, false);
      }, 1000); // Move for 1 second
    }, 10000); // Every 10 seconds
  });

  bot.on('end', () => {
    console.log("Bot disconnected. Reconnecting in 10 seconds...");
    setTimeout(startBot, 10000);
  });

  bot.on('error', err => {
    console.error("Bot error:", err);
  });
}

startBot();
