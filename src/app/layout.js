import "./globals.css";

export const metadata = {
  title: "당근마켓",
  description: "우리 동네 중고 직거래 마켓",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <meta name="theme-color" content="#2d2d2d" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-gray-900 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
