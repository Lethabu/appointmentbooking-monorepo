// Instagram service stub
export const syncInstagramPosts = () => Promise.resolve({ success: true, posts: [] });
export const createInstagramPost = (content: string) => Promise.resolve({ id: 'ig_post_123' });
export const getInstagramMetrics = () => Promise.resolve({ followers: 0, engagement: 0 });
export const fetchInstagramMedia = () => Promise.resolve({ media: [], count: 0 });