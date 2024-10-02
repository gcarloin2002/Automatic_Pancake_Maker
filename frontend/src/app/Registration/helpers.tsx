

// Function that checks if username exists
export async function checkUsernameExists(baseUrl: string | undefined, username: string): Promise<unknown> {
    const completeUrl = baseUrl + "/api/account/username/" + username

    try {
        const response = await fetch(completeUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Parse JSON data

        if (username === data["account_username"]){
            return true;
        }

        else {
            return false;
        }


    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Rethrow the error after logging it
    }
}





// Function that checks if email exists
export async function checkEmailExists(baseUrl: string | undefined, email: string): Promise<unknown> {
    const completeUrl = baseUrl + "/api/account/email/" + email

    try {
        const response = await fetch(completeUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Parse JSON data

        if (email === data["account_email"]){
            return true;
        }

        else {
            return false;
        }


    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Rethrow the error after logging it
    }
}