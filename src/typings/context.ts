import { Context, SessionFlavor } from "grammy";
import { I18nFlavor } from "@grammyjs/i18n";
import { ConversationFlavor } from "@grammyjs/conversations";


export interface SessionData {
  isFreshUser?: boolean,
  isFreshGroups?: number[]
}

export type MyContext = Context & I18nFlavor & SessionFlavor<SessionData> & ConversationFlavor;