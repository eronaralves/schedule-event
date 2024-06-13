import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Button, Text, TextInput } from "@ignite-ui/react";

// Styles
import { Form, FormAnnotation } from "./styles";
import { ArrowRight } from "phosphor-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const claimUsernameFormSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "O usúario precisa ter pelo menos 3 letras.",
    })
    .regex(/^([a-z\\-]+)$/i, {
      message: "O usúario pode ter apenas letras e hifens",
    })
    .transform((value) => value.toLowerCase()),
});

type ClaimUsernameFormData = z.infer<typeof claimUsernameFormSchema>;

export function ClaimUserNameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClaimUsernameFormData>({
    resolver: zodResolver(claimUsernameFormSchema),
  });

  const router = useRouter();

  async function handleClaimRegister(data: ClaimUsernameFormData) {
    const { username } = data;

    await router.push(`/register?username=${username}`);
  }

  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handleClaimRegister)}>
        <TextInput
          size="sm"
          placeholder="seu-usuario"
          prefix="ignite.com/"
          {...register("username")}
        />
        <Button size="sm" type="submit">
          Resevar
          <ArrowRight />
        </Button>
      </Form>
      <FormAnnotation>
        <Text size="sm">
          {errors.username
            ? errors.username?.message
            : "Digite o nome do usúario desejado."}
        </Text>
      </FormAnnotation>
    </>
  );
}
