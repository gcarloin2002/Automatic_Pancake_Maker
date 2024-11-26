import requests
import time
import os
from sensors import getTemp, getWeight
from dotenv import load_dotenv
from concurrent.futures import ThreadPoolExecutor



def update_machine_data_repeatedly(base_url, machine_id, interval_seconds):
    """
    Repeatedly fetches the current machine data using a GET request,
    optionally updates it, and sends it back via a PUT request.

    Args:
        base_url (str): The base URL of the API.
        machine_id (int): The ID of the machine to update.
        interval_seconds (int): Interval in seconds between each update request.

    """
    url = f"{base_url}/api/machine/{machine_id}"

    while True:
        try:

            get_response = requests.get(url)
            
            if get_response.status_code == 200:
                current_machine_data = get_response.json() 


                # Retrieve temperature data
                current_machine_data["machine_temperature"] = getTemp()

                # Retrieve batter data
                current_machine_data["machine_batter"] = getWeight()



                headers = {'Content-Type': 'application/json'} 
                
                # Send the PUT request with the current (or modified) data
                put_response = requests.put(url, json=current_machine_data, headers=headers)
                
                if put_response.status_code == 200:
                    print(f"Machine data updated successfully for machine_id={machine_id}")
                else:
                    print(f"Failed to update machine data. Status code: {put_response.status_code}, Response: {put_response.text}")
            else:
                print(f"Failed to fetch machine data. Status code: {get_response.status_code}, Response: {get_response.text}")
        except Exception as e:
            print(f"Error occurred while processing machine data: {e}")

        time.sleep(interval_seconds) 
   



def process_orders_repeatedly(base_url, machine_id, interval_seconds):
    """
    Repeatedly fetch and process orders for a specific machine, ensuring "In Progress" orders are completed first.

    Args:
        base_url (str): The base URL of the API.
        machine_id (int): The ID of the machine to process orders for.
        interval_seconds (int): Interval in seconds between each fetch/process cycle.
    """
    orders_url = f"{base_url}/api/account_order/machine/{machine_id}"
    update_order_url_template = f"{base_url}/api/account_order/order/{{}}"

    while True:
        try:
            # Step 1: Fetch orders
            response = requests.get(orders_url)
            if response.status_code == 200:
                orders = response.json()
                
                # Process "In Progress" orders first
                in_progress_order = next((o for o in orders if o['ao_status'] == 'In Progress'), None)
                if in_progress_order:
                    ao_id = in_progress_order['ao_id']

                    # Simulate order processing
                    print(f"Processing 'In Progress' order {ao_id}...")
                    time.sleep(2)  # Simulate processing time

                    # Mark the order as "Complete"
                    complete_response = requests.put(
                        update_order_url_template.format(ao_id),
                        json={"ao_status": "Complete"},
                        headers={'Content-Type': 'application/json'}
                    )

                    if complete_response.status_code == 200:
                        print(f"'In Progress' order {ao_id} marked as 'Complete'.")
                    else:
                        print(f"Failed to mark 'In Progress' order {ao_id} as 'Complete'. "
                              f"Status code: {complete_response.status_code}, Response: {complete_response.text}")
                    continue  # After completing "In Progress" order, go to the next cycle

                # Find the oldest "Pending" order
                pending_order = next((o for o in orders if o['ao_status'] == 'Pending'), None)
                if pending_order:
                    ao_id = pending_order['ao_id']

                    # Update the order status to "In Progress"
                    update_response = requests.put(
                        update_order_url_template.format(ao_id),
                        json={"ao_status": "In Progress"},
                        headers={'Content-Type': 'application/json'}
                    )

                    if update_response.status_code == 200:
                        print(f"Order {ao_id} marked as 'In Progress'.")

                        # Simulate order processing
                        print(f"Processing order {ao_id}...")
                        time.sleep(10)  # Simulate processing time

                        # Update the order status to "Complete"
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


    interval_seconds = 5

    # Use ThreadPoolExecutor to run both functions in parallel
    with ThreadPoolExecutor() as executor:
        # Call the function to repeatedly update the machine with ID 1 every 5 seconds
        executor.submit(update_machine_data_repeatedly, backend_url, 1, interval_seconds)
        # Process orders repeatedly for the same machine
        executor.submit(process_orders_repeatedly, backend_url, 1, interval_seconds)