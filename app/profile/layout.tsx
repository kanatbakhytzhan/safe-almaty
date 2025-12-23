// Profile layout - authentication is handled client-side in the page component
// This avoids JWT decryption errors that can occur with server-side session checks
// when the session cookie is corrupted or NEXTAUTH_SECRET is missing/changed

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Let the client-side ProfilePage component handle authentication
  // This prevents JWT decryption errors from crashing the page
  return <>{children}</>;
}

