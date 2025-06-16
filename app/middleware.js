import { withClerkMiddleware, getAuth } from '@clerk/nextjs/server';

// Menyaring request berdasarkan role
export default withClerkMiddleware(async (req) => {
  const { userId } = getAuth(req); // Mengambil userId
  if (userId) {
    // Ambil role pengguna
    const user = await clerkClient.users.getUser(userId);
    const role = user.role;  // Ambil role pengguna dari Clerk
    req.role = role; // Menyimpan role ke request
  }
  return req;
});

export const config = {
  matcher: ['/kantin/**', '/api/**'], // Tentukan halaman mana yang ingin diterapkan middleware
};
