import { Context, SessionFlavor } from "grammy";
import { I18nFlavor } from "@grammyjs/i18n";
import { IUser } from "../models/user";
import { IGroup } from "../models/group";
import { ConversationFlavor } from "@grammyjs/conversations";


export interface SessionData {
  user?: IUser
  group?: IGroup
  isFreshUser?: boolean
}

export type MyContext = Context & I18nFlavor & SessionFlavor<SessionData> & ConversationFlavor;