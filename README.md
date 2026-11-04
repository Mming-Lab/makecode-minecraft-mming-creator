# mming-creator

🌐 **Languages**: English | [日本語](README_ja.md)

An advanced MakeCode extension for Minecraft Education: film scenes with a moving camera, and create 3D shapes as values you can combine and place. It is made for experienced users, or for learners working with a mentor.

All four categories are inside **Advanced** in the toolbox.

| Category | What it does |
|---|---|
| **Camera** | Filming mode, reset everything, place and move the camera (32 easing styles), orbit a position, move along a path, field of view, camera shake, fades, views, controls |
| **Geometry** | Shapes as values: solids, surfaces, lines and curves |
| **Place and Edit** | Place blocks on shapes, and edit shapes (union, difference, intersection, layers, outside, inside, move) |
| **Coordinates** | Positions in front of you, rotate a position, move and rotate position lists, convert between shapes and lists |

## Installation

1. In MakeCode for Minecraft, click **Extensions**.
2. Search for this URL:

   ```
   https://github.com/Mming-Lab/makecode-minecraft-mming-creator
   ```

3. Select **mming-creator** to add it.

## Shapes

A shape block does not place anything. It returns a shape, which you pass to a block that uses it.

```
place Glass on (sphere center (10 blocks in front of me) radius 5)
```

| Group | Shapes |
|---|---|
| **Solids** | Sphere, hemisphere, cuboid, cylinder, prism, cone, pyramid |
| **Surfaces** | Torus, ellipsoid, paraboloid, hyperboloid of one sheet |
| **Lines and Curves** | Line segment, circle, helix, capsule, Bézier curve |

Shapes can be kept in variables and edited before they are placed. Editing returns a new shape.

| Block | Result |
|---|---|
| **union of A and B** | Cells in either shape |
| **A minus B** | Cells of A that are not in B |
| **intersection of A and B** | Cells in both shapes |
| **outside of** / **inside of** | The surface of a shape, or the cells under it |
| **layers from to of** | Only some layers. Layers are counted from 0 at the low end of the axis |
| **move** | The same shape in another place |

### Using different blocks by height

**place in layers** uses the blocks in a list in turn, along an axis. For anything more specific, take layers with **layers from to of** and place each one with its own block.

### Shapes and position lists

**positions of** turns a shape into a list, and **shape from** turns a list into a shape, so a shape can go through the Coordinates blocks. Line segments, helixes and Bézier curves keep the order you would travel them in, so they work as a path for **move camera along**. Other shapes are listed in grid order: use **orbit** to circle around something.

A list holds one item for every cell, so keep lists to small shapes. Placing a shape directly is much lighter.

## Good to know

- **Clear inside**: the option on **place** turns the inside into air, and uses fewer `/fill` commands than placing the **outside of** a shape over existing blocks.
- **Large shapes take time**: a sphere of radius 100 needs about 7,000 `/fill` commands. The progress is shown in your chat, and only you can see it. **show building progress** turns off the percentages, but some messages remain because MakeCode stops on long calculations without them.
- **Far away**: only the area around the player can be changed, so the extension loads the area with `/tickingarea` while building. It uses one area named `mmingCreator...` and removes it when done. Each world can have up to 10 areas.
- **If a program stops in the middle**, the player may be left unable to move. Run these in the chat, or use the **reset everything** block:

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
