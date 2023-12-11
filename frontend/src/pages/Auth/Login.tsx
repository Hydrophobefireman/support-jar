import {css} from "catom";

import {Form} from "@/components/Form";
import {client, requests} from "@/util/bridge";
import {routes} from "@/util/http";
import {A, redirect, useState} from "@hydrophobefireman/ui-lib";
import {useAlerts} from "@kit/alerts";
import {TextButton} from "@kit/button";
import {Box} from "@kit/container";
import {Input} from "@kit/input";
import {Text} from "@kit/text";

export default function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const {show} = useAlerts();
  async function handleSubmit(e: JSX.TargetedEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = {user, password: pass};
    const {result} = client.login(user, pass);
    const resp = await result;
    console.log(resp);
    if ((resp as any).user_data) {
      redirect("/app");
    } else if (resp.error) {
      show({
        content: `Could not log in due to the following error: ${resp.error}`,
        type: "error",
      });
    }
  }
  return (
    <Box>
      <Text.p>Login to SupportJar</Text.p>
      <Form onSubmit={handleSubmit}>
        <Box>
          <Input
            value={user}
            setValue={setUser}
            name="username"
            label="username"
            variant="material"
          />
          <Input
            value={pass}
            setValue={setPass}
            name="password"
            label="password"
            type="password"
            variant="material"
          />
        </Box>
        <div
          class={css({
            alignItems: "center",
            justifyContent: "space-between",
            display: "flex",
          })}
        >
          <TextButton>Submit</TextButton>
          <A href="/register">Register</A>
        </div>
      </Form>
    </Box>
  );
}
