import requests
import time
import os
from dotenv import load_dotenv


def update_machine_data_repeatedly(base_url, machine_id, data, interval_seconds):
    """
    Repeatedly sends a PUT request to update machine data with a specified interval.

    Args:
        base_url (str): The base URL of the API.
        machine_id (int): The ID of the machine to update.
        data (dict): The data to update for the machine.
        interval_seconds (int): Interval in seconds between each update request.

    """
    url = f"{base_url}/api/machine/{machine_id}"
    
    while True:
        try:
            headers = {'Content-Type': 'application/json'}  # Explicitly set headers
            response = requests.put(url, json=data, headers=headers)  # Include headers

            if response.status_code == 200:
                print(f"Machine data updated successfully for machine_id={machine_id}")
            else:
                print(f"Failed to update machine data. Status code: {response.status_code}, Response: {response.text}")

        except Exception as e:
            print(f"Error occurred while updating machine data: {e}")

        time.sleep(interval_seconds)  # Wait for the specified interval before the next call


if __name__ == "__main__":

    load_dotenv()
    backend_url = os.getenv('BACKEND_URL')

    # Define the data to update
    data = {
        "machine_network": "TAMU_WIFI",
        "machine_name": "APM V2",
        "machine_street": "500 Bizzell St",
        "machine_city": "College Station",
        "machine_state": "TX",
        "machine_zip_code": "77840",
        "machine_temperature": 1.23,
        "machine_batter": 5.67,
        "machine_mode": "Work"
    }

    interval_seconds = 5

    # Call the function to repeatedly update the machine with ID 1 every 2 seconds
    update_machine_data_repeatedly(backend_url, 1, data, interval_seconds)
