"""
This script trains a Markov Chain on OpenAddress dataset to
generate fake email addresses.

-- version01, Samir Sen
"""

import os, sys
import numpy as np
import pandas as pd
import tensorflow as tf

import random

data_dir = "./openaddr-collected-us_west/us/ca/"
addr_fields = ["NUMBER", "STREET", "CITY", "STATE", "POSTCODE"]

def build_addr_dict():
    addr_dict = dict(list())

    for location in os.listdir(data_dir):
        df = pd.read_csv(data_dir + location)
        for field in addr_fields:

            if field == "STATE":
                addr_dict[field] = 'CA'

            elif field in addr_dict and field in df:
                addr_dict[field] += list(df[field])

            elif field not in addr_dict and field in df:
                addr_dict[field] = list(df[field])

    return addr_dict

def build_addresses():
    addr_list = []
    for location in os.listdir(data_dir):
        df = pd.read_csv(data_dir + location)
        for i in range(len(df)):

            address = ""
            for field in addr_fields:
                if field == 'STATE': address += 'CA '
                elif field in df and df.iloc[i][field]: address += str(df.iloc[i][field]) + " "

            addr_list.append(address)

    return addr_list

def sample_address(addr_dict):
    address = ""
    for field in addr_fields:
        if field == 'STATE':
            address += ", CA "
            continue

        index = random.randint(0, len(addr_dict[field]))

        while str(addr_dict[field][index]) == 'nan':
            index = random.randint(0, len(addr_dict[field]))

        if field == 'POSTCODE' and type(addr_dict[field][index]) == np.float64:
            addr_dict[field][index] = int(addr_dict[field][index])

        if field == 'NUMBER' and type(addr_dict[field][index]) == np.float64:
            addr_dict[field][index] = int(addr_dict[field][index])

        while field == 'POSTCODE' and addr_dict[field][index] == 0.0:
            index = random.randint(0, len(addr_dict[field]))

        address += str(addr_dict[field][index]) + " "

    return address

def generate_dataset(addr_dict):
    dataset = []
    for i in range(10000):
        fake_address = sample_address(addr_dict)
        dataset.append(fake_address)

    return dataset

addr_dict = build_addr_dict()
print sample_address()

dataset = generate_dataset(addr_dict)
