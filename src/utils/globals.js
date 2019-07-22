import Telegraf from 'telegraf';
import config from './config'

global.bot = new Telegraf(config.TOKEN)

export default {};