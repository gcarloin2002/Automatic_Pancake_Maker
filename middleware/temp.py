import board
import busio as io
import adafruit_mlx90614

from time import sleep
while True:

    i2c = io.I2C(board.SCL, board.SDA, frequency=100000)
    mlx = adafruit_mlx90614.MLX90614(i2c)

    ambientTemp = "{:.2f}".format(mlx.ambient_temperature*(9.0/5.0)+32)
    targetTemp = "{:.2f}".format(mlx.object_temperature*(9.0/5.0)+32)

    sleep(1)

    print("Ambient Temperature:", ambientTemp, "°F")
    print("Target Temperature:", targetTemp,"°F")
    sleep(2)
  