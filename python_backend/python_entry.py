from rethinkdb import RethinkDB
import os
from datetime import datetime
from picamera import PiCamera
from time import sleep
import cv2
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.cm as cm

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

    def hent_kamp_id(self, count=0):
        try:
            result = self.r.db(db_navn).table(status_tabell_navn).filter({'bane': self.bane_navn}).run(self.conn)
        except:
            if (count <= 20):
                count += 1
                result = self.hent_kamp_id(count)
            else:
                print(f'{self.bane_navn}: Feilet med å laste opp data til databasen')
                return 0
        return result.next()['kamp_id']

    def lagre_referanse_bilde(self, fil_plassering, count=0):
        fh = open(fil_plassering, 'rb')
        contents = fh.read()
        fh.close()
        try:
            self.db(db_navn).table(status_tabell_navn).filter({'bane': self.bane_navn}).update({
                'ref_bilde': self.r.binary(contents),
            })
        except:
            if (count <= 20):
                count += 1
                self.lagre_referanse_bilde(fil_plassering, count)
            else:
                print(f'{self.bane_navn}: Feilet med å laste opp referansebilde til databasen')

    def lagre_bilde(self, fil_plassering, count=0):
        kamp_id = self.hent_kamp_id()
        fh = open(fil_plassering, 'rb')
        contents = fh.read()
        fh.close()
        try:
            self.r.db(db_navn).table(banekvalitet_tabell_navn).insert({
                'iskvalitet_bilde': self.r.binary(contents),
                'kamp_id': kamp_id,
                'tidsstempel': self.r.expr(datetime.now(self.r.make_timezone('+01:00'))),
            }).run(self.conn)
        except:
            if (count <= 20):
                count += 1
                self.lagre_bilde(fil_plassering, count)
            else:
                print(f'{self.bane_navn}: Feilet med å laste opp data til databasen')

        print(f'{self.bane_navn}: Nytt bilde lastet opp')

class BaneSensor:
    def __init__(self, ip='localhost', bane_navn='Rink A'):
        self.bane_navn = bane_navn
        self.r = RethinkDB()
        self.conn = self.r.connect(ip, 28015)

    def oppdater_sensordata(self, temperatur, luftfuktighet, count=0):
        try:
            self.r.db(db_navn).table(status_tabell_navn).filter({'bane': self.bane_navn}).update({
                'luftfuktighet': luftfuktighet,
                'temperatur': temperatur,
            }).run(self.conn)
        except:
            if (count <= 20):
                count += 1
                self.oppdater_sensordata(temperatur, luftfuktighet, count)
            else:
                print(f'{self.bane_navn}: Feilet med å laste opp data til databasen')

        print(f'{self.bane_navn}: Sensordata oppdatert')

# Metoder for å smoothe ut bilde
interpolasjon_metoder = [None, 'none', 'nearest', 'bilinear', 'bicubic', 'spline16',
           'spline36', 'hanning', 'hamming', 'hermite', 'kaiser', 'quadric',
           'catrom', 'gaussian', 'bessel', 'mitchell', 'sinc', 'lanczos']

def img_avg_block(name):
        # hente inn bilde og gjøre det til format RGB
    im = cv2.imread(name)
    im = cv2.cvtColor(im, cv2.COLOR_BGR2RGB)

    block_size = 70

    # antall blocks som skal lages, ut ifra bildens størrelse og block_size
    i_max = int(len(im)/block_size)
    j_max = int(len(im[0])/block_size)

    # initialisere endelig array
    color_avg = np.zeros(shape=(i_max, j_max))

    # Deler opp bilde i størrelse spesifisert med block_size og looper over disse
    for i in range(i_max):
        for j in range(j_max):

            # loope over hver pixel inni hver av disse blockene og kalkulere gjennomsnitlig av fargen rød (index 0)
            color_calc = 0
            for x in range(block_size):
                for y in range(block_size):
                    color_calc += im[i*block_size + x][j*block_size + y][0] # siste index er for fargen rød
            color_calc = color_calc/(block_size**2)
            color_avg[i][j] = color_calc
    return color_avg

#setup
kampA = Kamp(bane_navn='Rink A')
camera = PiCamera()
print('Referansebilde kommer nå til å bli tatt')
sleep(0.2) # kamera klargjøring
input('Trykk enter for å ta referansebilde...')

camera.capture('ref_img.png')

while True:
    input('Trykk enter for å ta oppdateringsbilde...')
    print('Tar nytt bilde og genererer heatmap')
    camera.capture('temp_img.png')

    uslitt = img_avg_block('./ref_img.png')
    slitt = img_avg_block('./temp_img.png')

    diff_img = np.zeros(shape=(len(uslitt), len(uslitt[0])))

    for i in range(len(slitt)):
        for j in range(len(slitt[0])):
            diff_img[i][j] = round((slitt[i][j] - uslitt[i][j])*0.5) + 127

    plt.imshow(diff_img, interpolation=interpolasjon_metoder[16], cmap=cm.jet_r) # sinc blur metode
    plt.axis('off')
    plt.savefig('./temp_diff_img.png')

    kampA.lagre_bilde(fil_plassering='./temp_diff_img.png')

    print('Nytt heatmap lastet opp')

    sleep(2)
