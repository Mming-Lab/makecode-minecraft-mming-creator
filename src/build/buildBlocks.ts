// 「配置と加工」カテゴリのブロック。「形状」の図形を加工して置く

//% block="Place and Edit" weight=98 color=#C0562B icon="" advanced=true
//% groups='["Place","Edit","Settings"]'
namespace mmingBuild {

    /**
     * Place a block on every cell of a shape.
     * @param block the block to use
     * @param shape the shape
     * @param clearInside turn the inside into air and leave only the outside
     */
    //% blockId=mming_build_place
    //% block="place $block on $shape||clear inside $clearInside"
    //% block.shadow=minecraftBlock
    //% clearInside.shadow=toggleOnOff clearInside.defl=false
    //% expandableArgumentMode="toggle"
    //% group="Place" weight=100
    export function place(block: number, shape: mmingCore.Shape, clearInside: boolean = false): void {
        mmingCore.placeShape(shape, block, clearInside);
    }

    /**
     * Place blocks layer by layer, using the blocks in the list in turn.
     * @param blockList the blocks to use in turn
     * @param shape the shape
     * @param axis the direction of the layers
     * @param thickness how many cells each block lasts
     */
    //% blockId=mming_build_placeLayers
    //% block="place $blockList on $shape in layers||along $axis thickness $thickness"
    //% blockList.shadow=lists_create_with blockList.defl=minecraftBlock
    //% axis.defl=Axis.Y
    //% thickness.min=1 thickness.defl=1
    //% expandableArgumentMode="toggle"
    //% group="Place" weight=90
    export function placeLayers(blockList: number[], shape: mmingCore.Shape, axis: Axis = Axis.Y, thickness: number = 1): void {
        mmingCore.placeLayers(blockList, shape, axis, thickness);
    }

    /**
     * The number of blocks placed last time.
     */
    //% blockId=mming_build_lastCount
    //% block="blocks placed last time"
    //% group="Place" weight=80
    export function lastCount(): number {
        return mmingCore.lastPlaced();
    }

    /**
     * The outer surface of a shape.
     * @param shape the shape
     */
    //% blockId=mming_build_outside
    //% block="outside of $shape"
    //% group="Edit" weight=100
    export function outside(shape: mmingCore.Shape): mmingCore.Shape {
        return mmingCore.differenceShape(shape, inside(shape));
    }

    /**
     * The cells of a shape that are not on its surface.
     * @param shape the shape
     */
    //% blockId=mming_build_inside
    //% block="inside of $shape"
    //% group="Edit" weight=95
    export function inside(shape: mmingCore.Shape): mmingCore.Shape {
        return mmingCore.shapeOfRows(mmingCore.innerRows(shape));
    }

    /**
     * Keep only some layers of a shape. Layers are counted from 0 at the low end of the axis.
     * @param shape the shape
     * @param axis the axis
     * @param from the first layer
     * @param to the last layer
     */
    //% blockId=mming_build_slice
    //% block="layers $from to $to of $shape along $axis"
    //% axis.defl=Axis.Y
    //% from.defl=0
    //% to.defl=4
    //% group="Edit" weight=90
    export function slice(shape: mmingCore.Shape, axis: Axis, from: number, to: number): mmingCore.Shape {
        return mmingCore.sliceShape(shape, axis, from, to);
    }

    /**
     * The cells in either shape.
     * @param a one shape
     * @param b the other shape
     */
    //% blockId=mming_build_union
    //% block="union of $a and $b"
    //% group="Edit" weight=80
    export function union(a: mmingCore.Shape, b: mmingCore.Shape): mmingCore.Shape {
        return mmingCore.unionShape(a, b);
    }

    /**
     * The cells of the first shape that are not in the second.
     * @param a the shape to keep
     * @param b the shape to remove
     */
    //% blockId=mming_build_difference
    //% block="$a minus $b"
    //% group="Edit" weight=75
    export function difference(a: mmingCore.Shape, b: mmingCore.Shape): mmingCore.Shape {
        return mmingCore.differenceShape(a, b);
    }

    /**
     * The cells in both shapes.
     * @param a one shape
     * @param b the other shape
     */
    //% blockId=mming_build_intersection
    //% block="intersection of $a and $b"
    //% group="Edit" weight=70
    export function intersection(a: mmingCore.Shape, b: mmingCore.Shape): mmingCore.Shape {
        return mmingCore.intersectionShape(a, b);
    }

    /**
     * Move a shape.
     * @param shape the shape
     * @param x how far along X
     * @param y how far along Y
     * @param z how far along Z
     */
    //% blockId=mming_build_move
    //% block="move $shape by x $x y $y z $z"
    //% group="Edit" weight=60
    export function move(shape: mmingCore.Shape, x: number, y: number, z: number): mmingCore.Shape {
        return mmingCore.moveShape(shape, x, y, z);
    }

    /**
     * The number of cells in a shape.
     * @param shape the shape
     */
    //% blockId=mming_build_count
    //% block="number of cells in $shape"
    //% group="Edit" weight=50
    export function count(shape: mmingCore.Shape): number {
        return shape.rows().count();
    }

    /**
     * Show the building progress in the chat.
     * @param on show the progress
     */
    //% blockId=mming_build_showProgress
    //% block="show building progress $on"
    //% on.shadow=toggleOnOff on.defl=true
    //% group="Settings" weight=100
    export function showProgress(on: boolean): void {
        mmingCore.setShowProgress(on);
    }
}
