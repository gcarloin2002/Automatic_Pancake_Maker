import requests
import time
import os
from dotenv import load_dotenv


def update_machine_data_repeatedly(base_url, machine_id, interval_seconds):
    """
    Repeatedly fetches the current machine data using a GET request,
    optionally updates it, and sends it back via a PUT request.

    Args:
        base_url (str): The base URL of the API.
        machine_id (int): The ID of the machine to update.
        interval_seconds (int): Interval in seconds between each update request.

    """
    get_url = f"{base_url}/api/machine/{machine_id}"
    put_url = f"{base_url}/api/machine/{machine_id}"

    while True:
        try:
            # Fetch current machine data using the GET request
            get_response = requests.get(get_url)
            
            if get_response.status_code == 200:
                current_machine_data = get_response.json()  # Parse JSON response

                headers = {'Content-Type': 'application/json'}  # Explicitly set headers
                
                # Send the PUT request with the current (or modified) data
                put_response = requests.put(put_url, json=current_machine_data, headers=headers)
                
                if put_response.status_code == 200:
                    print(f"Machine data updated successfully for machine_id={machine_id}")
                else:
                    print(f"Failed to update machine data. Status code: {put_response.status_code}, Response: {put_response.text}")
            else:
                print(f"Failed to fetch machine data. Status code: {get_response.status_code}, Response: {get_response.text}")
        except Exception as e:
            print(f"Error occurred while processing machine data: {e}")

        time.sleep(interval_seconds)  # Wait for the specified interval before the next call

if __name__ == "__main__":

    load_dotenv()
    backend_url = os.getenv('BACKEND_URL')

    interval_seconds = 5

    # Call the function to repeatedly update the machine with ID 1 every 2 seconds
    update_machine_data_repeatedly(backend_url, 1, interval_seconds)
