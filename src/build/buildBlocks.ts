// 「つくる」カテゴリのブロック。図形は値で受け渡しし、置くブロックと分ける

//% block="Build" weight=99 color=#E67E22 icon="" advanced=true
//% groups='["Place","Solids","Surfaces","Lines and Curves","Edit","Settings"]'
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
     * A sphere.
     * @param center the center
     * @param radius the radius
     */
    //% blockId=mming_build_sphere
    //% block="sphere center $center radius $radius"
    //% center.shadow=mming_coords_inFront
    //% radius.min=1 radius.max=200 radius.defl=5
    //% group="Solids" weight=100
    export function sphere(center: Position, radius: number): mmingCore.Shape {
        return mmingCore.sphere(center, radius);
    }

    /**
     * A hemisphere (the top half of a sphere). The center is at the floor.
     * @param center the center of the floor
     * @param radius the radius
     * @param openBottom leave the bottom open
     */
    //% blockId=mming_build_hemisphere
    //% block="hemisphere center $center radius $radius||open bottom $openBottom"
    //% center.shadow=mming_coords_inFront
    //% radius.min=1 radius.max=200 radius.defl=6
    //% openBottom.shadow=toggleOnOff openBottom.defl=false
    //% expandableArgumentMode="toggle"
    //% group="Solids" weight=95
    export function hemisphere(center: Position, radius: number, openBottom: boolean = false): mmingCore.Shape {
        return mmingCore.hemisphere(center, radius, openBottom);
    }

    /**
     * A cuboid going up from the center of its base.
     * @param center the center of the base
     * @param sizeX the size along X
     * @param sizeZ the size along Z
     * @param height the height
     */
    //% blockId=mming_build_cuboid
    //% block="cuboid base center $center X size $sizeX Z size $sizeZ height $height"
    //% center.shadow=mming_coords_inFront
    //% sizeX.min=1 sizeX.defl=5
    //% sizeZ.min=1 sizeZ.defl=5
    //% height.min=1 height.max=384 height.defl=5
    //% group="Solids" weight=90
    export function cuboid(center: Position, sizeX: number, sizeZ: number, height: number): mmingCore.Shape {
        return mmingCore.cuboid(center, sizeX, sizeZ, height);
    }

    /**
     * A cuboid between two corners.
     * @param corner1 one corner
     * @param corner2 the opposite corner
     */
    //% blockId=mming_build_cuboidBetween
    //% block="cuboid corner $corner1 opposite corner $corner2"
    //% corner1.shadow=minecraftCreatePosition
    //% corner2.shadow=mming_coords_inFront
    //% group="Solids" weight=85
    export function cuboidBetween(corner1: Position, corner2: Position): mmingCore.Shape {
        return mmingCore.cuboidBetween(corner1, corner2);
    }

    /**
     * A cylinder going up from the center of its base.
     * @param center the center of the base
     * @param radius the radius
     * @param height the height
     * @param open leave the top and bottom open
     */
    //% blockId=mming_build_cylinder
    //% block="cylinder base center $center radius $radius height $height||open top and bottom $open"
    //% center.shadow=mming_coords_inFront
    //% radius.min=1 radius.max=200 radius.defl=5
    //% height.min=1 height.max=384 height.defl=10
    //% open.shadow=toggleOnOff open.defl=false
    //% expandableArgumentMode="toggle"
    //% group="Solids" weight=80
    export function cylinder(center: Position, radius: number, height: number, open: boolean = false): mmingCore.Shape {
        return mmingCore.cylinder(center, radius, height, open);
    }

    /**
     * A prism with a regular polygon base.
     * @param center the center of the base
     * @param sides the number of sides
     * @param radius the circumradius of the base
     * @param height the height
     * @param open leave the top and bottom open
     */
    //% blockId=mming_build_prism
    //% block="prism base center $center sides $sides circumradius $radius height $height||open top and bottom $open"
    //% center.shadow=mming_coords_inFront
    //% sides.min=3 sides.max=12 sides.defl=6
    //% radius.min=1 radius.max=200 radius.defl=5
    //% height.min=1 height.max=384 height.defl=10
    //% open.shadow=toggleOnOff open.defl=false
    //% expandableArgumentMode="toggle"
    //% group="Solids" weight=70
    export function prism(center: Position, sides: number, radius: number, height: number, open: boolean = false): mmingCore.Shape {
        return mmingCore.prism(center, sides, radius, height, open);
    }

    /**
     * A cone going up from the center of its base.
     * @param center the center of the base
     * @param radius the radius of the base
     * @param height the height
     * @param openBottom leave the bottom open
     */
    //% blockId=mming_build_cone
    //% block="cone base center $center radius $radius height $height||open bottom $openBottom"
    //% center.shadow=mming_coords_inFront
    //% radius.min=1 radius.max=200 radius.defl=5
    //% height.min=1 height.max=384 height.defl=10
    //% openBottom.shadow=toggleOnOff openBottom.defl=false
    //% expandableArgumentMode="toggle"
    //% group="Solids" weight=60
    export function cone(center: Position, radius: number, height: number, openBottom: boolean = false): mmingCore.Shape {
        return mmingCore.cone(center, radius, height, openBottom);
    }

    /**
     * A pyramid with a regular polygon base.
     * @param center the center of the base
     * @param sides the number of sides
     * @param radius the circumradius of the base
     * @param height the height
     * @param openBottom leave the bottom open
     */
    //% blockId=mming_build_pyramid
    //% block="pyramid base center $center sides $sides circumradius $radius height $height||open bottom $openBottom"
    //% center.shadow=mming_coords_inFront
    //% sides.min=3 sides.max=12 sides.defl=4
    //% radius.min=1 radius.max=200 radius.defl=5
    //% height.min=1 height.max=384 height.defl=6
    //% openBottom.shadow=toggleOnOff openBottom.defl=false
    //% expandableArgumentMode="toggle"
    //% group="Solids" weight=50
    export function pyramid(center: Position, sides: number, radius: number, height: number, openBottom: boolean = false): mmingCore.Shape {
        return mmingCore.pyramid(center, sides, radius, height, openBottom);
    }

    /**
     * A torus lying flat around the center.
     * @param center the center
     * @param majorRadius the distance from the center to the middle of the tube
     * @param minorRadius the radius of the tube
     */
    //% blockId=mming_build_torus
    //% block="torus center $center major radius $majorRadius minor radius $minorRadius"
    //% center.shadow=mming_coords_inFront
    //% majorRadius.min=1 majorRadius.max=200 majorRadius.defl=8
    //% minorRadius.min=1 minorRadius.max=100 minorRadius.defl=3
    //% group="Surfaces" weight=100
    export function torus(center: Position, majorRadius: number, minorRadius: number): mmingCore.Shape {
        return mmingCore.torus(center, majorRadius, minorRadius);
    }

    /**
     * An ellipsoid with a different radius on each axis.
     * @param center the center
     * @param radiusX the radius along X
     * @param radiusY the radius along Y
     * @param radiusZ the radius along Z
     */
    //% blockId=mming_build_ellipsoid
    //% block="ellipsoid center $center X radius $radiusX Y radius $radiusY Z radius $radiusZ"
    //% center.shadow=mming_coords_inFront
    //% radiusX.min=1 radiusX.max=200 radiusX.defl=5
    //% radiusY.min=1 radiusY.max=200 radiusY.defl=7
    //% radiusZ.min=1 radiusZ.max=200 radiusZ.defl=5
    //% group="Surfaces" weight=90
    export function ellipsoid(center: Position, radiusX: number, radiusY: number, radiusZ: number): mmingCore.Shape {
        return mmingCore.ellipsoid(center, radiusX, radiusY, radiusZ);
    }

    /**
     * A paraboloid of revolution: one cell at the bottom, opening up to the radius at the top.
     * @param center the center of the bottom
     * @param radius the radius at the top
     * @param height the height
     */
    //% blockId=mming_build_paraboloid
    //% block="paraboloid bottom center $center radius $radius height $height"
    //% center.shadow=mming_coords_inFront
    //% radius.min=1 radius.max=200 radius.defl=8
    //% height.min=1 height.max=384 height.defl=10
    //% group="Surfaces" weight=80
    export function paraboloid(center: Position, radius: number, height: number): mmingCore.Shape {
        return mmingCore.paraboloid(center, radius, height);
    }

    /**
     * A hyperboloid of one sheet.
     * @param center the center of the base
     * @param endRadius the radius at the top and bottom
     * @param throatRadius the radius at the middle
     * @param height the height
     */
    //% blockId=mming_build_hyperboloid
    //% block="hyperboloid base center $center end radius $endRadius throat radius $throatRadius height $height"
    //% center.shadow=mming_coords_inFront
    //% endRadius.min=1 endRadius.max=200 endRadius.defl=10
    //% throatRadius.min=0 throatRadius.max=100 throatRadius.defl=5
    //% height.min=1 height.max=384 height.defl=20
    //% group="Surfaces" weight=70
    export function hyperboloid(center: Position, endRadius: number, throatRadius: number, height: number): mmingCore.Shape {
        return mmingCore.hyperboloid(center, endRadius, throatRadius, height);
    }

    /**
     * A line segment.
     * @param from the start
     * @param to the end
     */
    //% blockId=mming_build_line
    //% block="line segment from $from to $to"
    //% from.shadow=minecraftCreatePosition
    //% to.shadow=mming_coords_inFront
    //% group="Lines and Curves" weight=100
    export function line(from: Position, to: Position): mmingCore.Shape {
        return mmingCore.line(from, to);
    }

    /**
     * A flat circle.
     * @param center the center
     * @param radius the radius
     * @param normal the axis perpendicular to the circle
     */
    //% blockId=mming_build_circle
    //% block="circle center $center radius $radius normal $normal"
    //% center.shadow=mming_coords_inFront
    //% radius.min=1 radius.max=200 radius.defl=5
    //% normal.defl=Axis.Y
    //% group="Lines and Curves" weight=90
    export function circle(center: Position, radius: number, normal: Axis): mmingCore.Shape {
        return mmingCore.circle(center, radius, normal);
    }

    /**
     * A helix going up from the center of its base.
     * @param center the center of the base
     * @param radius the radius
     * @param height the height
     * @param turns the number of turns
     * @param clockwise turn clockwise when seen from above
     */
    //% blockId=mming_build_helix
    //% block="helix base center $center radius $radius height $height turns $turns||clockwise $clockwise"
    //% center.shadow=mming_coords_inFront
    //% radius.min=1 radius.max=200 radius.defl=5
    //% height.min=1 height.max=384 height.defl=20
    //% turns.defl=3
    //% clockwise.shadow=toggleOnOff clockwise.defl=true
    //% expandableArgumentMode="toggle"
    //% group="Lines and Curves" weight=80
    export function helix(center: Position, radius: number, height: number, turns: number, clockwise: boolean = true): mmingCore.Shape {
        return mmingCore.helix(center, radius, height, turns, clockwise);
    }

    /**
     * A capsule: the cells within a radius of a line segment.
     * @param from the start
     * @param to the end
     * @param radius the radius
     */
    //% blockId=mming_build_capsule
    //% block="capsule from $from to $to radius $radius"
    //% from.shadow=minecraftCreatePosition
    //% to.shadow=mming_coords_inFront
    //% radius.min=1 radius.max=50 radius.defl=2
    //% group="Lines and Curves" weight=70
    export function capsule(from: Position, to: Position, radius: number): mmingCore.Shape {
        return mmingCore.capsule(from, to, radius);
    }

    /**
     * A Bézier curve.
     * @param from the start
     * @param to the end
     * @param controlPoints the control points
     */
    //% blockId=mming_build_bezier
    //% block="Bézier curve from $from to $to control points $controlPoints"
    //% from.shadow=minecraftCreatePosition
    //% to.shadow=mming_coords_inFront
    //% group="Lines and Curves" weight=60
    export function bezier(from: Position, to: Position, controlPoints: Position[]): mmingCore.Shape {
        return mmingCore.bezier(from, to, controlPoints);
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
     * Turn a shape into a list of positions. Lines and curves keep their order.
     * @param shape the shape
     */
    //% blockId=mming_build_toPositions
    //% block="positions of $shape"
    //% group="Edit" weight=40
    export function toPositions(shape: mmingCore.Shape): Position[] {
        return mmingCore.positionsOf(shape);
    }

    /**
     * Turn a list of positions into a shape.
     * @param positions the list of positions
     */
    //% blockId=mming_build_fromPositions
    //% block="shape from $positions"
    //% group="Edit" weight=30
    export function fromPositions(positions: Position[]): mmingCore.Shape {
        return mmingCore.shapeOfPoints(mmingCore.pointsOfPositions(positions));
    }

    /**
     * Show the building progress above the hotbar.
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
