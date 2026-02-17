// index.js
require("dotenv").config();
const { Client, Intents } = require("discord.js");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES],
  partials: ["CHANNEL"], // needed for DMs
});

client.once("ready", (c) => {
  console.log(`Logged in as ${c.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "ping") {
    return interaction.reply({ content: "Pong!", ephemeral: true });
  }

  if (interaction.commandName === "info") {
    const user = interaction.user;
    const created = `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`;

    return interaction.reply({
      content: `Your tag: **${user.tag}**\nYour ID: \`${user.id}\`\nAccount created: ${created}`,
      ephemeral: true,
    });
  }

  if (interaction.commandName === "senddemo") {
    const target = interaction.options.getUser("user");

    // 1) Reply to you (ephemeral)
    await interaction.reply({
      content: `DM sent to ${target} with a geo/IP demo invite.`,
      ephemeral: true,
    });

    // 2) DM the target user with consent text + placeholder link
    const consentText =
      `${interaction.user} invited you to a geo/IP demo.\n\n` +
      `If you agree, click this link. It will show **your IP + approximate location only to you** in your browser.\n` +
      `If you don't want that, just ignore this message.`;

    // TODO: replace with your real demo page URL later
  const demoUrl = "https://dastanmichelsen-hue.github.io/ip-demo/";

    try {
      await target.send({
        content: `${consentText}\n\nLink: ${demoUrl}`,
      });
    } catch (err) {
      console.error("Failed to DM user:", err);
      // Optional: tell invoker DM failed
      await interaction.followUp({
        content: `I couldn't DM ${target}. They might have DMs disabled.`,
        ephemeral: true,
      });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
