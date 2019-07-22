const fs = require('fs')
import rutracker from '../rutracker'
import Scene from 'telegraf/scenes/base'
import text from '../utils/text'

const search = new Scene('search')

search.enter((ctx) => {
    const query = ctx.match[1]
    if (query.length) {
        console.log(`User sent search request: ${query}`)
        rutracker.search(query, ctx.session.limit).then(async torrents => {
            if (torrents.length) {
                await ctx.reply(text.search_success, {
                    reply_markup: {
                        disable_notification: true
                    }
                })
                torrents.forEach(torrent => {
                    const {id} = torrent
                    ctx.replyWithMarkdown(rutracker.markDown(torrent), {
                        reply_markup: {
                            inline_keyboard: [
                                [{text: '.torrent', callback_data: `/torrent ${id}`}],
                                [{text: 'magnet', callback_data: `/magnet ${id}`}]
                            ],
                            disable_notification: true
                        }
                    });
                });
            } else {
                ctx.reply(text.search_error)
            }
        })
    }
});

bot.hears('/s', ctx => ctx.reply(text.search_empty))

bot.action(/\/torrent (.+)/, ctx => {
    const tid = ctx.match[1]
    rutracker.torrentFile(tid).then(file => {
        ctx.replyWithDocument({source: file}, {
            caption: 'Вот твой желанный торрент.'
        }).then(() => {
            fs.unlink(file, err => {
                if (err) console.log(err)
            })
        })
        ctx.answerCbQuery()
    })
});

bot.action(/\/magnet (.+)/, ctx => {
    const tid = ctx.match[1]
    rutracker.magnetUri(tid).then(uri => {
        ctx.reply('Копируй ссылку в торрент клиент и наслаждайся:').then(()=>{
            ctx.reply(uri)
        })
        ctx.answerCbQuery()
    })
});

export default search;