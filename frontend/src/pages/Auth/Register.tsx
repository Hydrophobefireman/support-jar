import {css} from "catom";

import {Form} from "@/components/Form";
import {requests} from "@/util/bridge";
import {routes} from "@/util/http";
import {A, useState} from "@hydrophobefireman/ui-lib";
import {useAlerts} from "@kit/alerts";
import {TextButton} from "@kit/button";
import {Box} from "@kit/container";
import {Input} from "@kit/input";
import {Text} from "@kit/text";

export default function Login() {
  const [name, setName] = useState("");
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const {show} = useAlerts();
  async function handleSubmit(e: JSX.TargetedEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = {name, user, password: pass};
    const {result} = requests.postJSON(routes.registerRoute, data);
    const resp = await result;
    if (resp.data) {
      console.log(resp.data);
    } else if (resp.error) {
      show({
        content: `Could not log in due to the following error: ${resp.error}`,
        type: "error",
      });
    }
  }
  return (
    <Box>
      <Text.p>Create a SupportJar account!</Text.p>
      <Form onSubmit={handleSubmit} autocomplete="off">
        <Box>
          <Input
            value={name}
            setValue={setName}
            name="name"
            label="name"
            variant="material"
          />
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
          <A href="/login">Login</A>
        </div>
      </Form>
    </Box>
  );
}
