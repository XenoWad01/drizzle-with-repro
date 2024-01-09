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


function makeRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export const Login: FC = () => {
  const setLogin = useAuthStore((s) => s.setLogin);
  const { mutateAsync: createAditionalServiceAsync } = trpc.aditionalService.create.useMutation()
  const { mutateAsync: createBooking } = trpc.booking.create.useMutation()
  const { mutateAsync: createClient } = trpc.client.create.useMutation()
  useEffect(() => {
    (async ()  => {

      const newClient = await createClient({
        userData: {
          name: 'Admin User' + makeRandomString(10),
          phone: '666' + makeRandomString(10),
          password: 'password' + makeRandomString(10),
          email: 'whatever@wh' + makeRandomString(10) + 'atever.com' 
        },
      })


      const newAditionalService1 = await createAditionalServiceAsync({
        name: 'aditionalService1' + makeRandomString(10),
        price: 100,
        tasks: [
          {
            name: 'task1' + makeRandomString(10),
            isExternal: false,
          },
          {
            name: 'task2' + makeRandomString(10),
            isExternal: false,
          },
        ]
      })
      const newAditionalService2 = await createAditionalServiceAsync({
        name: 'aditionalService2' + makeRandomString(10),
        price: 100,
        tasks: [
          {
            name: 'task3' + makeRandomString(10),
            isExternal: false,
          },
          {
            name: 'task4' + makeRandomString(10),
            isExternal: false,
          },
        ]
      })

      const newBooking = await createBooking({
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        upfrontPaymentDueAt: new Date().toISOString(),
        upfrontPaymentPrice: 100,
        clientId: newClient.id,
        aditionalServices: [newAditionalService1!.id, newAditionalService2!.id]
      })



    })()
  }, [])




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
