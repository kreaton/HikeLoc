import React from "react";
import { Composition } from "remotion";
import { HowTo, totalFrames } from "./HowTo";

export const Root: React.FC = () => (
  <Composition id="HowTo" component={HowTo} durationInFrames={totalFrames} fps={30} width={1920} height={1080} />
);
