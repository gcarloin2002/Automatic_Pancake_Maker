import time
import RPi.GPIO as GPIO                # import GPIO
from hx711 import HX711                # import the class HX711

# Set GPIO pin mode to BCM numbering
GPIO.setmode(GPIO.BCM)

# Initialize HX711 with pins
hx = HX711(dout_pin=16, pd_sck_pin=6)

# Function to calibrate the HX711
def calibrate():
    print("Calibrating the scale...")
    input("Remove all weight and press Enter.")
    hx.zero()  # Zero the scale
    zero_reding = hx.get_raw_data_mean()

    print(f"After zero reading: {zero_reding}")

    
    print("Place a known weight on the scale.")
    known_weight = float(input("Enter the weight in grams: "))
    
    print("Calculating the reference unit. Please wait...")
    raw_reading = hx.get_raw_data_mean()
    print(f"Raw reading: {raw_reading}")
    
    # Calculate the reference unit
    reference_unit = raw_reading / known_weight
    print(f"Reference unit calculated: {reference_unit}")
    
    hx.set_scale_ratio(reference_unit)  # Set the scale ratio
    return reference_unit

# Main function to read weight
def read_weight():
    while True:
        try:
            # Get weight in grams
            weight = hx.get_weight_mean(10)  # Average over 10 readings for stability
            print(f"Weight: {weight:.2f} grams")
            time.sleep(1)  # Delay between readings
        except KeyboardInterrupt:
            print("\nExiting...")
            GPIO.cleanup()
            break

# Calibration process
reference_unit = calibrate()
hx.set_scale_ratio(reference_unit)

# Start reading weight
print("Scale is ready!")
read_weight()
