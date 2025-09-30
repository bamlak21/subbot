import { Telegraf } from "telegraf";
import { config } from "../config/index";

export const bot = new Telegraf(config.bot);

import "./commands";
