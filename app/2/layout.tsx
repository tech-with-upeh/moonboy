import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TwoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header leftImageSrc="/cat.png" rightImageSrc="/fairy.png" />
      {children}


    </>
  );
}

