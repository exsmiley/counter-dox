import numpy as np
import pandas as pd
import random

from flask import Flask

app = Flask(__name__)
addresses = np.load('generated_addressesv2.npy')
size = len(addresses)

@app.route("/")
def generate_addr():
    index = random.randint(0, size)
    return addresses[index]

if __name__ == "__main__":
    app.run()
