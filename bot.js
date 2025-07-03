const mineflayer = require("mineflayer");

const HOST = "play.smgin.me";
const PORT = 58073;
const USERNAME = "SMGSecurity";
const VERSION = "1.21.4";
const PASSWORD = "Securitybysmg007";

function startBot() {
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
    console.log("🔁 [end] disconnected — retrying in 10s");
    setTimeout(startBot, 10000);
  });

  bot.once("login", () => {
    console.log("✅ [login] successful — in game world.");

    bot.on("spawn", () => {
      console.log("✅ [spawn] bot is alive in the world");

      const movements = ['forward', 'back', 'left', 'right'];
      let currentMove = null;

      // Change movement every 5-8 seconds
      setInterval(() => {
        if (currentMove) bot.setControlState(currentMove, false);
        currentMove = movements[Math.floor(Math.random() * movements.length)];
        bot.setControlState(currentMove, true);
      }, 5000 + Math.random() * 3000);

      // Look randomly every 3 seconds
      setInterval(() => {
        const yaw = Math.random() * Math.PI * 2;
        const pitch = (Math.random() - 0.5) * Math.PI;
        bot.look(yaw, pitch, true);
      }, 3000);

      // Jump every 15–25 seconds
      setInterval(() => {
        bot.setControlState("jump", true);
        setTimeout(() => bot.setControlState("jump", false), 500);
      }, 15000 + Math.random() * 10000);

      // Swing arm every 7–12 seconds
      setInterval(() => {
        bot.swingArm();
      }, 7000 + Math.random() * 5000);

      // Toggle sneak and sprint randomly
      setInterval(() => {
        bot.setControlState("sprint", true);
        bot.setControlState("sneak", true);
        setTimeout(() => {
          bot.setControlState("sprint", false);
          bot.setControlState("sneak", false);
        }, 1000 + Math.random() * 2000);
      }, 10000 + Math.random() * 10000);

      // Hotbar slot switching every 20–30 seconds (optional)
      setInterval(() => {
        const slot = Math.floor(Math.random() * 9);
        bot.setQuickBarSlot(slot);
      }, 20000 + Math.random() * 10000);
    });

    // Auto Login/Register
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
  });
}

startBot();
