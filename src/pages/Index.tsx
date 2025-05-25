
import { useRef } from "react";
import Hero from "@/components/Hero";
import RegistrationForm from "@/components/RegistrationForm";

const Index = () => {
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <Hero onScrollToForm={scrollToForm} />
      <div ref={formRef}>
        <RegistrationForm />
      </div>
    </div>
  );
};

export default Index;
