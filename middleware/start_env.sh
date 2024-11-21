#!/bin/bash

# Path to the virtual environment
VENV_PATH="~/Documents/Automatic_Pancake_Maker/middleware/servo_env"

# Activate the virtual environment
echo "Activating virtual environment: $VENV_PATH"
source "$VENV_PATH/bin/activate"

# Start the pigpiod daemon
echo "Starting pigpiod daemon..."
sudo pigpiod

# Confirm pigpiod is running
if pgrep -x "pigpiod" > /dev/null; then
    echo "pigpiod daemon started successfully."
else
    echo "Failed to start pigpiod daemon."
fi

# Keep the virtual environment active (optional)
echo "Virtual environment is active. Type 'deactivate' to exit."
bash
