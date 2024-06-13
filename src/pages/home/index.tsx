import Image from "next/image";
import { NextSeo } from "next-seo";
import { Heading, Text } from "@ignite-ui/react";

// Images
import PreviewAppImage from "@/assets/images/app-preview.png";

// Components
import { ClaimUserNameForm } from "./components/ClaimUserNameForm";

// Styles
import { Container, Hero, Preview } from "./styles";

export default function Home() {
  return (
    <>
      <NextSeo
        title="Descomplique sua agenda | Calendar"
        description="Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre."
      />
      <Container>
        <Hero>
          <Heading size="4xl">Agendamento descomplicado</Heading>
          <Text size="xl">
            Conecte seu calendário e permita que as pessoas marquem agendamentos
            no seu tempo livre.
          </Text>
          <ClaimUserNameForm />
        </Hero>
        <Preview>
          <Image
            src={PreviewAppImage}
            height={400}
            quality={100}
            priority
            alt="Calendário simbolizando aplicação funcionando"
          />
        </Preview>
      </Container>
    </>
  );
}
