import numpy as np
import matplotlib.pyplot as plt
import os
import math

os.chdir(os.path.dirname(os.path.abspath(__file__)))

# N = 2500  #antall pebbles 

# x = np.random.rand(N)
# y = np.random.rand(N)
# s = 1+np.random.rand(N)*6

x = np.empty(shape=(100*100, 1))
y = np.empty(shape=(100*100, 1))
s = np.empty(shape=(100*100, 1))


for i in range(len(x)):
    x[i] = i%100
    j = int(i/100)
    y[i] = j
    s[i] = np.sin(4*math.pi*np.abs(((i%100) - 50)*(j - 50))/(50*50)+0.5)*2

plt.figure(figsize=(12,8))
plt.scatter(x, y, c='red', s=s*4, alpha=1) #s --> størrelse på pebble

# fjerne alt bortsett fra selve bilde fra plott
plt.gca().set_axis_off()
plt.subplots_adjust(top = 1, bottom = 0, right = 1, left = 0, 
            hspace = 0, wspace = 0)
plt.margins(0,0)
plt.gca().xaxis.set_major_locator(plt.NullLocator())
plt.gca().yaxis.set_major_locator(plt.NullLocator())
# plt.show()
plt.savefig('slitt.jpg', bbox_inches='tight', pad_inches=0)



plt.figure(figsize=(12,8))
plt.scatter(x, y, c='red', s=4, alpha=1)
plt.gca().set_axis_off()
plt.subplots_adjust(top = 1, bottom = 0, right = 1, left = 0, 
            hspace = 0, wspace = 0)
plt.margins(0,0)
plt.gca().xaxis.set_major_locator(plt.NullLocator())
plt.gca().yaxis.set_major_locator(plt.NullLocator())
plt.savefig('uslitt.jpg', bbox_inches='tight', pad_inches=0)