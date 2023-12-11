import {css} from "catom";

import {client, useUser} from "@/util/bridge";
import {Button, TextButton} from "@hydrophobefireman/kit/button";
import {Box} from "@hydrophobefireman/kit/container";
import {useLocation} from "@hydrophobefireman/kit/hooks";
import {Input} from "@hydrophobefireman/kit/input";
import {A, loadURL, useState} from "@hydrophobefireman/ui-lib";
import {button} from "@kit/classnames";
import {HomeIcon} from "@kit/icons";

import {Form} from "../Form";

export function MainRoot({children}: {children?: any}) {
  const [name, setName] = useState("");
  const onsubmit = function () {
    loadURL(`/search?${new URLSearchParams({q: name})}`);
  };
  const {path} = useLocation();
  const [user] = useUser();
  return (
    <>
      <header class={css({padding: "0.5rem"})}>
        <A href="/">
          <HomeIcon />
        </A>
        <Form onSubmit={onsubmit}>
          <Box horizontal="center" vertical="center">
            <Input
              setValue={setName}
              value={name}
              variant="material"
              placeholder="search"
            ></Input>
            <TextButton mode="secondary" variant="shadow">
              Search
            </TextButton>
          </Box>
        </Form>
        <Box
          row
          horizontal="left"
          class={css({padding: ".5rem", gap: ".5rem"})}
        >
          {path !== "/post" && (
            <TextButton
              href="/post"
              class={css({width: "fit-content"})}
              mode="secondary"
              variant="shadow"
            >
              Post
            </TextButton>
          )}
          {user &&
            (path !== `/profile/${user.id_}` ? (
              <TextButton
                href={`/profile/${user.id_}`}
                class={css({width: "fit-content"})}
                mode="secondary"
                variant="shadow"
              >
                Profile
              </TextButton>
            ) : (
              <TextButton
                onClick={() => client.logoutCurrent()}
                class={css({width: "fit-content"})}
                mode="secondary"
                variant="shadow"
              >
                logout
              </TextButton>
            ))}
        </Box>
      </header>
      <main>{children}</main>
    </>
  );
}
