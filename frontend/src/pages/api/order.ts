// Define the interface for the response data if needed (adjust based on your expected structure)
interface PrevOrderData {
    ao_id: number;
    ao_amount: number;
    ao_size: number;
    ao_timestamp: string;
    ao_status: string;
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  
  export async function fetchPrevOrders(accountId: number): Promise<PrevOrderData[] | null> {
    const completeUrl = `${baseUrl}/api/account_order/${accountId}`;
  
    try {
      const response = await fetch(completeUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
  
      const data: PrevOrderData[] = await response.json(); // Assuming the API returns an array of orders
      return data;
    } catch (error) {
      console.error('Error fetching previous orders:', error);
      return null; // Return null or handle the error based on your use case
    }
  };
  

  export async function createNewOrder(orderData: {
    account_id: number;
    machine_id: number;
    ao_amount: number;
    ao_size: number;
  }): Promise<never | null> { // Adjust the return type as needed

    const completeUrl = `${baseUrl}/api/account_order`;

    try {
      const response = await fetch(completeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const newOrder = await response.json(); // Assuming the API returns the created order
      return newOrder;

    } catch (error) {
      console.error('Error creating order:', error);
      return null; // Return null or handle the error based on your use case
    }
  }