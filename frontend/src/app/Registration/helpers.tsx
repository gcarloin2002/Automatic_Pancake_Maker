
interface FormData {
    account_first_name: string;
    account_last_name: string;
    account_email: string;
    account_username: string;
    account_password: string;
  }

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

// Function that checks if username exists
export async function checkUsernameExists(username: string): Promise<unknown> {
    const completeUrl = baseUrl + "/api/account/username/" + username

    try {
        const response = await fetch(completeUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
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





// Function that checks if email exists
export async function checkEmailExists(email: string): Promise<unknown> {
    const completeUrl = baseUrl + "/api/account/email/" + email

    try {
        const response = await fetch(completeUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
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




export async function createNewAccount(formData: FormData): Promise<unknown> {
    const { account_username, account_password, account_first_name, account_last_name, account_email } = formData;
    const completeUrl = baseUrl + "/api/account"

    try {
      const response = await fetch(completeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account_username,
          account_password,
          account_first_name,
          account_last_name,
          account_email,
        }),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log('Account created successfully:', result);
        return result;
      } else {
        console.error('Failed to create account:', await response.text());
        return null;
      }
    } catch (err) {
      console.error('Error occurred while creating the account:', err);
      return null;
    }
  }







