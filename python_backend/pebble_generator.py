import numpy as np
import matplotlib.pyplot as plt
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))

N = 1000  #antall pebbles 

x = np.random.rand(N)
y = np.random.rand(N)

x_2 = np.random.rand(N)/2
y_2 = np.random.rand(N)/2

plt.scatter(x+x_2, y+y_2,c='red', s=10, alpha=0.2) #s --> stÃ¸rrelse pÃ¥ pebbles
plt.show()
