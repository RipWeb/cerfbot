import { Bot, session } from "grammy";
import { parseMode } from "@grammyjs/parse-mode";;
import { I18n } from "@grammyjs/i18n";
import mongoose from 'mongoose';
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
import { keyboard } from "./keyboards";
import { addRef } from "./middlewares/addRef";
import { conversations, createConversation } from "@grammyjs/conversations";
import { BotCommand } from "grammy/types";

import { AsyncTask, CronJob, ToadScheduler } from "toad-scheduler";
import updateGroupTop from "./services/updateGroupTop";
import topGroups from "./actions/topGroups";
import { updateName } from "./middlewares/updateName";
import profile from "./actions/profile";
import { log } from "./middlewares/log";
import stat from "./actions/admin/stat";

mongoose
  .connect(config.URI)
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.log(err));

const i18n = new I18n<MyContext>({
  defaultLocale: "ru",
  directory: "src/locales",
});

const commandsPrivate: BotCommand[] = [
  { command: "start", description: "играть" },
  { command: "help", description: "помощь" },
  { command: "profile", description: "профиль" },
];

const commandsGroup: BotCommand[] = [
  { command: "dick", description: "растить пипису" },
  { command: "global_top", description: "глобальный топ" },
  { command: "top_dick", description: "топ этого чата" },
  { command: "top_groups", description: "топ чатов" },
  { command: "profile", description: "профиль" },
];

const bot = new Bot<MyContext>(config.TOKEN);
bot.api.setMyCommands(commandsPrivate, { scope: { type: "all_private_chats" } })
bot.api.setMyCommands(commandsGroup, { scope: { type: "all_group_chats" } })
bot.api.config.use(autoRetry({
  maxRetryAttempts: 1, // only repeat requests once
  maxDelaySeconds: 5, // fail immediately if we have to wait >5 seconds
}));
bot.api.config.use(parseMode("HTML"));
bot.use(i18n);
bot.use(session({ initial: (): SessionData => ({ isFreshGroups: [] }) }))
bot.use(conversations());
bot.use(setUser);
bot.use(updateName);
bot.use(addRef);
bot.use(log);

bot.command("profile", profile);

bot.command("help", async (ctx) => {
  await ctx.api.sendMessage(ctx.chatId, ctx.t("help"))
})


const privateBot = bot.chatType('private');

privateBot.command("start", async (ctx) => {
  await ctx.api.sendMessage(ctx.chatId, ctx.t("start"), { reply_markup: keyboard(ctx.from.id) })
})

privateBot.command("stat", isAdmin, stat);

privateBot.on(":text", async (ctx) => {
  await ctx.api.sendMessage(ctx.chatId, ctx.t("chatWarn"), { reply_markup: keyboard(ctx.from.id) })
})

const groupBot = bot.chatType(['group', 'supergroup']);
groupBot.use(setGroup);
groupBot.use(setGroupUser);

groupBot.command("start", async (ctx) => {
  await ctx.api.sendMessage(ctx.chatId, ctx.t("start"), { reply_markup: keyboard(ctx.from.id) })
});

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