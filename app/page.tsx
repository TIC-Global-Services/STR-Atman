import ContainerLayout from "@/layout/ContainerLayout";
import Hero from "@/components/Home/Hero";
import About from "@/components/Home/about";
import Projects from "@/components/Home/projects";

export default function Home() {
  return (
    <>
      <Hero />
      <ContainerLayout>
        <About />
        <Projects />
      </ContainerLayout>
    </>
  );
}
