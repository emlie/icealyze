const r = require('rethinkdb')

const db_navn = 'icealyze'
const banekvalitet_tabell_navn = 'banekvalitet'
const kamper_tabell_navn = 'kamper'
const status_tabell_navn = 'status'

class Kamp {

    constructor(bane_navn='Rink A' ,kamp_navn='Uten navn', host='localhost') {
        this.kamp_navn = kamp_navn
        this.bane_navn = bane_navn
        this.host = host
        console.log(`En ny kamp opprettet med navn: ${kamp_navn}`)
    }

    async start(overkjor_kamp=false) {
        console.log(`${this.kamp_navn}: Starter tilkobling til database...`)

        this.conn = await r.connect({
            host: this.host,
            port: 28015,
            db: db_navn,
        });

        console.log(`${this.kamp_navn}: Tilkoblet database`);

        // sjekke om kamp allerede pågår
        var kamp_status_cursor = await r.db(db_navn).table(status_tabell_navn).filter({bane: this.bane_navn}).run(this.conn)
        var kamp_status = await kamp_status_cursor.next()
        console.log(kamp_status)
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

        console.log(`${this.kamp_navn}: Kamp startet med kamp_id ${this.kamp_id}`)
    }

    async avslutt() {
        await r.db(db_navn).table(status_tabell_navn).filter({kamp_id: this.kamp_id}).update({
            kamp_aktiv: false,
            tidsstempel: new Date(),
        }).run(this.conn)

        console.log(`${this.kamp_navn}: Kamp avsluttet`)
    }
}

module.exports = Kamp