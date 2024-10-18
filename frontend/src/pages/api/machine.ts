

interface Machine {
    machine_id: number;
    machine_network: string;
    machine_name: string;
    machine_street: string;
    machine_city: string;
    machine_state: string;
    machine_zip_code: string;
    machine_timestamp: string;
    machine_temperature: number;
    machine_batter: boolean;
  }

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getMachineById(machine_id: number): Promise<Machine | null> {
    try {
      // API endpoint to fetch machine details by machine_id
      const response = await fetch(`${baseUrl}/api/machine/${machine_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Check if the response is successful
      if (response.ok) {
        // Parse the JSON response to get the machine data
        const machine: Machine = await response.json();
        return machine; // Return the machine object
      } else if (response.status === 404) {
        console.error('Machine not found');
        return null; // Machine not found
      } else {
        console.error('Failed to fetch machine data');
        return null;
      }
    } catch (error) {
      console.error('Error fetching machine data:', error);
      return null; // Return null in case of any error
    }
  }
  



export function calculateSecondsApart(timestampString: string): number {
    // Parse the input timestamp string into a Date object
    const timestampDate = new Date(timestampString);
    
    // Get the current date and time
    const currentDate = new Date();
    
    // Calculate the difference in milliseconds
    const differenceInMilliseconds = currentDate.getTime() - timestampDate.getTime();
    
    // Convert milliseconds to seconds
    const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
    
    return differenceInSeconds;
}
  

export function convertToDatabaseFormat(isoString: string) {
    // Create a Date object from the ISO string
    const date = new Date(isoString);
    
    // Get the local date parts
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0'); // Get milliseconds
    
    // Format the database string (YYYY-MM-DD HH:MM:SS.ssssss)
    // Combine milliseconds with a string for the required number of fractional seconds
    const fractionalSeconds = milliseconds + '000'; // Assuming you want 6 digits for precision
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${fractionalSeconds}`;
  }
  