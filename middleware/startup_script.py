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

def process_orders_repeatedly(base_url, machine_id, interval_seconds):
    """
    Repeatedly fetch and process orders for a specific machine.

    Args:
        base_url (str): The base URL of the API.
        machine_id (int): The ID of the machine to process orders for.
        interval_seconds (int): Interval in seconds between each fetch/process cycle.
    """
    orders_url = f"{base_url}/machine/{machine_id}"
    update_order_url_template = f"{base_url}/order/{{}}"

    while True:
        try:
            # Step 1: Fetch orders with status "In Progress" or "Pending"
            response = requests.get(orders_url)
            if response.status_code == 200:
                orders = response.json()
                # Find the oldest "Pending" order
                pending_order = next((o for o in orders if o['ao_status'] == 'Pending'), None)

                if pending_order:
                    ao_id = pending_order['ao_id']

                    # Step 2: Update the order status to "In Progress"
                    update_response = requests.put(
                        update_order_url_template.format(ao_id),
                        json={"ao_status": "In Progress"},
                        headers={'Content-Type': 'application/json'}
                    )

                    if update_response.status_code == 200:
                        print(f"Order {ao_id} marked as 'In Progress'.")

                        # Step 3: Simulate order processing
                        print(f"Processing order {ao_id}...")
                        time.sleep(2)  # Simulate processing time

                        # Step 4: Update the order status to "Complete"
                        complete_response = requests.put(
                            update_order_url_template.format(ao_id),
                            json={"ao_status": "Complete"},
                            headers={'Content-Type': 'application/json'}
                        )

                        if complete_response.status_code == 200:
                            print(f"Order {ao_id} marked as 'Complete'.")
                        else:
                            print(f"Failed to mark order {ao_id} as 'Complete'. "
                                  f"Status code: {complete_response.status_code}, Response: {complete_response.text}")
                    else:
                        print(f"Failed to mark order {ao_id} as 'In Progress'. "
                              f"Status code: {update_response.status_code}, Response: {update_response.text}")
                else:
                    print("No pending orders to process.")
            else:
                print(f"Failed to fetch orders. Status code: {response.status_code}, Response: {response.text}")

        except Exception as e:
            print(f"Error occurred while processing orders: {e}")

        time.sleep(interval_seconds)  # Wait for the specified interval before the next cycle



if __name__ == "__main__":

    load_dotenv()
    backend_url = os.getenv('BACKEND_URL')

    # Define the data to update
    data = {
        "machine_network": "TAMU_WIFI",
        "machine_name": "APM V1",
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
    process_orders_repeatedly(backend_url, 1, interval_seconds)

