// 「座標」カテゴリのブロック

//% block="Coordinates" weight=97 color=#4CAF50 icon="" advanced=true
//% groups='["Positions","Lists"]'
namespace mmingCoords {

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
     * A positive angle turns counterclockwise when you look from the + side of the axis.
     * @param position the position to rotate
     * @param center the center
     * @param axis the axis of rotation
     * @param degrees the angle in degrees
     */
    //% blockId=mming_coords_rotate
    //% block="rotate $position around $center on axis $axis by $degrees degrees"
    //% position.shadow=minecraftCreatePosition
    //% center.shadow=minecraftCreatePosition
    //% degrees.min=-360 degrees.max=360 degrees.defl=90
    //% group="Positions" weight=90
    export function rotate(position: Position, center: Position, axis: Axis, degrees: number): Position {
        const c = center.toWorld();
        return rotateAround(position.toWorld(), c.getValue(Axis.X), c.getValue(Axis.Y), c.getValue(Axis.Z), axis, degrees);
    }

    /**
     * Move every position in a list.
     * @param positions the list of positions
     * @param x how far along X
     * @param y how far along Y
     * @param z how far along Z
     */
    //% blockId=mming_coords_shift
    //% block="shift $positions by x $x y $y z $z"
    //% group="Lists" weight=100
    export function shift(positions: Position[], x: number, y: number, z: number): Position[] {
        const points = mmingCore.pointsOfPositions(positions);
        const result: Position[] = [];
        for (let i = 0; i < points.count(); i++) {
            result.push(world(points.xs[i] + x, points.ys[i] + y, points.zs[i] + z));
            mmingCore.tick(1);
        }
        return result;
    }

    /**
     * Rotate every position in a list around a center.
     * @param positions the list of positions
     * @param center the center
     * @param axis the axis of rotation
     * @param degrees the angle in degrees
     */
    //% blockId=mming_coords_rotateAll
    //% block="rotate all $positions around $center on axis $axis by $degrees degrees"
    //% center.shadow=minecraftCreatePosition
    //% degrees.min=-360 degrees.max=360 degrees.defl=90
    //% group="Lists" weight=90
    export function rotateAll(positions: Position[], center: Position, axis: Axis, degrees: number): Position[] {
        const c = center.toWorld();
        const ox = c.getValue(Axis.X), oy = c.getValue(Axis.Y), oz = c.getValue(Axis.Z);
        const points = mmingCore.pointsOfPositions(positions);
        const result: Position[] = [];
        for (let i = 0; i < points.count(); i++) {
            result.push(rotateAround(world(points.xs[i], points.ys[i], points.zs[i]), ox, oy, oz, axis, degrees));
            mmingCore.tick(1);
        }
        return result;
    }

    /**
     * Turn a shape into a list of positions. Lines and curves keep their order.
     * @param shape the shape
     */
    //% blockId=mming_coords_toPositions
    //% block="positions of $shape"
    //% group="Lists" weight=80
    export function toPositions(shape: mmingCore.Shape): Position[] {
        return mmingCore.positionsOf(shape);
    }

    /**
     * Turn a list of positions into a shape.
     * @param positions the list of positions
     */
    //% blockId=mming_coords_fromPositions
    //% block="shape from $positions"
    //% group="Lists" weight=70
    export function fromPositions(positions: Position[]): mmingCore.Shape {
        return mmingCore.shapeOfPoints(mmingCore.pointsOfPositions(positions));
    }
}
