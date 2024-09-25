// app/layout.tsx
import './globals.css'; // Optional, for global styles

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Header, footer, or other global elements can go here */}
        {children}  {/* This renders the page content */}
      </body>
    </html>
  );
}
