// Firebase stub implementation
// Replace with actual Firebase configuration when needed

export const db = {
  // Mock Firestore methods
  collection: () => ({}),
  doc: () => ({}),
  getDocs: () => Promise.resolve({ docs: [] }),
  onSnapshot: () => () => {},
  addDoc: () => Promise.resolve({ id: 'mock_doc_id' }), // Added mock addDoc
};

export const collection = (db: any, path: string) => ({}); // Modified collection to accept db and path
export const query = () => ({});
export const where = () => ({});
export const orderBy = () => ({});
export const getDocs = () => Promise.resolve({ docs: [] });
export const onSnapshot = () => () => {};
export const addDoc = (collectionRef: any, data: any) => Promise.resolve({ id: 'mock_doc_id' }); // Exported mock addDoc

export const functions = {
  httpsCallable: (name: string) => () => Promise.resolve({ data: {} })
};