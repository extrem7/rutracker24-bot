import Scene from 'telegraf/scenes/base'
import text from '../utils/text'

const limit = new Scene('limit');

limit.enter((ctx) => {
    ctx.session.limit = ctx.match[1];
    ctx.reply(text.limit_success)
});

bot.hears('/limit', ctx => ctx.reply(text.limit_error))
bot.hears('/limit 0', ctx => ctx.reply(text.limit_zero))
export default limit;