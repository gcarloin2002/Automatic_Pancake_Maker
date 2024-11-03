import { NextApiRequest, NextApiResponse } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

interface FormData {
  account_first_name: string;
  account_last_name: string;
  account_email: string;
  account_username: string;
  account_password: string;
  role?: string;  // Optional role field
}

// Function to check if username exists by calling the backend API
async function checkUsernameExists(username: string): Promise<boolean> {
  const completeUrl = baseUrl + "/api/account/username/" + username;

  try {
    const response = await fetch(completeUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    return response.ok;  // True if username exists
  } catch (error) {
    console.error('Error checking username:', error);
    return false;
  }
}

// Function to check if email exists by calling the backend API
async function checkEmailExists(email: string): Promise<boolean> {
  const completeUrl = baseUrl + "/api/account/email/" + email;

  try {
    const response = await fetch(completeUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    return response.ok;  // True if email exists
  } catch (error) {
    console.error('Error checking email:', error);
    return false;
  }
}

// Function to create a new account by calling the backend API
async function createNewAccount(formData: FormData): Promise<boolean> {
  const { account_first_name, account_last_name, account_email, account_username, account_password, role = 'admin' } = formData;
  const completeUrl = baseUrl + "/api/account";

  try {
    const response = await fetch(completeUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        account_first_name,
        account_last_name,
        account_email,
        account_username,
        account_password,
        role,  // Assign role during account creation
      }),
    });

    return response.ok;  // True if account creation was successful
  } catch (error) {
    console.error('Error creating account:', error);
    return false;
  }
}

// API handler for registration
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { account_first_name, account_last_name, account_email, account_username, account_password }: FormData = req.body;

    // Check if username or email already exists
    const usernameExists = await checkUsernameExists(account_username);
    const emailExists = await checkEmailExists(account_email);

    if (usernameExists) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    if (emailExists) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Create the new account if both username and email are available
    const accountCreated = await createNewAccount({
      account_first_name,
      account_last_name,
      account_email,
      account_username,
      account_password,
      role: 'user',  // Default role for new users
    });

    if (accountCreated) {
      return res.status(201).json({ message: 'Account created successfully' });
    } else {
      return res.status(500).json({ message: 'Failed to create the account' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
