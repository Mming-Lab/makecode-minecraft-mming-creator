# mming-creator

🌐 **言語**: [English](README.md) | 日本語

Minecraft Education 用の MakeCode 拡張機能です。カメラを動かして映像をとったり、1 ブロックで立体を作ったりできます。

| カテゴリ | できること |
|---|---|
| **カメラ** | 撮影モード、全部もとにもどす、カメラを置く・動かす（32 種類の動き方）、まわりを回る、ズーム、画面のゆれ、フェード、視点の切り替え、操作のオン・オフ |
| **つくる** | 球、直方体、円柱、角柱、円すい、角すい、ドーム、ドーナツ、たまご形、おわん形、くびれタワー、線、円、らせん、チューブ、なめらかな曲線 |
| **座標** | 自分の前の位置、図形の座標リスト、リストをずらす・回す、リストの場所にブロックを置く |

## インストール方法

1. MakeCode for Minecraft のエディタで、左下の **拡張機能** ボタンを押します。
2. 検索欄に次の URL を入力して検索します。

   ```
   https://github.com/Mming-Lab/makecode-minecraft-mming-creator
   ```

3. 表示された **mming-creator** を選んで取り込みます。

## 知っておくとよいこと

- **図形の中身**: 「つめる」は中までブロックを置きます。「外がわだけ（中はそのまま）」は、中にあったものを残します。「外がわだけ（中を空気にする）」は、中を空気にして部屋にします。
- **遠い場所**: ブロックを置けるのはプレイヤーのまわりだけなので、作っている間は `/tickingarea` でその場所を読み込みます。`mmingCreator` で始まる名前の領域を 1 つ使い、終わったら消します。領域は 1 ワールドに 10 個までです。
- **プログラムが途中で止まったとき**: 動けないままになることがあります。「全部もとにもどす」ブロックを使うか、チャットで次のコマンドを実行してください。

  ```
  /camera @s clear
  /hud @s reset all
  /inputpermission set @s movement enabled
  /inputpermission set @s camera enabled
  ```

  tickingarea が残ったときは、`/tickingarea list` で探して `/tickingarea remove <名前>` で消してください。

## 以前の拡張機能について

この拡張機能は、次の 3 つを引き継いでいます。ブロックの名前は変わっています。作ったプロジェクトは以前の拡張機能のまま動き続けます。1 つのプロジェクトに両方を入れて、少しずつ移すこともできます。

- [makecode-minecraft-camera](https://github.com/Mming-Lab/makecode-minecraft-camera)（カメラ）
- [makecode-minecraft-geometry-ext](https://github.com/Mming-Lab/makecode-minecraft-geometry-ext)（図形）
- [makecode-minecraft-rotating-position](https://github.com/Mming-Lab/makecode-minecraft-rotating-position)（座標の回転）

## ライセンス

Copyright (c) 2025-2026 mming (Mming Lab)

このプロジェクトは [PolyForm Noncommercial License 1.0.0](LICENSE) で公開しています。非商用目的でのみ利用できます。
