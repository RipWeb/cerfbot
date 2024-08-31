import { Bot, session } from "grammy";
import { parseMode } from "@grammyjs/parse-mode";;
import { I18n } from "@grammyjs/i18n";
import mongoose from 'mongoose';
import { Redis } from "ioredis";
import { MyContext, SessionData } from "./typings/context";
import config from "./typings/config";
import { run } from "@grammyjs/runner";
import { autoRetry } from "@grammyjs/auto-retry";

import { setGroup } from "./middlewares/setGroup";
import { isAdmin } from "./middlewares/isAdmin";
import { setUser } from "./middlewares/setUser";
import { setGroupUser } from "./middlewares/setGroupUser";

import makeFap from "./actions/makeFap";
import myChatMember from "./actions/myChatMember";
import topUsers from "./actions/topUsers";
import topGroupUsers from "./actions/topGroupUsers";
import { main_kb, menu_kb } from "./helpers/keyboards";
import { addRef } from "./middlewares/addRef";
import { conversations, createConversation } from "@grammyjs/conversations";
import { BotCommand } from "grammy/types";

import { AsyncTask, CronJob, ToadScheduler } from "toad-scheduler";
import updateGroupTop from "./services/updateGroupTop";
import topGroups from "./actions/topGroups";
import { updateName } from "./middlewares/updateName";
import profile from "./actions/profile";
import stat from "./actions/admin/stat";
import { broadcastConservation, cancel_bc } from "./actions/admin/broadcast";
import { backupToFile } from "./actions/admin/backupToFile";
import { log } from "./middlewares/log";
import findEnemy, { cancel_search } from "./actions/findEnemy";
import { attack } from "./actions/attack";

function getSessionKey(ctx: MyContext): string | undefined {
  return ctx.from?.id.toString();
}

export const redis = new Redis();

mongoose
  .connect(config.URI, {enableUtf8Validation: false})
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.log(err));

const i18n = new I18n<MyContext>({
  defaultLocale: "ru",
  directory: "src/locales",
});

const commandsPrivate: BotCommand[] = [
  { command: "help", description: "помощь" },
  { command: "profile", description: "профиль" },
];

const commandsGroup: BotCommand[] = [
  { command: "fap", description: "дрочить" },
  { command: "top", description: "топ пипис чата" },
  { command: "gtop", description: "глобальный топ" },
  { command: "topchats", description: "топ чатов" },
  { command: "profile", description: "профиль" },
];

const bot = new Bot<MyContext>(config.TOKEN);
bot.api.setMyCommands(commandsPrivate, { scope: { type: "all_private_chats" } })
bot.api.setMyCommands(commandsGroup, { scope: { type: "all_group_chats" } })
bot.api.config.use(autoRetry({ 
  rethrowInternalServerErrors: true, 
  maxRetryAttempts: 5, 
  maxDelaySeconds: 2500 }));

bot.api.config.use(parseMode("HTML"));
bot.use(i18n);
bot.use(session({ initial: (): SessionData => ({ isFreshGroups: [] }), getSessionKey }))
bot.use(conversations());
bot.use(log);
bot.use(setUser);
bot.use(updateName);
bot.use(addRef);
bot.use(createConversation(broadcastConservation));

bot.command("help", async (ctx) => {
  await ctx.api.sendMessage(ctx.chatId, ctx.t("help"))
})

const privateBot = bot.chatType('private');

privateBot.command("start", async (ctx) => {
  await ctx.api.sendSticker(ctx.chatId, "CAACAgIAAxkBAAEMubJm0D_hUTD1RqT1syWmYwzRPpYNxwAC7AIAAladvQo58H0nMAtmSDUE", { reply_markup: menu_kb() })
  await ctx.api.sendMessage(ctx.chatId, ctx.t("start"), { reply_markup: main_kb(ctx.from.id) });
})

// privateBot.hears("🎯 В бой", findEnemy);
// privateBot.callbackQuery("cancel_search", cancel_search);
// privateBot.callbackQuery("attack", attack);

//ADMIN
privateBot.command("stat", isAdmin, stat);
privateBot.command("bc", isAdmin, async (ctx) => {
  await ctx.conversation.enter("broadcastConservation");
});
privateBot.callbackQuery("backup", isAdmin, backupToFile);
privateBot.callbackQuery("cancel_bc", isAdmin, cancel_bc);

privateBot.on(":text", async (ctx: MyContext) => {
  await ctx.api.sendMessage(ctx.from.id, ctx.t("chatWarn"), { reply_markup: main_kb(ctx.from.id) });
})

const groupBot = bot.chatType(['group', 'supergroup']);
groupBot.use(setGroup);
groupBot.use(setGroupUser);

groupBot.command("start", async (ctx) => {
  await ctx.api.sendMessage(ctx.chatId, ctx.t("start"), { reply_markup: main_kb(ctx.from.id) })
});

groupBot.command("fap", makeFap);
groupBot.command("gtop", topUsers);
groupBot.command("top", topGroupUsers);
groupBot.command("topchats", topGroups);
groupBot.command("profile", profile);

bot.on("my_chat_member", myChatMember);

run(bot);

const scheduler = new ToadScheduler();

scheduler.addCronJob(
  new CronJob(
    {
      cronExpression: `* * * * *`
    },
    new AsyncTask("update", () => updateGroupTop(bot.api))
  )
)