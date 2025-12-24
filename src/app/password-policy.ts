export interface PasswordPolicyStatus {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
  valid: boolean;
}

export function checkPassword(password: string): PasswordPolicyStatus {
  const status = {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
    valid: false,
  };

  status.valid =
    status.length &&
    status.uppercase &&
    status.lowercase &&
    status.number &&
    status.special;

  return status;
}