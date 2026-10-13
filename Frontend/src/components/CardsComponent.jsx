import CardComponent from "../components/CardComponent";

import VideoSvg from "../assets/svg/landing-svgs/feature-video.svg";
import ChattingSvg from "../assets/svg/landing-svgs/feature-chatting.svg";
import ScreenShareSvg from "../assets/svg/landing-svgs/feature-screen-sharing.svg";

export default function CardsComponent() {
  return (
    <>
      <CardComponent
        svg={VideoSvg}
        head1={"Video"}
        head2={"Conferencing"}
        paragraph={
          "High-quality video calls with multiple participants, including HD video and grid or spotlight modes."
        }
        link={
          "https://lottie.host/embed/08c2fc19-470e-4e61-8578-429a5af5fc51/Yq8xVdCc36.lottie"
        }
      />

      <CardComponent
        svg={ScreenShareSvg}
        head1={"Live Screen"}
        head2={"Broadcasting"}
        paragraph={
          "Share your screen, a window, or a tab with participants for presentations or demonstrations."
        }
        link={
          "https://lottie.host/embed/85a16983-fbf4-4425-954a-6bca92e4d547/9NHelaS6SJ.lottie"
        }
      />

      <CardComponent
        svg={ChattingSvg}
        head1={"Real-Time"}
        head2={"Chatting"}
        paragraph={
          "In-meeting chat, private messages, and persistent messaging for teams outside meetings."
        }
        link={
          "https://lottie.host/embed/55cc384a-7401-42ea-a7e7-d4bcf39fa606/KdUgzWC4cl.lottie"
        }
      />
    </>
  );
}
