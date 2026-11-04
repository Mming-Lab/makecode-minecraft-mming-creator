// 「形状」カテゴリのブロック。図形を値で返すだけで、何も置かない

//% block="Geometry" weight=99 color=#E67E22 icon="" advanced=true
//% groups='["Solids","Surfaces","Lines and Curves"]'
namespace mmingShape {

    /**
     * A sphere.
     * @param center the center
     * @param radius the radius
     */
    //% blockId=mming_shape_sphere
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
    //% blockId=mming_shape_hemisphere
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
    //% blockId=mming_shape_cuboid
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
    //% blockId=mming_shape_cuboidBetween
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
    //% blockId=mming_shape_cylinder
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
    //% blockId=mming_shape_prism
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
    //% blockId=mming_shape_cone
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
    //% blockId=mming_shape_pyramid
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
    //% blockId=mming_shape_torus
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
    //% blockId=mming_shape_ellipsoid
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
    //% blockId=mming_shape_paraboloid
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
    //% blockId=mming_shape_hyperboloid
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
    //% blockId=mming_shape_line
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
    //% blockId=mming_shape_circle
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
    //% blockId=mming_shape_helix
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
    //% blockId=mming_shape_capsule
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
    //% blockId=mming_shape_bezier
    //% block="Bézier curve from $from to $to control points $controlPoints"
    //% from.shadow=minecraftCreatePosition
    //% to.shadow=mming_coords_inFront
    //% group="Lines and Curves" weight=60
    export function bezier(from: Position, to: Position, controlPoints: Position[]): mmingCore.Shape {
        return mmingCore.bezier(from, to, controlPoints);
    }
}
