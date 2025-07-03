const mineflayer = require("mineflayer");
const { pathfinder, Movements, goals } = require("mineflayer-pathfinder");

const HOST = "play.smgin.me";
const PORT = 58073;
const USERNAME = "SMGSecurity";
const PASSWORD = "Securitybysmg007";
const VERSION = "1.21.4"; // or "auto"

function startBot() {
  const bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: USERNAME,
    version: VERSION,
  });

  bot.loadPlugin(pathfinder);

  bot.on("error", console.error);
  bot.on("kicked", (reason) => console.warn("⚠️ Kicked:", reason.toString()));
  bot.on("end", () => {
    console.log("🔁 Disconnected. Reconnecting in 10s...");
    setTimeout(startBot, 10000);
  });

  bot.once("login", () => {
    console.log("✅ Logged in.");

    bot.on("spawn", () => {
      console.log("🚶 Bot spawned.");

      const mcData = require("minecraft-data")(bot.version);
      const defaultMove = new Movements(bot, mcData);
      bot.pathfinder.setMovements(defaultMove);

      // Walk to random nearby position every 15–25s
      setInterval(() => {
        const offsetX = Math.floor(Math.random() * 10 - 5);
        const offsetZ = Math.floor(Math.random() * 10 - 5);
        const pos = bot.entity.position.offset(offsetX, 0, offsetZ);
        bot.pathfinder.setGoal(new goals.GoalBlock(pos.x, pos.y, pos.z));
      }, 15000 + Math.random() * 10000);

      // Look around every few seconds
      setInterval(() => {
        const yaw = Math.random() * Math.PI * 2;
        const pitch = (Math.random() - 0.5) * Math.PI;
        bot.look(yaw, pitch, true);
      }, 3000);

      // Jump every 20–30s
      setInterval(() => {
        bot.setControlState("jump", true);
        setTimeout(() => bot.setControlState("jump", false), 500);
      }, 20000 + Math.random() * 10000);

      // Random hotbar switching
      setInterval(() => {
        const slot = Math.floor(Math.random() * 9);
        bot.setQuickBarSlot(slot);
      }, 20000);

      // Swing arm every 10–15s
      setInterval(() => {
        bot.swingArm();
      }, 10000 + Math.random() * 5000);
    });

    // Auto login/register
    bot.on("message", (msg) => {
      const text = msg.toString().toLowerCase();
      if (text.includes("register")) {
        bot.chat(`/register ${PASSWORD} ${PASSWORD}`);
      } else if (text.includes("login")) {
        bot.chat(`/login ${PASSWORD}`);
      }
    });
  });
}

startBot();
