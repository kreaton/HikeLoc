import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
// The composition is laid out at 1920x1080; scale 2 renders it at 3840x2160 (4K) for YouTube.
Config.setScale(2);
Config.setCrf(16);
