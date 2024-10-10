
const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

// Function that checks if username exists
export async function checkLogin(hashedPassword: string, username: string): Promise<unknown> {
    const completeUrl = baseUrl + "/api/account/login";

    try {
        const response = await fetch(completeUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login: username, hashedPassword }),  // Here username could be email or username
        });

        if (!response.ok) {
            return false;
        }

        return true

    } catch (error) {
        console.error('Error fetching data:', error);
        return false
    }
}