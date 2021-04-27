import os
import cv2
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.cm as cm

# sette mappen python scriptet er i til arbeidsmappe. Kan dermed ha bilder i samme mappe som script
os.chdir(os.path.dirname(os.path.abspath(__file__)))



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

# uslitt = img_avg_block('./hall_slitt.png')
# slitt = img_avg_block('./hall_uslitt.png')

# diff_img = np.zeros(shape=(len(uslitt), len(uslitt[0])))

# for i in range(len(slitt)):
#     for j in range(len(slitt[0])):
#         diff_img[i][j] = slitt[i][j] - uslitt[i][j]

# # # vise bilde
# # plt.imshow(diff_img, interpolation=interpolasjon_metoder[16], cmap=cm.jet_r) # sinc blur metode
# plt.imshow(diff_img, interpolation=interpolasjon_metoder[16], cmap=cm.jet_r) # sinc blur metode
# # plt.imshow(diff_img)
# plt.show()