import globals from './utils/globals'
import LocalSession from 'telegraf-session-local'
import Stage from 'telegraf/stage';
import startScene from './controllers/start'
import searchScene from './controllers/search'
import limitScene from './controllers/limit'
import text from './utils/text'

const stage = new Stage([
    startScene,
    searchScene,
    limitScene
]);

bot.use((new LocalSession({database: 'db.json'})).middleware())
bot.use(stage.middleware())

bot.start(ctx => ctx.scene.enter('start'))
bot.help(ctx => ctx.reply(text.help))
bot.hears(/\/s (.+)/, ctx => ctx.scene.enter('search'))
bot.hears(/\/limit ([0-9]+$)/, ctx => ctx.scene.enter('limit'))
bot.on('text', ctx => ctx.reply(text.error))

bot.launch()