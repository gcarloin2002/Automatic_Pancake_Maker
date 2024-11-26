# -*- coding: utf-8 -*-

# Imports
from time import sleep
import board
import busio as io
import adafruit_mlx90614

# Weight sensor
import RPi.GPIO as GPIO
from hx711 import HX711

# Constants
START_RAW = 291500  # Reference raw weight for calibration
RAW_TO_GRAM = 99    # Conversion factor for raw to grams

# Initialize components
hx = HX711(dout_pin=16, pd_sck_pin=6)
GPIO.setmode(GPIO.BCM)  # Set GPIO pin mode to BCM numbering

def getTemp():
    i2c = io.I2C(board.SCL, board.SDA, frequency=100000)
    mlx = adafruit_mlx90614.MLX90614(i2c)

    ambient_temp = "{:.2f}".format(mlx.ambient_temperature * (9.0 / 5.0) + 32)
    target_temp = "{:.2f}".format(mlx.object_temperature * (9.0 / 5.0) + 32)

    #print("Ambient Temperature:", ambient_temp, "°F")
    #print("Target Temperature:", target_temp, "°F")
    return target_temp

def getWeight():
    weight = hx.get_weight_mean(20)  # Average over 20 readings for stability
    if weight is False:
        return -1.0

    difference = abs(weight) - abs(START_RAW)
    weight_grams = difference / RAW_TO_GRAM

    print(f"Weight: {weight_grams:.2f} grams")
    return weight_grams
