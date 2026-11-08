import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ThreeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header leftImageSrc="/dove.png" rightImageSrc="/littlegirl.png" />
      {children}


    </>
  );
}

