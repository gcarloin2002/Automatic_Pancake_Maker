from smbus2 import SMBus
import time

# I2C address of the MLX90614
MLX90614_ADDRESS = 0x5A

# MLX90614 register addresses
AMBIENT_TEMP_REG = 0x06
OBJECT_TEMP_REG = 0x07

class MLX90614:
    def __init__(self, bus_number=1, address=MLX90614_ADDRESS):
        self.bus = SMBus(bus_number)
        self.address = address

    def read_temp(self, reg):
        try:
            data = self.bus.read_word_data(self.address, reg)
            # Swap byte order (as MLX90614 sends data in little-endian)
            temp = ((data & 0xFF) << 8) | (data >> 8)
            return temp 
        except Exception as e:
            print(f"Error reading temperature: {e}")
            return None

    def read_ambient_temp(self):
        return self.read_temp(AMBIENT_TEMP_REG)

    def read_object_temp(self):
        return self.read_temp(OBJECT_TEMP_REG)

    def close(self):
        self.bus.close()

# Example usage
if __name__ == "__main__":
    sensor = MLX90614()

    try:
        while True:
            ambient_temp = sensor.read_ambient_temp()
            object_temp = sensor.read_object_temp()

            if ambient_temp is not None and object_temp is not None:
                print(f"Ambient Temperature: {ambient_temp:.2f} °F")
                print(f"Object Temperature: {object_temp:.2f} °F")
            else:
                print("Failed to read temperatures.")

            time.sleep(1)  # Delay between readings
    except KeyboardInterrupt:
        print("Exiting program...")
    finally:
        sensor.close()
