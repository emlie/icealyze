const r = require('rethinkdb')

const db_navn = 'icealyze'
const banekvalitet_tabell_navn = 'banekvalitet'
const kamper_tabell_navn = 'kamper'
const status_tabell_navn = 'status'

class Bane {

    constructor(bane_navn='Rink A' ,host='localhost') {
        this.bane_navn = bane_navn
        this.kamp_aktiv = false
        this.kamp_navn = null
        this.host = host
        console.log(`En ny bane opprettet med navn: ${bane_navn}`)
    }

    async init() {
        // Tilkoble database
        console.log(`${this.bane_navn}: Starter tilkobling til database...`)

        this.conn = await r.connect({
            host: this.host,
            port: 28015,
            db: db_navn,
        });

        console.log(`${this.bane_navn}: Tilkoblet database`);

        await this.oppdater_bane_status()
    }

    async oppdater_bane_status() {
        // Hente kamp data
        console.log(`${this.bane_navn}: Henter siste kamp..`)

        var status_cursor = await r.db(db_navn).table(status_tabell_navn).filter({bane: this.bane_navn}).run(this.conn)
        var status = await status_cursor.next()
        this.kamp_aktiv = status.kamp_aktiv
        this.kamp_id = status.kamp_id
        this.kamp_aktiv = status.kamp_aktiv
        this.temperatur = status.temperatur;
        this.luftfuktighet = status.luftfuktighet;

        var kamp_cursor = await r.db(db_navn).table(kamper_tabell_navn).orderBy(r.desc('tidsstempel')).filter({id: this.kamp_id}).limit(1).run(this.conn);
        var kamp = await kamp_cursor.next()
        this.kamp_navn = kamp.navn

        console.log(`${this.bane_navn}: Siste kamp hentet med kampnavn "${this.kamp_navn}" og aktiv: ${this.kamp_aktiv}`)
    }

    async start_kamp(kamp_navn='Uten navn', overkjor_kamp=false) {
        this.kamp_navn = kamp_navn;

        // sjekke om kamp allerede pågår
        var kamp_status_cursor = await r.db(db_navn).table(status_tabell_navn).filter({bane: this.bane_navn}).run(this.conn)
        var kamp_status = await kamp_status_cursor.next()
        if (kamp_status['kamp_aktiv'] === true && overkjor_kamp === false) {
            console.log(`${this.kamp_navn}: En kamp er allerede aktiv på denne banen. Kamp <${this.kamp_navn}> termineres. For å tvinge kamp, sett overkjor_kamp=true i start().`)
            return
        }

        // starte kamp i db
        var res = await r.db(db_navn).table(kamper_tabell_navn).insert({
            navn: kamp_navn,
            tidsstempel: new Date(),
        }).run(this.conn)
        
        this.kamp_id = res['generated_keys'][0]

        await r.db(db_navn).table(status_tabell_navn).filter({bane: this.bane_navn}).update({
            kamp_id: this.kamp_id,
            kamp_aktiv: true,
            tidsstempel: new Date(),
        }).run(this.conn)

        this.kamp_aktiv = true

        console.log(`${this.kamp_navn}: Kamp startet med kamp_id ${this.kamp_id}`)
    }

    async avslutt_kamp() {

        // sjekke om det er en kamp å avslutte
        var kamp_status_cursor = await r.db(db_navn).table(status_tabell_navn).filter({bane: this.bane_navn}).run(this.conn)
        var kamp_status = await kamp_status_cursor.next()
        if (kamp_status['kamp_aktiv'] === false) {
            console.log(`${this.bane_navn}: Det er ingen aktiv kamp å avslutte`)
            return
        }

        await r.db(db_navn).table(status_tabell_navn).filter({kamp_id: this.kamp_id}).update({
            kamp_aktiv: false,
            tidsstempel: new Date(),
        }).run(this.conn)

        this.kamp_aktiv = false;

        console.log(`${this.kamp_navn}: Kamp avsluttet`)
    }

    hent_kamp_status() {
        return {
            kamp_navn: this.kamp_navn,
            kamp_aktiv: this.kamp_aktiv,
            temperatur: this.temperatur,
            luftfuktighet: this.luftfuktighet,
        }
    }

    async status_stream(callback) {
        var status_stream_cursor = await r.db(db_navn).table(status_tabell_navn).filter({bane: this.bane_navn}).changes().run(this.conn)
        status_stream_cursor.each((err, row) => {
            callback(row.new_val)
        })
    }

    async bilde_stream(callback) {
        var bilde_stream_cursor = await r.db(db_navn).table(banekvalitet_tabell_navn).filter({kamp_id: this.kamp_id}).changes().run(this.conn)
        bilde_stream_cursor.each((err, row) => {
            callback(row.new_val)
        })
    }
}

module.exports = Bane