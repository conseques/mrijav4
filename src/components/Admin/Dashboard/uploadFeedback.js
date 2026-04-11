import { deleteObject, ref } from 'firebase/storage';

export const MAX_IMAGE_SIZE_MB = 4;
export const UPLOAD_TIMEOUT_MESSAGE = 'Upload timeout. Check Firebase Storage CORS policy.';

const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

export const validateImageFile = (selectedFile) => {
  if (!selectedFile) {
    return '';
  }

  if (!selectedFile.type?.startsWith('image/')) {
    return 'Please choose a valid image file.';
  }

  if (selectedFile.size > MAX_IMAGE_SIZE_BYTES) {
    return `Please choose an image smaller than ${MAX_IMAGE_SIZE_MB} MB.`;
  }

  return '';
};

export const getAdminSaveErrorMessage = (error, itemLabel) => {
  switch (error?.code) {
    case 'storage/quota-exceeded':
      return 'Firebase Storage quota for this site is exceeded. Uploads are blocked until storage is cleaned up or the quota is increased.';
    case 'storage/unauthorized':
    case 'permission-denied':
      return 'You do not have permission to save this item. Check Firebase rules or your admin account.';
    case 'storage/canceled':
      return 'The image upload was canceled before it finished.';
    case 'storage/retry-limit-exceeded':
      return 'The upload took too long and Firebase stopped retrying. Please try again.';
    case 'storage/invalid-checksum':
      return 'The upload did not finish correctly. Please try the image again.';
    case 'unavailable':
      return 'Firebase is temporarily unavailable. Please try again in a moment.';
    default:
      if (error?.message === UPLOAD_TIMEOUT_MESSAGE) {
        return 'The upload timed out before Firebase responded. Check the network connection or Firebase Storage setup.';
      }

      return `Unable to save ${itemLabel} right now. Please try again.`;
  }
};

export const removeStoredImage = async (storage, imageUrl) => {
  if (!imageUrl) {
    return;
  }

  try {
    await deleteObject(ref(storage, imageUrl));
  } catch (error) {
    if (error?.code === 'storage/object-not-found') {
      return;
    }

    throw error;
  }
};
