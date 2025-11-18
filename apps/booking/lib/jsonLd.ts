export const jsonLd = {
  generate: (type: string, data: any) => {
    return {
      '@context': 'https://schema.org',
      '@type': type,
      ...data
    };
  }
};