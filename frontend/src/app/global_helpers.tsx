import crypto from 'crypto';


// Takes in password and salt (let salt value be the username)
export function hashPassword(password: string, salt: string): string {
  const hash = crypto.createHmac('sha256', salt).update(password).digest('hex');
  return hash;
}



export function formatDate(isoDateString: string): string {
  // Convert the ISO string to a Date object
  const dateObject: Date = new Date(isoDateString);

  // Check if the date is valid
  if (isNaN(dateObject.getTime())) {
      throw new Error("Invalid date string");
  }

  // Format the date in different ways
  const defaultString: string = dateObject.toString();
  const isoString: string = dateObject.toISOString();
  const localeString: string = dateObject.toLocaleString();
  const customFormattedDate: string = `${dateObject.getUTCFullYear()}-${String(dateObject.getUTCMonth() + 1).padStart(2, '0')}-${String(dateObject.getUTCDate()).padStart(2, '0')} ${String(dateObject.getUTCHours()).padStart(2, '0')}:${String(dateObject.getUTCMinutes()).padStart(2, '0')}:${String(dateObject.getUTCSeconds()).padStart(2, '0')}`;

  // Return the desired formatted output, or you can return an object with all formats
  return `Default: ${defaultString}\nISO: ${isoString}\nLocale: ${localeString}\nCustom: ${customFormattedDate}`;
}
