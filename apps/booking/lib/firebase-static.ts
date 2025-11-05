// Firebase static data stub
export const getStaticServices = () => Promise.resolve([
  { id: '1', name: 'Haircut', price: 50, duration: 30 },
  { id: '2', name: 'Hair Color', price: 120, duration: 90 }
]);

export const getStaticProducts = () => Promise.resolve([
  { id: '1', name: 'Shampoo', price: 25 },
  { id: '2', name: 'Conditioner', price: 30 }
]);

export const getStaticFirestoreData = (collection: string) => Promise.resolve({
  services: [{ id: '1', name: 'Haircut', price: 50 }],
  products: [{ id: '1', name: 'Shampoo', price: 25 }]
});