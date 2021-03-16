import numpy as np
import matplotlib.pyplot as plt
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))

N = 5000  #antall pebbles 

x = np.random.rand(N)
y = np.random.rand(N)
s = np.random.rand(N)*2


# x_2 = np.random.rand(N)/2
# y_2 = np.random.rand(N)/2

plt.scatter(x, y,c='red', s=s, alpha=1) #s --> stÃ¸rrelse pÃ¥ pebbles
plt.show()
