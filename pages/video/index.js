import { Container, Typography } from "@mui/material";
import Head from "next/head";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import * as React from "react";

export default function Video() {
  React.useEffect(() => {
    const player = new Plyr("video", {
      captions: { active: true },
      autoplay: true,
      playsinline: true,
    });
  }, []);

  return (
    <>
      <Head>
        <title>Video</title>
        <meta name="description" content="Test Video Plyr" />
      </Head>
      <Container>
        <Typography>Test Video Plyr</Typography>

        <video
          id="player"
          crossOrigin="anonymous"
          poster="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg"
        >
          <source
            src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4"
            type="video/mp4"
            size="576"
          />
          <source
            src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4"
            type="video/mp4"
            size="720"
          />
          <source
            src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-1080p.mp4"
            type="video/mp4"
            size="1080"
          />

          <track
            kind="captions"
            label="English"
            srcLang="en"
            src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.en.vtt"
            default
          />
          <track
            kind="captions"
            label="Français"
            srcLang="fr"
            src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.fr.vtt"
          />
          <a
            href="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4"
            download
          >
            Download
          </a>
        </video>
      </Container>
    </>
  );
}
