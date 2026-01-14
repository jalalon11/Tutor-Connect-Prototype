export function validateNameFormat(firstName: string, middleName: string, lastName: string): boolean {
  // Last Name First Name Middle format: validation
  const nameRegex = /^[a-zA-Z\s'-]{2,}$/
  return nameRegex.test(lastName) && nameRegex.test(firstName) && (!middleName || nameRegex.test(middleName))
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validatePassword(password: string): boolean {
  // Minimum 8 characters, 1 uppercase, 1 lowercase, 1 number
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)
}
