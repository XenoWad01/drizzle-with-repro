import { FC, useEffect } from "react";
import { useAuthStore } from "../../services/stores/authStore";
import { trpc } from "../../services/trpc";
import toast from "react-hot-toast";
import { config } from "../../config";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type LoginForm = {
  phone: string;
  password: string;
};

const LoginFormValidationSchema = z.object({
  phone: z.string(),
  password: z.string(),
});

export const Login: FC = () => {
  const setLogin = useAuthStore((s) => s.setLogin);

  const { mutateAsync: mutateLogin } = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      setLogin(true);

      localStorage.setItem("accessToken", data.accessToken);
      // TODO do frontend config
      if (config.env === "local") {
        localStorage.setItem("refreshToken", data.refreshToken!);
      }
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  const { handleSubmit, register, watch } = useForm<LoginForm>({
    defaultValues: {
      phone: undefined,
      password: undefined,
    },
    resolver: zodResolver(LoginFormValidationSchema),
    reValidateMode: "onChange",
    mode: "onChange",
  });

  // This can be async if needed in this case I dont need the response so I dont really need it
  const onSubmit: SubmitHandler<LoginForm> = (data) => {
    mutateLogin({
      phoneNumber: data.phone,
      password: data.password,
    });
  };

  // example so you know you can just put watch('thing') as dependency to useEffect and it just works ...
  useEffect(() => {
    console.log("phone changed");
  }, [watch("phone")]);

  // We may also need to spread the register('thing') in a different way.
  // there is an example for hookform and 3rd party ui libraries that we can use for that when
  // frontend development starts on the actual app.
  return (
    <>
      Login
      <form onSubmit={handleSubmit(onSubmit)}>
        <p>Phone number:</p>
        <input type="tel" {...register("phone")} />

        <p>Password:</p>
        <input type="password" {...register("password")} />

        <p></p>

        <button type="submit">Log in</button>
      </form>
    </>
  );
};
