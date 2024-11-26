#imports
from gpiozero import AngularServo
from time import sleep
from gpiozero.pins.pigpio import PiGPIOFactory
import pigpio

#Temp sensor
import board
import busio as io
import adafruit_mlx90614
from time import sleep

#weight sensor
import time
import RPi.GPIO as GPIO                # Import GPIO
from hx711 import HX711                # Import the HX711 class
# around 5mm for 20seconds
# roughly 100grams per pancake set

# source servo_env/bin/activate
# sudo pigpiod

# Weight sensor setup
GPIO.setmode(GPIO.BCM) # Set GPIO pin mode to BCM numbering
hx = HX711(dout_pin=16, pd_sck_pin=6) # Initialize HX711 with pins
start_raw = 291500 # Set the reference unit (calibrated scale ratio)
raw_to_gram = 99
#######

# CONSTANTS
OILPIN = 22
SERVOPIN = 17
PUMPPIN = 27
HOTPLATE_ANGLE = 242
DROP_ANGLE = 45

# Use pigpio for better PWM control
factory = PiGPIOFactory()
s = AngularServo(SERVOPIN, min_angle=0, max_angle=270, max_pulse_width = 0.0025, min_pulse_width = 0.0005, pin_factory = factory)

s.angle = HOTPLATE_ANGLE - 10 # initially start 10 degrees off the hotplate
sleep(2) # make sure servo gets there

# initialize gpio stuff (for pump and oil)
pi = pigpio.pi()
pi.set_mode(OILPIN, pigpio.OUTPUT)
pi.set_mode(PUMPPIN, pigpio.OUTPUT)

# high on oil means off, low on pump means off
# pi.write(OILPIN, 0)
pi.write(OILPIN, 1)  # Set pin high (1) or low (0)
pi.write(PUMPPIN, 0)

def getTemp():
    i2c = io.I2C(board.SCL, board.SDA, frequency=100000)
    mlx = adafruit_mlx90614.MLX90614(i2c)

    ambientTemp = "{:.2f}".format(mlx.ambient_temperature*(9.0/5.0)+32)
    targetTemp = "{:.2f}".format(mlx.object_temperature*(9.0/5.0)+32)

    sleep(1)

    print("Ambient Temperature:", ambientTemp, "°F")
    print("Target Temperature:", targetTemp,"°F")
    return targetTemp
    sleep(2)

def getWeight():
    # Get weight in grams
    weight = hx.get_weight_mean(20)  # Average over 10 readings for stability
    #weight = hx.get_raw_data_mean()
    print("raw weight is ", weight)
    if(weight == False): return -1.0
    difference = abs(weight) - abs(start_raw)
    print("diff ", difference)
    weight_grams = difference / 99
    print(f"Weight: {weight_grams:.2f} grams")
    return weight_grams
    time.sleep(1)  # Delay between readings
    
    

# sweeps servo from current angle to angle using delay seconds between each degree
def sweep(delay, angle):
    # 242 degrees is angle of pan on hotplate and 55 is dropping position
    print(f"Moving to {angle} degrees...")
    curr = int(s.angle)
    step = 1
    if angle < curr:
        step = -1
    for i in range(curr, angle, step):
        s.angle = i
        sleep(delay)

# spray oil for delay seconds
# We tested for oil around 8 seconds
def oil(delay):
    print(f"Spraying oil for {delay} seconds...")
    pi.write(OILPIN, 0)
    sleep(0.1)
    pi.write(OILPIN, 1)
    sleep(delay)
    pi.write(OILPIN, 0)
    sleep(0.1)
    pi.write(OILPIN, 1)

def oilToggle():
    pi.write(OILPIN, 0)
    sleep(0.1)
    pi.write(OILPIN, 1)

# pump batter for delay seconds 
# We found the best pump time for 2 pancakes is 17 secs
def pump(delay):
    print(f"Pumping for {delay} seconds...")
    pi.write(PUMPPIN, 1)
    sleep(delay)
    pi.write(PUMPPIN, 0)

# We found the best flip delay was 0.66
def flip(delay):
    sweep(0, DROP_ANGLE)
    sleep(delay)
    sweep(0, DROP_ANGLE + 35)
    sleep(0.1)
    sweep(0.01, DROP_ANGLE)
    sleep(5)
    sweep(0.01, HOTPLATE_ANGLE)

def sequence():
    oil(7)    # oil for 2 seconds
    sleep(2)

    # double pump
    pump(20)  # pump for 20 seconds
    sleep(30)
    pump(10)

    # cook
    half_min = 3*2 + 1
    for i in range(half_min):
         sleep(30)
         print(f"{(i+1)*30} seconds into cook...")

    # flip
    flip(0.66)
    

# gently set down
sweep(0.01, HOTPLATE_ANGLE)
print("INIT COMPLETE")
# oilToggle()
# oilToggle()

###### MAIN SEQUENCE ######

if __name__=="__main__":
    print("INIT COMPLETE, STARTING SEQUENCE")
    

    # oil(8)    # oil for 2 seconds
    # sleep(2)

    # # double pump
    # pump(20)  # pump for 20 seconds
    # sleep(30)
    # pump(10)

    # # cook
    # half_min = 3*2
    # for i in range(half_min):
    #      sleep(30)
    #      print(f"{(i+1)*30} seconds into cook...")


    # # flip
    # flip(0.66)

    # pi.stop()

    # pump(15)
