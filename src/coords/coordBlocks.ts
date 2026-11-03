// 「座標」カテゴリのブロック

//% block="Coordinates" weight=98 color=#4CAF50 icon=""
//% groups='["Positions","Shapes","Move and Turn","Place"]'
namespace mmingCoords {

    /**
     * The position some blocks in front of you, at your feet height.
     * @param distance how many blocks in front
     */
    //% blockId=mming_coords_inFront
    //% block="$distance blocks in front of me"
    //% distance.min=1 distance.max=100 distance.defl=10
    //% group="Positions" weight=100
    export function inFront(distance: number): Position {
        const ahead = posCamera(0, 0, distance).toWorld();
        const feet = player.position().toWorld();
        return world(Math.floor(ahead.getValue(Axis.X)), Math.floor(feet.getValue(Axis.Y)), Math.floor(ahead.getValue(Axis.Z)));
    }

    /**
     * Rotate a position around a center.
     * A positive angle turns counterclockwise when you look from the + side of the axis
     * (for the Y axis: counterclockwise when seen from above).
     * @param position the position to turn
     * @param center the center
     * @param axis the axis to turn around
     * @param degrees the angle in degrees
     */
    //% blockId=mming_coords_rotate
    //% block="turn $position around $center on axis $axis by $degrees degrees"
    //% position.shadow=minecraftCreatePosition
    //% center.shadow=minecraftCreatePosition
    //% degrees.min=-360 degrees.max=360 degrees.defl=90
    //% group="Move and Turn" weight=80 advanced=true
    export function rotate(position: Position, center: Position, axis: Axis, degrees: number): Position {
        const c = center.toWorld();
        return rotateAround(position.toWorld(), c.getValue(Axis.X), c.getValue(Axis.Y), c.getValue(Axis.Z), axis, degrees);
    }

    /** 回す本体。結果は置いたときにずれないようにブロック単位に丸める */
    function rotateAround(p: Position, ox: number, oy: number, oz: number, axis: Axis, degrees: number): Position {
        const x = p.getValue(Axis.X) - ox, y = p.getValue(Axis.Y) - oy, z = p.getValue(Axis.Z) - oz;
        const rad = degrees * Math.PI / 180;
        const sin = Math.sin(rad), cos = Math.cos(rad);
        let rx = x, ry = y, rz = z;
        if (axis == Axis.X) {
            ry = y * cos - z * sin;
            rz = y * sin + z * cos;
        } else if (axis == Axis.Y) {
            rx = x * cos + z * sin;
            rz = -x * sin + z * cos;
        } else {
            rx = x * cos - y * sin;
            ry = x * sin + y * cos;
        }
        return world(Math.round(ox + rx), Math.round(oy + ry), Math.round(oz + rz));
    }

    /**
     * Get the positions of a line.
     * @param from the start
     * @param to the end
     */
    //% blockId=mming_coords_line
    //% block="positions of line from $from to $to"
    //% from.shadow=minecraftCreatePosition
    //% to.shadow=mming_coords_inFront
    //% group="Shapes" weight=100 advanced=true
    export function line(from: Position, to: Position): Position[] {
        return mmingCore.line(from, to).toPositions();
    }

    /**
     * Get the positions of a circle.
     * @param center the center
     * @param radius the radius
     * @param facing the axis the circle faces
     * @param outsideOnly only the outer edge
     */
    //% blockId=mming_coords_circle
    //% block="positions of circle center $center radius $radius facing $facing||outside only $outsideOnly"
    //% center.shadow=mming_coords_inFront
    //% radius.min=1 radius.max=200 radius.defl=5
    //% outsideOnly.shadow=toggleOnOff outsideOnly.defl=false
    //% expandableArgumentMode="toggle"
    //% group="Shapes" weight=90 advanced=true
    export function circle(center: Position, radius: number, facing: Axis, outsideOnly: boolean = false): Position[] {
        return mmingCore.positionsOf(mmingCore.circle(center, radius, facing), outsideOnly);
    }

    /**
     * Get the positions of a spiral.
     * @param center the center of the base
     * @param radius the radius
     * @param height the height
     * @param turns how many times it goes around
     * @param clockwise turn clockwise when seen from above
     */
    //% blockId=mming_coords_spiral
    //% block="positions of spiral center $center radius $radius height $height turns $turns||clockwise $clockwise"
    //% center.shadow=mming_coords_inFront
    //% radius.min=1 radius.max=200 radius.defl=5
    //% height.min=2 height.max=384 height.defl=20
    //% turns.min=0.5 turns.max=20 turns.defl=3
    //% clockwise.shadow=toggleOnOff clockwise.defl=true
    //% expandableArgumentMode="toggle"
    //% group="Shapes" weight=80 advanced=true
    export function spiral(center: Position, radius: number, height: number, turns: number, clockwise: boolean = true): Position[] {
        return mmingCore.spiral(center, radius, height, turns, clockwise).toPositions();
    }

    /**
     * Get the positions of a sphere.
     * @param center the center
     * @param radius the radius
     * @param outsideOnly only the outside
     */
    //% blockId=mming_coords_sphere
    //% block="positions of sphere center $center radius $radius||outside only $outsideOnly"
    //% center.shadow=mming_coords_inFront
    //% radius.min=1 radius.max=100 radius.defl=5
    //% outsideOnly.shadow=toggleOnOff outsideOnly.defl=false
    //% expandableArgumentMode="toggle"
    //% group="Shapes" weight=70 advanced=true
    export function sphere(center: Position, radius: number, outsideOnly: boolean = false): Position[] {
        return mmingCore.positionsOf(mmingCore.sphere(center, radius), outsideOnly);
    }

    /**
     * Get the positions of a cylinder.
     * @param center the center of the base
     * @param radius the radius
     * @param height the height
     * @param outsideOnly only the outside
     */
    //% blockId=mming_coords_cylinder
    //% block="positions of cylinder base center $center radius $radius height $height||outside only $outsideOnly"
    //% center.shadow=mming_coords_inFront
    //% radius.min=1 radius.max=100 radius.defl=5
    //% height.min=1 height.max=384 height.defl=10
    //% outsideOnly.shadow=toggleOnOff outsideOnly.defl=false
    //% expandableArgumentMode="toggle"
    //% group="Shapes" weight=60 advanced=true
    export function cylinder(center: Position, radius: number, height: number, outsideOnly: boolean = false): Position[] {
        return mmingCore.positionsOf(mmingCore.cylinder(center, radius, height, false), outsideOnly);
    }

    /**
     * Move every position in a list.
     * @param positions the list of positions
     * @param x how far along X
     * @param y how far up
     * @param z how far along Z
     */
    //% blockId=mming_coords_shift
    //% block="move $positions by x $x y $y z $z"
    //% group="Move and Turn" weight=100 advanced=true
    export function shift(positions: Position[], x: number, y: number, z: number): Position[] {
        const result: Position[] = [];
        for (const p of mmingCore.worldPositions(positions)) {
            result.push(world(p[0] + x, p[1] + y, p[2] + z));
        }
        return result;
    }

    /**
     * Turn every position in a list around a center.
     * @param positions the list of positions
     * @param center the center
     * @param axis the axis to turn around
     * @param degrees the angle in degrees
     */
    //% blockId=mming_coords_rotateAll
    //% block="turn $positions around $center on axis $axis by $degrees degrees"
    //% center.shadow=minecraftCreatePosition
    //% degrees.min=-360 degrees.max=360 degrees.defl=90
    //% group="Move and Turn" weight=90 advanced=true
    export function rotateAll(positions: Position[], center: Position, axis: Axis, degrees: number): Position[] {
        const c = center.toWorld();
        const ox = c.getValue(Axis.X), oy = c.getValue(Axis.Y), oz = c.getValue(Axis.Z);
        const result: Position[] = [];
        for (const p of mmingCore.worldPositions(positions)) {
            result.push(rotateAround(world(p[0], p[1], p[2]), ox, oy, oz, axis, degrees));
        }
        return result;
    }

    /**
     * Place a block at every position in a list.
     * @param block the block to use
     * @param positions the list of positions
     * @param oneByOne place them one at a time, to watch them appear
     */
    //% blockId=mming_coords_place
    //% block="place $block at $positions||one by one $oneByOne"
    //% block.shadow=minecraftBlock
    //% oneByOne.shadow=toggleOnOff oneByOne.defl=false
    //% expandableArgumentMode="toggle"
    //% group="Place" weight=100 advanced=true
    export function place(block: number, positions: Position[], oneByOne: boolean = false): void {
        if (oneByOne) {
            for (const p of positions) blocks.place(block, p);
            return;
        }
        const points = new mmingCore.Points();
        for (const p of mmingCore.worldPositions(positions)) points.add(p[0], p[1], p[2]);
        mmingCore.placePoints(points, block);
    }
}

namespace mmingCore {
    /**
     * 座標リストをワールド座標の整数 [x, y, z] のリストにする。
     * 相対座標はプレイヤーの位置を 1 回だけ調べて足す（1 つずつゲームに問い合わせると遅い）
     */
    export function worldPositions(positions: Position[]): number[][] {
        const result: number[][] = [];
        let origin: Position = null;
        for (const p of positions) {
            if (!p) continue;
            let x = p.getValue(Axis.X), y = p.getValue(Axis.Y), z = p.getValue(Axis.Z);
            if (p.isRelative(Axis.X) || p.isRelative(Axis.Y) || p.isRelative(Axis.Z)) {
                if (!origin) origin = pos(0, 0, 0).toWorld();
                if (p.isRelative(Axis.X)) x += origin.getValue(Axis.X);
                if (p.isRelative(Axis.Y)) y += origin.getValue(Axis.Y);
                if (p.isRelative(Axis.Z)) z += origin.getValue(Axis.Z);
            }
            result.push([Math.floor(x), Math.floor(y), Math.floor(z)]);
        }
        return result;
    }
}
