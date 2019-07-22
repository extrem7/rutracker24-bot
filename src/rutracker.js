const fs = require('fs');
const zip = require('node-zip')
import config from './utils/config'
import helpers from './utils/helpers'
import RutrackerApi from 'rutracker-api'
import Torrent from 'rutracker-api/lib/torrent'

export default {
    rutracker: null,
    async login() {
        if (this.rutracker == null) {
            this.rutracker = new RutrackerApi();
            await this.rutracker.login(config.rutrackerUser)
        }
    },
    async search(query, limit = config.limit) {
        await this.login()
        let torrents = await this.rutracker.search({query, sort: 'seeds', order: 'desc'})
        if (torrents.length) {
            torrents = this.parse(torrents.slice(0, limit));
        }
        return torrents
    },
    async torrentFile(id) {
        await this.login()

        const file = `${id}.torrent`,
            fileZip = `${id}.torrent.zip`

        const stream = await this.rutracker.download(id)
        await stream.pipe(fs.createWriteStream(file))

        const archive = new zip()
        archive.file(file, 'hello there')
        const data = archive.generate({base64: false, compression: 'DEFLATE'})
        await fs.writeFileSync(fileZip, data, 'binary');
        fs.unlink(file, err => {
            if (err) console.log(err)
        })
        return fileZip
    },
    async magnetUri(id) {
        await this.login()
        return await this.rutracker.getMagnetLink(id)
    },
    parse(rawTorrent) {
        return rawTorrent.map(torrent => {
            const {id, seeds, size, title} = torrent;
            return {id, title, seeds, size}
        })
    },
    markDown(torrent) {
        const {id, seeds, size, title} = torrent;
        return `*${title}*\nСиды: ${seeds} Размер: ${helpers.fileSize(size)}`
    }
}