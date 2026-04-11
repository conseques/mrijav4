import { collection, getDocs } from 'firebase/firestore';
import { deleteObject, listAll, ref } from 'firebase/storage';

const MANAGED_STORAGE_FOLDERS = ['events', 'past_events', 'courses', 'teachers'];

const decodeStoragePath = (value) => {
  if (!value) {
    return '';
  }

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

export const getStoragePathFromUrl = (fileUrl) => {
  if (!fileUrl || typeof fileUrl !== 'string') {
    return '';
  }

  if (fileUrl.startsWith('gs://')) {
    return decodeStoragePath(fileUrl.replace(/^gs:\/\/[^/]+\//, ''));
  }

  try {
    const parsedUrl = new URL(fileUrl);
    const namedPath = parsedUrl.searchParams.get('name');

    if (namedPath) {
      return decodeStoragePath(namedPath);
    }

    const storagePathIndex = parsedUrl.pathname.indexOf('/o/');
    if (storagePathIndex !== -1) {
      return decodeStoragePath(parsedUrl.pathname.slice(storagePathIndex + 3));
    }
  } catch {
    return '';
  }

  return '';
};

const addReferencedPath = (referencedPaths, fileUrl) => {
  const storagePath = getStoragePathFromUrl(fileUrl);

  if (storagePath) {
    referencedPaths.add(storagePath);
  }
};

const listFilesRecursive = async (folderRef) => {
  const result = await listAll(folderRef);
  const nestedFiles = await Promise.all(result.prefixes.map(listFilesRecursive));

  return [...result.items, ...nestedFiles.flat()];
};

export const scanManagedStorage = async (db, storage) => {
  const [eventsSnapshot, pastEventsSnapshot, coursesSnapshot] = await Promise.all([
    getDocs(collection(db, 'events')),
    getDocs(collection(db, 'past_events')),
    getDocs(collection(db, 'courses'))
  ]);

  const referencedPaths = new Set();

  eventsSnapshot.forEach((docSnapshot) => {
    addReferencedPath(referencedPaths, docSnapshot.data().imageUrl);
  });

  pastEventsSnapshot.forEach((docSnapshot) => {
    addReferencedPath(referencedPaths, docSnapshot.data().imageUrl);
  });

  coursesSnapshot.forEach((docSnapshot) => {
    const data = docSnapshot.data();
    addReferencedPath(referencedPaths, data.imageUrl);
    addReferencedPath(referencedPaths, data.teacherPhotoUrl);
  });

  const folderFiles = await Promise.all(
    MANAGED_STORAGE_FOLDERS.map(async (folder) => {
      const files = await listFilesRecursive(ref(storage, folder));

      return files.map((itemRef) => ({
        folder,
        fullPath: itemRef.fullPath,
        name: itemRef.name
      }));
    })
  );

  const allFiles = folderFiles.flat();
  const orphanedFiles = allFiles.filter((file) => !referencedPaths.has(file.fullPath));

  const folderSummaries = MANAGED_STORAGE_FOLDERS.map((folder) => {
    const filesInFolder = allFiles.filter((file) => file.folder === folder);
    const orphanedInFolder = orphanedFiles.filter((file) => file.folder === folder);

    return {
      folder,
      totalFiles: filesInFolder.length,
      orphanedFiles: orphanedInFolder.length
    };
  });

  return {
    referencedFiles: referencedPaths.size,
    totalFiles: allFiles.length,
    orphanedFiles,
    folderSummaries
  };
};

export const deleteManagedStorageFiles = async (storage, filePaths) => {
  let deletedCount = 0;
  const failedPaths = [];

  for (const filePath of filePaths) {
    try {
      await deleteObject(ref(storage, filePath));
      deletedCount += 1;
    } catch (error) {
      if (error?.code === 'storage/object-not-found') {
        continue;
      }

      failedPaths.push(filePath);
    }
  }

  return {
    deletedCount,
    failedPaths
  };
};
