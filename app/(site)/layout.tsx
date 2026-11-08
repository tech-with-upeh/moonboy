import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header leftImageSrc="/cat.png" rightImageSrc="/littlegirl.png" />
      {children}


    </>
  );
}
