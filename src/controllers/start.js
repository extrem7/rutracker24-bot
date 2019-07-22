import Stage from 'telegraf/stage'
import Scene from 'telegraf/scenes/base'
import text from '../utils/text'

const {leave} = Stage

const start = new Scene('start');

start.enter((ctx) => {
    const cid = ctx.chat.id;
    console.log('New user starts chat.');
    ctx.reply(text.start);
});

export default start;