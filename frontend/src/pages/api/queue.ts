interface CurrentOrder {
    ao_id: number;
    account_id: number;
    machine_id: number;
    ao_amount: number;
    ao_size: string;
    ao_status: string;
    ao_timestamp: string; // ISO 8601 format
    account_first_name: string;
    account_last_name: string;
  }

  

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function fetchQueue(machine_id: number): Promise<CurrentOrder[] | null> {
  const completeUrl = `${baseUrl}/api/account_order/machine/${machine_id}`;

  try {
    const response = await fetch(completeUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch orders for machine ID ${machine_id}`);
    }

    const orders: CurrentOrder[] = await response.json(); // Cast the response to the correct type
    return orders; // Return the orders
  } catch (error) {
    console.error('Error fetching orders:', error);
    return null; // Return null if there was an error
  }
}
