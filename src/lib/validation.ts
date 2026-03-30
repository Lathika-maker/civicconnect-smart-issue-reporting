
export const validateAuthorityId = (id: string): boolean => {
  return /^CIVIC_ADMIN_\d{4}$/.test(id);
};

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePassword = (password: string): boolean => {
  // 8 chars, 1 number, 1 special char
  return /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/.test(password);
};
