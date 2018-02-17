from flask import Flask
from faker import Faker
fake = Faker()
app = Flask(__name__)

@app.route('/fake')
def get_fake():
    return fake.address()
