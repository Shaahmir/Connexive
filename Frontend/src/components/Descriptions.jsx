import Description from "../components/Description";

import MessageSolidFill from "../assets/svg/landing-svgs/message-solid-filled.svg";
import TimerSolidFill from "../assets/svg/landing-svgs/timer-solid-filled.svg";
import TrackSolidFill from "../assets/svg/landing-svgs/track-solid-filled.svg";
import UiSolidFill from "../assets/svg/landing-svgs/ui-solid-filled.svg";

export default function Descriptions() {

  return (

    <>

      <Description
        svg={MessageSolidFill}
        head={"Real-Time Chatting"}
        para1={"Instant messaging with"}
        para2={"real-time communication"}
      />

      <Description
        svg={TimerSolidFill}
        head={"Waiting Lobby"}
        para1={"Enjoy the lobby game"}
        para2={"While waiting for others"}
      />

      <Description
        svg={TrackSolidFill}
        head={"Activity"}
        para1={"Keep a complete Track of "}
        para2={"your past joined meetings"}
      />

      <Description
        svg={UiSolidFill}
        head={"Optimized UX/UI"}
        para1={"Clean design that  "}
        para2={"enhances Your Interactions"}
      />
    </>
  );
}
