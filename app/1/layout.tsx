import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function OneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header leftImageSrc="/dove.png" rightImageSrc="/fairy.png" />
      {children}


    </>
  );
}

