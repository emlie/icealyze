from rethinkdb import RethinkDB
import os
from datetime import datetime

# Sette gjeldende mappe til scope
os.chdir(os.path.dirname(os.path.abspath(__file__)))

db_navn = 'icealyze'
banekvalitet_tabell_navn = 'banekvalitet'
kamper_tabell_navn = 'kamper'
status_tabell_navn = 'status'

class Kamp():
    def __init__(self, ip='localhost', bane_navn='Rink A'):
        self.bane_navn = bane_navn
        self.r = RethinkDB()
        self.conn = self.r.connect(ip, 28015)

    def hent_kamp_id(self):
        result = self.r.db(db_navn).table(status_tabell_navn).filter({'bane': self.bane_navn}).run(self.conn)
        return result.next()['kamp_id']

    def lagre_bilde(self, fil_plassering):
        kamp_id = self.hent_kamp_id()
        fh = open(fil_plassering, 'rb')
        contents = fh.read()
        fh.close()
        self.r.db(db_navn).table(banekvalitet_tabell_navn).insert({
            'iskvalitet_bilde': self.r.binary(contents),
            'kamp_id': kamp_id,
            'tidsstempel': self.r.expr(datetime.now(self.r.make_timezone('+01:00'))),
        }).run(self.conn)

        print(f'{self.bane_navn}: Nytt bilde lastet opp')

class BaneSensor:
    def __init__(self, ip='localhost', bane_navn='Rink A'):
        self.bane_navn = bane_navn
        self.r = RethinkDB()
        self.conn = self.r.connect(ip, 28015)

    def oppdater_sensordata(self, temperatur, luftfuktighet):
        self.r.db(db_navn).table(status_tabell_navn).filter({'bane': self.bane_navn}).update({
            'luftfuktighet': luftfuktighet,
            'temperatur': temperatur,
        }).run(self.conn)

        print(f'{self.bane_navn}: Sensordata oppdatert')




sensorA = BaneSensor(bane_navn='Rink A')
sensorA.oppdater_sensordata(temperatur=40, luftfuktighet=51)

kampA = Kamp(bane_navn='Rink A')
kamp_id = kampA.hent_kamp_id()
kampA.lagre_bilde(fil_plassering='./test.jpg')
print(kamp_id)
