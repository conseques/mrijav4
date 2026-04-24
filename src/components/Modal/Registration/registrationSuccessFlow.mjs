export const REGISTRATION_SUCCESS_OPEN_DELAY_MS = 320;

export function transitionRegistrationSuccess({
  form,
  closeRegistration,
  openSuccess,
  delayMs = REGISTRATION_SUCCESS_OPEN_DELAY_MS,
  schedule = globalThis.setTimeout.bind(globalThis),
} = {}) {
  form?.reset?.();
  closeRegistration?.();

  return schedule(() => {
    openSuccess?.();
  }, delayMs);
}
