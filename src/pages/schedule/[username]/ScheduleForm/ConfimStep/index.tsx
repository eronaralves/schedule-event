import { useRouter } from "next/router";
import { CalendarBlank, Clock } from "phosphor-react";
import { Button, Text, TextArea, TextInput } from "@ignite-ui/react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import dayjs from "dayjs";
import { api } from "@/lib/axios";

// Styles
import { ConfirmForm, FormActions, FormError, FormHeader } from "./styles";

const confimformSchema = z.object({
  name: z.string().min(3, { message: "O nome precisa no minimo 3 caracteres" }),
  email: z.string().email({ message: "Digite um email válido" }),
  observations: z.string().nullable(),
});

type ConfirmFormData = z.infer<typeof confimformSchema>;

interface ConfirmStepProps {
  schedulingDate: Date;
  onCancelConfirmation: () => void;
}

export function ConfirmStep({
  schedulingDate,
  onCancelConfirmation,
}: ConfirmStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ConfirmFormData>({
    resolver: zodResolver(confimformSchema),
  });

  const router = useRouter();
  const username = router.query.username;

  const describedDate = dayjs(schedulingDate).format("DD[ de ]MMMM[ de ]YYYY");
  const describedTime = dayjs(schedulingDate).format("HH:mm[h]");

  async function handleConfirmSchuduling(data: ConfirmFormData) {
    const { email, name, observations } = data;

    await api.post(`/users/${username}/schedule`, {
      date: schedulingDate,
      email,
      name,
      observations,
    });

    onCancelConfirmation();
  }

  return (
    <ConfirmForm as="form" onSubmit={handleSubmit(handleConfirmSchuduling)}>
      <FormHeader>
        <Text>
          <CalendarBlank />
          {describedDate}
        </Text>
        <Text>
          <Clock />
          {describedTime}
        </Text>
      </FormHeader>

      <label>
        <Text size="sm">Nome completo</Text>
        {/* @ts-ignore */}
        <TextInput placeholder="Seu nome" {...register("name")} />
        {errors.name && <FormError size="sm">{errors.name.message}</FormError>}
      </label>

      <label>
        <Text size="sm">Endereço de e-mail</Text>
        {/* @ts-ignore */}
        <TextInput
          type="email"
          placeholder="jonh@example.com"
          {...register("email")}
        />
        {errors.email && (
          <FormError size="sm">{errors.email.message}</FormError>
        )}
      </label>

      <label>
        <Text size="sm">Observações</Text>
        <TextArea {...register("observations")} />
      </label>

      <FormActions>
        <Button type="button" onClick={onCancelConfirmation} variant="tertiary">
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Confirmar
        </Button>
      </FormActions>
    </ConfirmForm>
  );
}
