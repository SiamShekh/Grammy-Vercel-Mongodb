import { Bot, InlineKeyboard } from 'grammy'
import { MongoClient } from 'mongodb'
import 'dotenv/config'

const {
    BOT_TOKEN: token, MONGODB_URI
} = process.env

export const bot = new Bot(token as string);

bot.command('start', async ctx => {
    await ctx.reply('Welcome to ragdoll')
})

bot.command("refer", async (ctx: any) => {

    const url = MONGODB_URI as string;
    const client = new MongoClient(url);
    client.connect().then(() => console.log("Server is connected!"));
    const db = client.db("ragdoll");
    const usersCollection = db.collection("users");

    const keyboard = new InlineKeyboard()
        .url('Open App', 'https://t.me/Ragdoll_App_Bot/app');

    const user = await usersCollection.findOne({ TgId: String(ctx?.from?.id) });
    if (!user?.ReferCode) {
        return ctx.reply(`<b>Hi ${ctx.from.first_name}!</b> \n\n It seems like you haven't opened our mini app yet. \n Could you please open the app, complete your registration, and get your referral link?`, { reply_markup: keyboard, parse_mode: "HTML" })
    };

    return ctx.reply(`<b>Hi ${ctx.from.first_name}!</b> \n\n <b>Invitintion link:</b> https://t.me/Ragdoll_App_Bot/app?startparam=${user?.ReferCode}  \n\n<u>Refer list:</u> \n 1. Siam Sheikh \n 2. Naim Kha`, { reply_markup: keyboard, parse_mode: "HTML" })
})