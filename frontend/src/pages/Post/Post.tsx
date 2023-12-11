import {css} from "catom";

import {AuthGuard} from "@/components/AuthGuard/AuthGuard";
import {Form} from "@/components/Form";
import {MainRoot} from "@/components/MainRoot/Root";
import {IPost} from "@/types";
import {requests, useUser} from "@/util/bridge";
import {routes} from "@/util/http";
import {useAlerts} from "@hydrophobefireman/kit/alerts";
import {TextButton} from "@hydrophobefireman/kit/button";
import {Box} from "@hydrophobefireman/kit/container";
import {Input} from "@hydrophobefireman/kit/input";
import {A, redirect, useState} from "@hydrophobefireman/ui-lib";

function Post() {
  const [user] = useUser();
  const {show} = useAlerts();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  async function handleSubmit(e: Event) {
    if (!title || !content) return;
    const {result} = requests.postJSON<IPost>(routes.createPostRoute, {
      title,
      content,
    });
    const {data, error} = await result;
    if (error) {
      show({type: "error", content: `Could not create post: ${error}`});
    }
    return redirect(`/posts/${data.id_}`);
  }
  return (
    <div>
      <Form onSubmit={handleSubmit} class={css({width: "100%"})}>
        <Box horizontal="center" class={css({marginTop: "1rem"})}>
          <h1 class={css({fontWeight: "bold", fontSize: "1.5rem"})}>
            Create a post
          </h1>

          <div class={css({maxWidth: "600px", width: "80%"})}>
            <div>
              Posting to{" "}
              <A class={css({color: "grey"})} href={`/profile/${user.id_}`}>
                @{user.user}
              </A>{" "}
              's Profile
            </div>
            <Input
              name="title"
              wrapperClass={css({width: "100%"})}
              class={css({width: "100%"})}
              label="title"
              value={title}
              setValue={setTitle}
            ></Input>
          </div>
          <textarea
            value={content}
            onInput={(e) => setContent(e.currentTarget.value)}
            name="content"
            class={css({
              border: "2px solid #e3e3e3",
              width: "80%",
              maxWidth: "600px",
              height: "500px",
              outline: "none",
              padding: ".5rem",
              borderRadius: "12px",
              resize: "none",
            })}
            placeholder="content"
            label="content"
          ></textarea>
          <TextButton
            disabled={!title || !content}
            variant="shadow"
            mode="secondary"
            type="submit"
            class={css({marginTop: ".5rem"})}
          >
            Post!
          </TextButton>
        </Box>
      </Form>
    </div>
  );
}

export default function () {
  return (
    <AuthGuard>
      <MainRoot>
        <Post />
      </MainRoot>
    </AuthGuard>
  );
}
