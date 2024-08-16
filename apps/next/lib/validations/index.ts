import { nowInSeconds } from 'lib';

/**
 * Validates an email address.
 * @param {string} email - The email address to validate.
 * @throws {Error} If the email is invalid or empty.
 */
export function validateEmail({ email }: { email: string }): void {
  if (!email || typeof email !== 'string') {
    throw new Error('Invalid email input');
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    throw new Error('Invalid email format');
  }
}

/**
 * Validates an ID.
 * @param {string} id - The ID to validate.
 * @throws {Error} If the ID is invalid or not 36 characters long.
 */
export function validateId({ id }: { id: string }): void {
  if (!id || typeof id !== 'string' || id.trim().length !== 36) {
    throw new Error('Invalid ID');
  }
}

/**
 * Validates a passcode.
 * @param {Object} params - The parameters for passcode validation.
 * @param {string} params.input - The input passcode to validate.
 * @param {string} params.stored - The stored passcode to compare against.
 * @param {number} params.createdAt - The timestamp when the passcode was created.
 * @throws {Error} If the passcode is invalid, expired, or doesn't match.
 */
export function validatePasscode({
  input,
  stored,
  createdAt
}: {
  input: string;
  stored: string;
  createdAt: number;
}): void {
  if (typeof input !== 'string' || input.length !== 6) {
    throw new Error('Invalid passcode');
  }

  if (input !== stored) {
    throw new Error('Passcode does not match');
  }

  const PASSCODE_EXPIRATION_TIME = 300; // 5 minutes in seconds
  if (nowInSeconds() - createdAt > PASSCODE_EXPIRATION_TIME) {
    throw new Error('Passcode has expired');
  }
}
