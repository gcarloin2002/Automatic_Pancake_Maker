import time
import RPi.GPIO as GPIO                # Import GPIO
from hx711 import HX711                # Import the HX711 class

# Set GPIO pin mode to BCM numbering
GPIO.setmode(GPIO.BCM)

# Initialize HX711 with pins
hx = HX711(dout_pin=16, pd_sck_pin=6)

# Set the reference unit (calibrated scale ratio)
start_raw = 291628
raw_to_gram = 99
#reference_unit = -3037.75 
#hx.set_scale_ratio(reference_unit)

print("Scale is ready! Continuously printing weight readings...")

try:
    while True:
        # Get weight in grams
        weight = hx.get_weight_mean(10)  # Average over 10 readings for stability
        weight = hx.get_raw_data_mean()
        print("weight is", weight)
        difference = abs(weight) - abs(start_raw)
        print("diff", difference)
        weight_grams = difference / 99
        print(f"Weight: {weight_grams:.2f} grams")
        time.sleep(1)  # Delay between readings
except KeyboardInterrupt:
    print("\nExiting...")
    GPIO.cleanup()  # Clean up GPIO resources
