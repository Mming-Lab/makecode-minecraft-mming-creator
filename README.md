# mming-creator

🌐 **Languages**: English | [日本語](README_ja.md)

A MakeCode extension for Minecraft Education: film scenes with a moving camera, and build 3D shapes with one block.

| Category | What it does |
|---|---|
| **Camera** | Filming mode, reset everything, place and move the camera (32 movement styles), fly around a position, zoom, screen shake, fades, views, controls |
| **Build** | Sphere, box, cylinder, prism, cone, pyramid, dome, donut, egg, bowl, waisted tower, line, circle, spiral, tube, smooth curve |
| **Coordinates** | "Blocks in front of me", position lists of shapes, move and turn lists, place blocks along a list |

## Installation

1. In MakeCode for Minecraft, click **Extensions**.
2. Search for this URL:

   ```
   https://github.com/Mming-Lab/makecode-minecraft-mming-creator
   ```

3. Select **mming-creator** to add it.

## Good to know

- **Filling a shape**: "solid" fills it, "outside only (keep inside)" leaves what was inside, and "outside only (clear inside)" turns the inside into air.
- **Far away**: only the area around the player can be changed, so the extension loads the area with `/tickingarea` while building. It uses one area named `mmingCreator...` and removes it when done. Each world can have up to 10 areas.
- **If a program stops in the middle**, the player may be left unable to move. Run these in the chat, or use the "reset everything" block:

  ```
  /camera @s clear
  /hud @s reset all
  /inputpermission set @s movement enabled
  /inputpermission set @s camera enabled
  ```

  If a ticking area remains, find it with `/tickingarea list` and remove it with `/tickingarea remove <name>`.

## Previous extensions

This extension replaces these three. They use different block names, so existing projects keep working with the old extension, and both can be in the same project while you switch.

- [makecode-minecraft-camera](https://github.com/Mming-Lab/makecode-minecraft-camera)
- [makecode-minecraft-geometry-ext](https://github.com/Mming-Lab/makecode-minecraft-geometry-ext)
- [makecode-minecraft-rotating-position](https://github.com/Mming-Lab/makecode-minecraft-rotating-position)

## License

Copyright (c) 2025-2026 mming (Mming Lab)

This project is licensed under the [PolyForm Noncommercial License 1.0.0](LICENSE). Non-commercial use only.
