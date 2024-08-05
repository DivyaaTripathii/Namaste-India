export const createAccount = async (email, password) => {
  try {
    const response = await fetch('/create-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Error:', error);
  }
};


