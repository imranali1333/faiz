import { Telegraf, Context, MiddlewareFn } from 'telegraf';
import dotenv from 'dotenv';
import { handleTelegramCommand } from './Users/handleTelegramCommand/telegramHandlers';
import prisma from './utilities/prismaclient';

dotenv.config();
const BOT_TOKEN = process.env.BOT_TOKEN;
const AUTH_URL = process.env.AUTH_URL;

if (!BOT_TOKEN || !AUTH_URL) {
  console.error('BOT_TOKEN or AUTH_URL is not defined in the environment variables');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// Handle /start command
bot.start(async (ctx: Context) => {
  console.log('Received /start command');
  if (!ctx.from) {
    console.error('ctx.from is undefined');
    await ctx.reply('An error occurred while processing your request.');
    return;
  }

  try {
    console.log('Received /start command from user:', ctx.from);

    const telegramId = ctx.from.id;
    const loginUrl = `${AUTH_URL}/telegram/login?telegramId=${telegramId}`;

    console.log('Generated login URL:', loginUrl);

    await ctx.reply(`Welcome! Click [here](${loginUrl}) to login.`, {
      parse_mode: 'Markdown'
    });
  } catch (error) {
    console.error('Error in bot.start handler:', error);
    await ctx.reply('An error occurred while processing your request.');
  }
});

// Middleware for handling text messages
const handleText: MiddlewareFn<Context> = async (ctx) => {
  const { chat, message } = ctx;
  const chatId = chat?.id;
  if (chatId && message && 'text' in message) {
    const text = message.text;
    if (text) {
      console.log(`Received text message from chat ${chatId}: ${text}`);
      await handleTelegramCommand(chatId, text);
    }
  } else {
    console.error('Invalid text message:', message);
  }
};

// Use bot.hears for handling text messages
bot.hears(/.*/, handleText);

// Error handling middleware
bot.catch(async (err: unknown, ctx: Context) => {
  console.error(`Error in bot: ${err instanceof Error ? err.message : 'Unknown error'}`);
  await ctx.reply('Oops! Something went wrong.');
});

// Launch the bot with retry logic
async function launchBot(retries: number = 5, delay: number = 5000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await bot.launch();
      console.log('Bot is running');
      return; // Exit if successful
    } catch (error) {
      console.error(`Failed to launch the bot on attempt ${attempt}:`, error);
      if (attempt < retries) {
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await new Promise(res => setTimeout(res, delay));
      } else {
        console.error('Exceeded maximum retry attempts. Exiting.');
        process.exit(1);
      }
    }
  }
}

launchBot();

// Graceful stop
process.once('SIGINT', async () => {
  await prisma.$disconnect();
  bot.stop('SIGINT');
});

process.once('SIGTERM', async () => {
  await prisma.$disconnect();
  bot.stop('SIGTERM');
});
