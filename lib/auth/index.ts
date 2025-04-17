export * from './options';
export * from './register';

// Auth durumunu kontrol için yardımcı fonksiyonlar
export const isAuthenticated = (status: string) => status === 'authenticated';
export const isLoading = (status: string) => status === 'loading';
export const isUnauthenticated = (status: string) => status === 'unauthenticated'; 