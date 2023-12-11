import {requests, routes} from "@/util/http";
import {useAlerts} from "@hydrophobefireman/kit/alerts";
import {TextButton} from "@hydrophobefireman/kit/button";
import {Modal, useModal} from "@kit/modal";
export function SubscribeButton({
  id,
  isSubscribed,
  onSubscribeComplete,
  name,
  user,
}: {
  id: string;
  isSubscribed: boolean;
  name: string;
  user: string;
  onSubscribeComplete(): void | Promise<void>;
}) {
  const {show} = useAlerts();
  const {active, setActive, toggle} = useModal(false);
  async function subscribeToUser(e: JSX.TargetedMouseEvent<HTMLButtonElement>) {
    const {dataset} = e.currentTarget;
    const {result} = requests.get(routes.subscribeRoute(id));
    const {data, error} = await result;
    if (error) {
      return show({type: "error", content: `Could not search: ${error}`});
    }
    await onSubscribeComplete();
    setActive(false);
  }
  function handleClick() {
    setActive(true);
  }
  return (
    <>
      <TextButton
        disabled={isSubscribed}
        data-id={id}
        onClick={handleClick}
        variant="shadow"
        mode="secondary"
      >
        {isSubscribed ? "Subscribed" : "Subscribe"}
      </TextButton>
      <Modal active={active} onClickOutside={toggle} onEscape={toggle}>
        <Modal.Body>
          <Modal.Title>
            Subscribe to {name} (@{user})?
          </Modal.Title>
          This action will cost $5/month. (Beta usage is free)
        </Modal.Body>
        <Modal.Actions>
          <Modal.Action onClick={() => setActive(false)}>Cancel</Modal.Action>
          <Modal.Action onClick={subscribeToUser}>Subscribe</Modal.Action>
        </Modal.Actions>
      </Modal>
    </>
  );
}
