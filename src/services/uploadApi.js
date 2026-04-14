/**
 * Upload an image file to the backend.
 * Returns the public URL of the uploaded file.
 *
 * @param {string} token  - Backend JWT (admin)
 * @param {File}   file   - The File object from <input type="file">
 * @param {(progress: number) => void} [onProgress] - Optional 0-100 progress callback
 * @returns {Promise<string>}  The public URL of the uploaded image
 */
export async function uploadImage(token, file, onProgress) {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);

    xhr.open('POST', `${BASE_URL}/api/upload`);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      });
    }

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && data.url) {
          resolve(data.url);
        } else {
          reject(new Error(data.error || `Upload failed (${xhr.status})`));
        }
      } catch {
        reject(new Error('Invalid response from upload endpoint.'));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload.'));
    xhr.ontimeout = () => reject(new Error('Upload timed out.'));
    xhr.timeout = 30_000;

    xhr.send(formData);
  });
}
