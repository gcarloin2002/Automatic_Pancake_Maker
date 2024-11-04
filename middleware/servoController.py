from gpiozero import Servo
from time import sleep
from gpiozero.pins.pigpio import PiGPIOFactory

# Use pigpio for better PWM control
factory = PiGPIOFactory()
servo = Servo(17, pin_factory=factory)  # Adjust GPIO pin as needed

# Define positions within range -1 to 1
start = -0.5       # Adjusted start position
setpos = 0.1       # Adjusted midway position
end = 0.5          # Adjusted end position
increment = 0.01   # Steps for smooth movement
speed = 0.01       # Speed delay for movement
resetspeed = 0.014 # Speed for reset movement

# Start up the servo
print("starting..")
servo.value = start  # Move to start position
sleep(5)  # Wait for 5 seconds
print("write")
servo.value = start

def move_servo(start_pos, end_pos, step, delay):
    """Move servo smoothly from start_pos to end_pos within range."""
    position = start_pos
    while (position <= end_pos if step > 0 else position >= end_pos):
        # Ensure position stays within -1 to 1
        position = max(-1, min(1, position))
        servo.value = position
        position += step
        sleep(delay)

# Main loop
while True:
    # Move from start to end position
    move_servo(start, end, -increment, speed)

    # Shake movement
    sleep(0.1)
    servo.value = end - 0.15  # Ensure within bounds
    sleep(0.2)
    servo.value = end
    sleep(1.0)

    # Move from end back to set position
    move_servo(end, setpos, increment, resetspeed)

    # Wait before next loop
    sleep(7.0)
