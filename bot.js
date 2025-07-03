const mineflayer = require("mineflayer");
const { pathfinder, Movements, goals } = require("mineflayer-pathfinder");

const HOST = "play.smgin.me";
const PORT = 58073;
const USERNAME = "SMGSecurity";
const VERSION = "1.21.4";
const PASSWORD = "Securitybysmg007";

function startBot() {
  const bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: USERNAME,
    version: VERSION,
  });

  bot.loadPlugin(pathfinder);

  bot.on("error", console.error);
  bot.on("kicked", (reason) => console.warn("⚠️ [kicked]", reason.toString()));
  bot.on("end", () => {
    console.log("🔁 Disconnected. Reconnecting in 10s...");
    setTimeout(startBot, 10000);
  });

  bot.once("login", () => {
    console.log("✅ Logged in!");

    bot.on("spawn", () => {
      console.log("✅ Spawned");

      const defaultMove = new Movements(bot);
      bot.pathfinder.setMovements(defaultMove);

      // Walk to random positions around spawn
      setInterval(() => {
        const pos = bot.entity.position.offset(
          (Math.random() - 0.5) * 10,
          0,
          (Math.random() - 0.5) * 10
        );
        bot.pathfinder.setGoal(new goals.GoalBlock(pos.x, pos.y, pos.z));
      }, 15000); // Move every 15 seconds

      // Look around randomly
      setInterval(() => {
        const yaw = Math.random() * Math.PI * 2;
        const pitch = (Math.random() - 0.5) * Math.PI;
        bot.look(yaw, pitch, true);
      }, 3000);

      // Jump every so often
      setInterval(() => {
        bot.setControlState("jump", true);
        setTimeout(() => bot.setControlState("jump", false), 400);
      }, 20000);
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
