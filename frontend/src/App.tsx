import "@kit/styles";
import "@kit/css-reset";

// javascript is supported
import "./App.css";

import {css} from "catom";

import {VNode, render, useEffect, useState} from "@hydrophobefireman/ui-lib";

import {Router} from "./_router";
import {client} from "./util/bridge";

function App(): VNode {
  const [ready, setReady] = useState(false);
  useEffect(async () => {
    try {
      await client.syncWithServer();
    } catch (e) {
      console.warn(e);
      client.logoutCurrent();
    }
    setReady(true);
  }, []);
  if (!ready) return <div>Loading...</div>;
  return (
    <main class={css({padding: "0.5rem"})}>
      <Router />
    </main>
  );
}

render(<App />, document.getElementById("app-mount"));
