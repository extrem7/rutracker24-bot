import config from './utils/config'
import {Telegram} from 'telegraf';

const telegram = new Telegram(config.TOKEN);
export default telegram;