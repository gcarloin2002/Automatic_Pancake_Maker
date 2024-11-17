from gpiozero import AngularServo
from time import sleep
from gpiozero.pins.pigpio import PiGPIOFactory
import pigpio

# 
OILPIN = 22
SERVOPIN = 17
PUMPPIN = 27
HOTPLATE_ANGLE = 242
DROP_ANGLE = 55

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
pi.write(OILPIN, 1)  # Set pin high (1) or low (0)
pi.write(PUMPPIN, 0)

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
def oil(delay):
    print(f"Spraying oil for {delay} seconds...")
    pi.write(OILPIN, 0)
    sleep(0.1)
    pi.write(OILPIN, 1)
    sleep(delay)
    pi.write(OILPIN, 0)
    sleep(0.1)
    pi.write(OILPIN, 1)

# pump batter for delay seconds
def pump(delay):
    print(f"Pumping for {delay} seconds...")
    pi.write(PUMPPIN, 1)
    sleep(delay)
    pi.write(PUMPPIN, 0)

# gently set down
sweep(0.01, HOTPLATE_ANGLE)
print("INIT COMPLETE, STARTING SEQUENCE")

###### MAIN SEQUENCE ######

# oil(6)    # oil for 2 seconds
# sleep(2)
# pump(17)  # pump for 20 seconds

# # cook
# half_min = 4*2
# for i in range(half_min):
#     sleep(30)
#     print(f"{(i+1)*30} seconds into cook...")


# # flip
# sweep(0, DROP_ANGLE)
# sleep(2)
# sweep(0.01, HOTPLATE_ANGLE)

# pi.stop()

pump(15)