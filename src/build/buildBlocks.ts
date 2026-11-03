// 「つくる」カテゴリのブロック

/** 図形の中身の作り方 */
enum BuildFill {
    //% block="solid"
    Solid,
    //% block="outside only (keep inside)"
    Shell,
    //% block="outside only (clear inside)"
    Hollow
}

//% block="Build" weight=99 color=#E67E22 icon=""
//% groups='["Solids","Fun Shapes","Lines and Curves","Settings"]'
namespace mmingBuild {

    /**
     * Build a sphere.
     * @param block the block to use
     * @param center the center
     * @param radius the radius
     * @param fill how to fill the shape
     */
    //% blockId=mming_build_sphere
    //% block="sphere of $block|center $center|radius $radius||$fill"
    //% block.shadow=minecraftBlock
    //% center.shadow=mming_coords_inFront
    //% radius.min=1 radius.max=200 radius.defl=5
    //% blockExternalInputs=1 expandableArgumentMode="toggle"
    //% group="Solids" weight=100
    export function sphere(block: number, center: Position, radius: number, fill: BuildFill = BuildFill.Solid): void {
        mmingCore.placeShape(mmingCore.sphere(center, radius), block, fill);
    }

    /**
     * Build a box going up from the center of its base.
     * @param block the block to use
     * @param center the center of the base
     * @param width the width (X)
     * @param depth the depth (Z)
     * @param height the height
     * @param fill how to fill the shape
     */
    //% blockId=mming_build_box
    //% block="box of $block|base center $center|width $width|depth $depth|height $height||$fill"
    //% block.shadow=minecraftBlock
    //% center.shadow=mming_coords_inFront
    //% width.min=1 width.max=400 width.defl=5
    //% depth.min=1 depth.max=400 depth.defl=5
    //% height.min=1 height.max=384 height.defl=5
    //% blockExternalInputs=1 expandableArgumentMode="toggle"
    //% group="Solids" weight=90
    export function box(block: number, center: Position, width: number, depth: number, height: number, fill: BuildFill = BuildFill.Solid): void {
        mmingCore.placeShape(mmingCore.boxAt(center, width, depth, height), block, fill);
    }

    /**
     * Build a box between two corners.
     * @param block the block to use
     * @param corner1 one corner
     * @param corner2 the opposite corner
     * @param fill how to fill the shape
     */
    //% blockId=mming_build_boxBetween
    //% block="box of $block|corner $corner1|opposite corner $corner2||$fill"
    //% block.shadow=minecraftBlock
    //% corner1.shadow=minecraftCreatePosition
    //% corner2.shadow=minecraftCreatePosition
    //% blockExternalInputs=1 expandableArgumentMode="toggle"
    //% group="Solids" weight=85 advanced=true
    export function boxBetween(block: number, corner1: Position, corner2: Position, fill: BuildFill = BuildFill.Solid): void {
        mmingCore.placeShape(mmingCore.boxBetween(corner1, corner2), block, fill);
    }

    /**
     * Build a cylinder going up from the center of its base.
     * @param block the block to use
     * @param center the center of the base
     * @param radius the radius
     * @param height the height
     * @param fill how to fill the shape
     * @param open leave the top and bottom open
     */
    //% blockId=mming_build_cylinder
    //% block="cylinder of $block|base center $center|radius $radius|height $height||$fill|open top and bottom $open"
    //% block.shadow=minecraftBlock
    //% center.shadow=mming_coords_inFront
    //% radius.min=1 radius.max=200 radius.defl=5
    //% height.min=1 height.max=384 height.defl=10
    //% open.shadow=toggleOnOff open.defl=false
    //% blockExternalInputs=1 expandableArgumentMode="toggle"
    //% group="Solids" weight=80
    export function cylinder(block: number, center: Position, radius: number, height: number, fill: BuildFill = BuildFill.Solid, open: boolean = false): void {
        mmingCore.placeShape(mmingCore.cylinder(center, radius, height, open), block, fill);
    }

    /**
     * Build a prism with a regular polygon base.
     * @param block the block to use
     * @param center the center of the base
     * @param sides the number of sides
     * @param radius the size of the base
     * @param height the height
     * @param fill how to fill the shape
     * @param open leave the top and bottom open
     */
    //% blockId=mming_build_prism
    //% block="prism of $block|base center $center|sides $sides|radius $radius|height $height||$fill|open top and bottom $open"
    //% block.shadow=minecraftBlock
    //% center.shadow=mming_coords_inFront
    //% sides.min=3 sides.max=12 sides.defl=6
    //% radius.min=1 radius.max=200 radius.defl=5
    //% height.min=1 height.max=384 height.defl=10
    //% open.shadow=toggleOnOff open.defl=false
    //% blockExternalInputs=1 expandableArgumentMode="toggle"
    //% group="Solids" weight=70
    export function prism(block: number, center: Position, sides: number, radius: number, height: number, fill: BuildFill = BuildFill.Solid, open: boolean = false): void {
        mmingCore.placeShape(mmingCore.prism(center, sides, radius, height, open), block, fill);
    }

    /**
     * Build a cone going up from the center of its base.
     * @param block the block to use
     * @param center the center of the base
     * @param radius the radius of the base
     * @param height the height
     * @param fill how to fill the shape
     * @param open leave the bottom open
     */
    //% blockId=mming_build_cone
    //% block="cone of $block|base center $center|radius $radius|height $height||$fill|open bottom $open"
    //% block.shadow=minecraftBlock
    //% center.shadow=mming_coords_inFront
    //% radius.min=1 radius.max=200 radius.defl=5
    //% height.min=1 height.max=384 height.defl=10
    //% open.shadow=toggleOnOff open.defl=false
    //% blockExternalInputs=1 expandableArgumentMode="toggle"
    //% group="Solids" weight=60
    export function cone(block: number, center: Position, radius: number, height: number, fill: BuildFill = BuildFill.Solid, open: boolean = false): void {
        mmingCore.placeShape(mmingCore.cone(center, radius, height, open), block, fill);
    }

    /**
     * Build a pyramid with a regular polygon base.
     * @param block the block to use
     * @param center the center of the base
     * @param sides the number of sides
     * @param radius the size of the base
     * @param height the height
     * @param fill how to fill the shape
     * @param open leave the bottom open
     */
    //% blockId=mming_build_pyramid
    //% block="pyramid of $block|base center $center|sides $sides|radius $radius|height $height||$fill|open bottom $open"
    //% block.shadow=minecraftBlock
    //% center.shadow=mming_coords_inFront
    //% sides.min=3 sides.max=12 sides.defl=4
    //% radius.min=1 radius.max=200 radius.defl=5
    //% height.min=1 height.max=384 height.defl=6
    //% open.shadow=toggleOnOff open.defl=false
    //% blockExternalInputs=1 expandableArgumentMode="toggle"
    //% group="Solids" weight=50
    export function pyramid(block: number, center: Position, sides: number, radius: number, height: number, fill: BuildFill = BuildFill.Solid, open: boolean = false): void {
        mmingCore.placeShape(mmingCore.pyramid(center, sides, radius, height, open), block, fill);
    }

    /**
     * Build a dome (the top half of a sphere).
     * @param block the block to use
     * @param center the center of the floor
     * @param radius the radius
     * @param fill how to fill the shape
     * @param open leave the bottom open
     */
    //% blockId=mming_build_dome
    //% block="dome of $block|center $center|radius $radius||$fill|open bottom $open"
    //% block.shadow=minecraftBlock
    //% center.shadow=mming_coords_inFront
    //% radius.min=1 radius.max=200 radius.defl=6
    //% open.shadow=toggleOnOff open.defl=false
    //% blockExternalInputs=1 expandableArgumentMode="toggle"
    //% group="Fun Shapes" weight=100
    export function dome(block: number, center: Position, radius: number, fill: BuildFill = BuildFill.Solid, open: boolean = false): void {
        mmingCore.placeShape(mmingCore.dome(center, radius, open), block, fill);
    }

    /**
     * Build a donut lying flat around the center.
     * @param block the block to use
     * @param center the center
     * @param ringRadius the radius of the ring
     * @param thickness the thickness (radius) of the ring
     * @param fill how to fill the shape
     */
    //% blockId=mming_build_donut
    //% block="donut of $block|center $center|ring radius $ringRadius|thickness $thickness||$fill"
    //% block.shadow=minecraftBlock
    //% center.shadow=mming_coords_inFront
    //% ringRadius.min=3 ringRadius.max=200 ringRadius.defl=8
    //% thickness.min=1 thickness.max=100 thickness.defl=3
    //% blockExternalInputs=1 expandableArgumentMode="toggle"
    //% group="Fun Shapes" weight=90
    export function donut(block: number, center: Position, ringRadius: number, thickness: number, fill: BuildFill = BuildFill.Solid): void {
        mmingCore.placeShape(mmingCore.donut(center, ringRadius, thickness), block, fill);
    }

    /**
     * Build an egg shape with a different radius on each axis.
     * @param block the block to use
     * @param center the center
     * @param radiusX the radius across (X)
     * @param radiusY the radius up and down (Y)
     * @param radiusZ the radius in depth (Z)
     * @param fill how to fill the shape
     */
    //% blockId=mming_build_egg
    //% block="egg of $block|center $center|width radius $radiusX|height radius $radiusY|depth radius $radiusZ||$fill"
    //% block.shadow=minecraftBlock
    //% center.shadow=mming_coords_inFront
    //% radiusX.min=1 radiusX.max=200 radiusX.defl=5
    //% radiusY.min=1 radiusY.max=200 radiusY.defl=7
    //% radiusZ.min=1 radiusZ.max=200 radiusZ.defl=5
    //% blockExternalInputs=1 expandableArgumentMode="toggle"
    //% group="Fun Shapes" weight=80
    export function egg(block: number, center: Position, radiusX: number, radiusY: number, radiusZ: number, fill: BuildFill = BuildFill.Solid): void {
        mmingCore.placeShape(mmingCore.egg(center, radiusX, radiusY, radiusZ), block, fill);
    }

    /**
     * Build a bowl: one block at the bottom, opening up to the radius at the top.
     * @param block the block to use
     * @param center the center of the bottom
     * @param radius the radius at the top
     * @param height the height
     * @param fill how to fill the shape
     */
    //% blockId=mming_build_bowl
    //% block="bowl of $block|bottom center $center|radius $radius|height $height||$fill"
    //% block.shadow=minecraftBlock
    //% center.shadow=mming_coords_inFront
    //% radius.min=2 radius.max=200 radius.defl=8
    //% height.min=1 height.max=384 height.defl=10
    //% blockExternalInputs=1 expandableArgumentMode="toggle"
    //% group="Fun Shapes" weight=70
    export function bowl(block: number, center: Position, radius: number, height: number, fill: BuildFill = BuildFill.Solid): void {
        mmingCore.placeShape(mmingCore.bowl(center, radius, height), block, fill);
    }

    /**
     * Build a tower that is narrow in the middle.
     * @param block the block to use
     * @param center the center of the base
     * @param endRadius the radius at the top and bottom
     * @param waistRadius the radius in the middle
     * @param height the height
     * @param fill how to fill the shape
     */
    //% blockId=mming_build_waist
    //% block="waisted tower of $block|base center $center|end radius $endRadius|waist radius $waistRadius|height $height||$fill"
    //% block.shadow=minecraftBlock
    //% center.shadow=mming_coords_inFront
    //% endRadius.min=3 endRadius.max=200 endRadius.defl=10
    //% waistRadius.min=1 waistRadius.max=100 waistRadius.defl=5
    //% height.min=4 height.max=384 height.defl=20
    //% blockExternalInputs=1 expandableArgumentMode="toggle"
    //% group="Fun Shapes" weight=60 advanced=true
    export function waist(block: number, center: Position, endRadius: number, waistRadius: number, height: number, fill: BuildFill = BuildFill.Solid): void {
        mmingCore.placeShape(mmingCore.waist(center, endRadius, waistRadius, height), block, fill);
    }

    /**
     * Draw a line of blocks between two positions.
     * @param block the block to use
     * @param from the start
     * @param to the end
     */
    //% blockId=mming_build_line
    //% block="line of $block|from $from|to $to"
    //% block.shadow=minecraftBlock
    //% from.shadow=minecraftCreatePosition
    //% to.shadow=mming_coords_inFront
    //% blockExternalInputs=1
    //% group="Lines and Curves" weight=100
    export function line(block: number, from: Position, to: Position): void {
        mmingCore.placePoints(mmingCore.line(from, to), block);
    }

    /**
     * Draw a flat circle facing an axis.
     * @param block the block to use
     * @param center the center
     * @param radius the radius
     * @param facing the axis the circle faces
     * @param fill how to fill the shape
     */
    //% blockId=mming_build_circle
    //% block="circle of $block|center $center|radius $radius|facing $facing||$fill"
    //% block.shadow=minecraftBlock
    //% center.shadow=mming_coords_inFront
    //% radius.min=1 radius.max=200 radius.defl=5
    //% facing.defl=Axis.Y
    //% blockExternalInputs=1 expandableArgumentMode="toggle"
    //% group="Lines and Curves" weight=90
    export function circle(block: number, center: Position, radius: number, facing: Axis, fill: BuildFill = BuildFill.Solid): void {
        mmingCore.placeShape(mmingCore.circle(center, radius, facing), block, fill);
    }

    /**
     * Draw a spiral going up from the center of its base.
     * @param block the block to use
     * @param center the center of the base
     * @param radius the radius
     * @param height the height
     * @param turns how many times it goes around
     * @param clockwise turn clockwise when seen from above
     */
    //% blockId=mming_build_spiral
    //% block="spiral of $block|base center $center|radius $radius|height $height|turns $turns||clockwise $clockwise"
    //% block.shadow=minecraftBlock
    //% center.shadow=mming_coords_inFront
    //% radius.min=1 radius.max=200 radius.defl=5
    //% height.min=2 height.max=384 height.defl=20
    //% turns.min=0.5 turns.max=20 turns.defl=3
    //% clockwise.shadow=toggleOnOff clockwise.defl=true
    //% blockExternalInputs=1 expandableArgumentMode="toggle"
    //% group="Lines and Curves" weight=80
    export function spiral(block: number, center: Position, radius: number, height: number, turns: number, clockwise: boolean = true): void {
        mmingCore.placePoints(mmingCore.spiral(center, radius, height, turns, clockwise), block);
    }

    /**
     * Build a thick line (tube) between two positions.
     * @param block the block to use
     * @param from the start
     * @param to the end
     * @param radius the thickness (radius)
     * @param fill how to fill the shape
     */
    //% blockId=mming_build_tube
    //% block="tube of $block|from $from|to $to|radius $radius||$fill"
    //% block.shadow=minecraftBlock
    //% from.shadow=minecraftCreatePosition
    //% to.shadow=mming_coords_inFront
    //% radius.min=1 radius.max=50 radius.defl=2
    //% blockExternalInputs=1 expandableArgumentMode="toggle"
    //% group="Lines and Curves" weight=70
    export function tube(block: number, from: Position, to: Position, radius: number, fill: BuildFill = BuildFill.Solid): void {
        mmingCore.placeShape(mmingCore.tube(from, to, radius), block, fill);
    }

    /**
     * Draw a smooth curve pulled toward the points in a list.
     * @param block the block to use
     * @param from the start
     * @param to the end
     * @param pullPoints the points that pull the curve
     */
    //% blockId=mming_build_curve
    //% block="smooth curve of $block|from $from|to $to|pulled by $pullPoints"
    //% block.shadow=minecraftBlock
    //% from.shadow=minecraftCreatePosition
    //% to.shadow=mming_coords_inFront
    //% blockExternalInputs=1
    //% group="Lines and Curves" weight=60 advanced=true
    export function curve(block: number, from: Position, to: Position, pullPoints: Position[]): void {
        mmingCore.placePoints(mmingCore.curve(from, to, pullPoints), block);
    }

    /**
     * The number of blocks placed by the last shape.
     */
    //% blockId=mming_build_lastCount
    //% block="blocks placed last time"
    //% group="Settings" weight=100
    export function lastCount(): number {
        return mmingCore.lastPlaced();
    }

    /**
     * Show the building progress above the hotbar.
     * @param on show the progress
     */
    //% blockId=mming_build_showProgress
    //% block="show building progress $on"
    //% on.shadow=toggleOnOff on.defl=true
    //% group="Settings" weight=90 advanced=true
    export function showProgress(on: boolean): void {
        mmingCore.setShowProgress(on);
    }
}
