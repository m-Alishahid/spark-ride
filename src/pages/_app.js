import Navbar from "@/components/Navbar";
import "../globals.css";
import Footer from "@/components/Footer";

export default function MyApp({ Component, pageProps }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      {/* Page Content */}
      <main className="grow">
        <Component {...pageProps} />
      </main>
      {/* Footer (Always at Bottom) */}
      <Footer />
    </div>
  );
}
