import ContainerLayout from "@/layout/ContainerLayout";
import Hero from "@/components/home/hero";
import About from "@/components/home/about";
import Projects from "@/components/home/projects";

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
