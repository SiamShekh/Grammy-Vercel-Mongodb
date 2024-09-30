import { Bot, Context, InlineKeyboard } from 'grammy'
import 'dotenv/config'
import { MongoClient } from 'mongodb';

const {
    BOT_TOKEN: token, MONGODB_URI
} = process.env

export const bot = new Bot(token as string);
const url = MONGODB_URI;
const client = new MongoClient(url as string);

bot.command('start', async ctx => {
    await ctx.reply('Welcome to Cricbuzz')
});

bot.command("me", async (ctx: Context) => {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db("grammy_magic");
    const collection = db.collection('user');
    const user = await collection.findOne({ id: ctx?.from?.id as number });
    if (user?._id) {
        return ctx.reply(`Name: ${user?.first_name} \nUsername: @${user?.username}\nID: ${user?.id}`)
    } else {
        return ctx.reply("The user is not exist on server!")
    }
})

bot.command("update", async (ctx: Context) => {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db("grammy_magic");
    const collection = db.collection('user');
    const user = await collection.findOneAndUpdate({ id: ctx?.from?.id as number }, {
        $set: {
            first_name: ctx?.message?.text?.split("/update")[1].trim() as string
        },
    },
        { returnDocument: "after" }
    );

    if (user?._id) {
        return ctx.reply(`Name: ${user?.first_name} \nUsername: @${user?.username}\nID: ${user?.id}`)
    } else {
        return ctx.reply("The user is not exist on server!")
    }
})

bot.command("delete", async (ctx: Context) => {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db("grammy_magic");
    const collection = db.collection('user');
    const user = await collection.findOneAndDelete({ id: ctx?.from?.id as number });
    if (user?._id) {
        return ctx.reply(`User is deleted!`)
    } else {
        return ctx.reply("The user is not exist on server!")
    }
})

bot.on("message", async (ctx: Context) => {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db("grammy_magic");
    const collection = db.collection('user');
    const user = await collection.findOne({ id: ctx?.from?.id as number });

    if (!user?._id) {
        await collection.insertOne(ctx?.from as {});
        console.log("User is created!");
    } else {
        console.log("User already exits!");
    }
})

bot.start();