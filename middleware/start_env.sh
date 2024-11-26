#!/bin/bash

# Path to the virtual environment
VENV_PATH="/home/APM/Documents/Automatic_Pancake_Maker/middleware/servo_env"

# Path to the Python script
SCRIPT_PATH="/home/APM/Documents/Automatic_Pancake_Maker/middleware/startup_script.py"

# Activate the virtual environment
echo "Activating virtual environment: $VENV_PATH"
source "$VENV_PATH/bin/activate"

# Check if the virtual environment was successfully activated
if [[ "$VIRTUAL_ENV" == "$VENV_PATH" ]]; then
    echo "Virtual environment activated successfully."
else
    echo "Failed to activate the virtual environment."
    exit 1
fi

# Start the pigpiod daemon
echo "Starting pigpiod daemon..."
sudo pigpiod

# Confirm pigpiod is running
if pgrep -x "pigpiod" > /dev/null; then
    echo "pigpiod daemon started successfully."
else
    echo "Failed to start pigpiod daemon."
    exit 1
fi

# Run the Python script
echo "Running the startup script: $SCRIPT_PATH"
python "$SCRIPT_PATH"

# Check if the Python script executed successfully
if [[ $? -eq 0 ]]; then
    echo "Startup script executed successfully."
else
    echo "Failed to execute the startup script."
    exit 1
fi

# Keep the virtual environment active
echo "Virtual environment is active. Type 'deactivate' to exit or press Ctrl+D to terminate the session."
exec bash
