import { Bot, session } from "grammy";
import { parseMode } from "@grammyjs/parse-mode";;
import { I18n } from "@grammyjs/i18n";
import mongoose from 'mongoose';
import { MyContext, SessionData } from "./typings/context";
import config from "./typings/config";
import { run } from "@grammyjs/runner";

import { setGroup } from "./middlewares/setGroup";
import { isAdmin } from "./middlewares/isAdmin";
import { setUser } from "./middlewares/setUser";
import { setGroupUser } from "./middlewares/setGroupUser";
import { log } from "./middlewares/log";

import makeFap from "./actions/makeFap";
import myChatMember from "./actions/myChatMember";
import topUsers from "./actions/topUsers";
import topGroupUsers from "./actions/topGroupUsers";
import { keyboard } from "./keyboards";
import { addRef } from "./middlewares/addRef";
import { conversations, createConversation } from "@grammyjs/conversations";
import { BotCommand } from "grammy/types";

import { AsyncTask, CronJob, ToadScheduler } from "toad-scheduler";
import updateGroupTop from "./services/updateGroupTop";
import topGroups from "./actions/topGroups";

mongoose
  .connect(config.URI)
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.log(err));

const i18n = new I18n<MyContext>({
    defaultLocale: "ru",
    directory: "src/locales",
  });

const commandsPrivate: BotCommand[] = [
    { command: "start", description: "🎲 Играть"},
    { command: "help", description: "📖 Помощь" },
  ];

const commandsGroup: BotCommand[] = [
    { command: "global_top", description: "🌍 Глобальный топ"},
    { command: "top_dick", description: "⚜️ Топ этой группы" },
    { command: "top_groups", description: "💬 Топ групп" },
  ];

const bot = new Bot<MyContext>(config.TOKEN);
bot.api.setMyCommands(commandsPrivate, { scope: { type: "all_private_chats" }})
bot.api.setMyCommands(commandsGroup, { scope: { type: "all_group_chats" }})

bot.api.config.use(parseMode("HTML"));
bot.use(i18n);
bot.use(log);
bot.use(session({ initial: (): SessionData => ({}) }))
bot.use(conversations());
bot.use(setUser);

bot.command("help", async (ctx) => {
  await ctx.api.sendMessage(ctx.chatId, ctx.t("help"))
})


const privateBot = bot.chatType('private');
privateBot.use(addRef);

privateBot.command("start", async (ctx) => {
  await ctx.api.sendMessage(ctx.chatId, ctx.t("start"), { reply_markup: keyboard })
})

privateBot.on(":text", async (ctx) => {
  await ctx.api.sendMessage(ctx.chatId, ctx.t("chatWarn"), { reply_markup: keyboard })
})

const groupBot = bot.chatType(['group', 'supergroup']);
groupBot.use(setGroup);
groupBot.use(setGroupUser);

groupBot.command("start", async (ctx) => {
  await ctx.api.sendMessage(ctx.chatId, ctx.t("start"))
})

groupBot.command("dick", makeFap);

groupBot.command("global_top", topUsers);
groupBot.command("top_dick", topGroupUsers);
groupBot.command("top_groups", topGroups);

bot.on("my_chat_member", myChatMember);

run(bot);

const scheduler = new ToadScheduler()

scheduler.addCronJob(
  new CronJob(
    {
      cronExpression: `* * * * *`
    },
    new AsyncTask("update", () => updateGroupTop(bot.api)),
    {
      preventOverrun: true
    }
  )
)