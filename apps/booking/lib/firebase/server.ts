// Firebase server stub
export const adminAuth = {
  verifyIdToken: (token: string) => Promise.resolve({ uid: 'test', token })
};

export const adminDb = {
  collection: () => ({
    doc: () => ({
      get: () => Promise.resolve({ exists: false })
    })
  })
};

export const firebaseAdmin = {
  auth: () => adminAuth,
  firestore: () => adminDb
};