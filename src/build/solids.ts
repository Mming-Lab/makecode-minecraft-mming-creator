// 図形の定義（ブロックにはならない）
// 座標は相対座標でもよい。入口でワールド座標に直す。大きさが 0 以下のときは null を返す
namespace mmingCore {

    /** √v の整数部（v が負なら -1） */
    function isqrt(v: number): number {
        return v < 0 ? -1 : Math.floor(Math.sqrt(v));
    }

    /** 中心から x 方向に half だけの区間を足す */
    function pushHalf(out: number[], cx: number, half: number): void {
        if (half >= 0) mmingCore.pushSpan(out, cx - half, cx + half);
    }

    /** 中身の直方体 */
    export function box(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number): mmingCore.Shape {
        return new mmingCore.Shape(x0, y0, z0, x1, y1, z1, (y, z, out) => {
            mmingCore.pushSpan(out, x0, x1);
        });
    }

    /** 底の中心から上へ、たて・よこ・高さの直方体 */
    export function boxAt(center: Position, width: number, depth: number, height: number): mmingCore.Shape {
        const w = Math.round(width), d = Math.round(depth), h = Math.round(height);
        if (!(w >= 1 && d >= 1 && h >= 1)) return null;
        const c = mmingCore.blockXYZ(center);
        const x0 = c[0] - Math.idiv(w, 2), z0 = c[2] - Math.idiv(d, 2);
        return box(x0, c[1], z0, x0 + w - 1, c[1] + h - 1, z0 + d - 1);
    }

    /** 2 つの角で決まる直方体 */
    export function boxBetween(corner1: Position, corner2: Position): mmingCore.Shape {
        const a = mmingCore.blockXYZ(corner1), b = mmingCore.blockXYZ(corner2);
        return box(Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.min(a[2], b[2]),
            Math.max(a[0], b[0]), Math.max(a[1], b[1]), Math.max(a[2], b[2]));
    }

    /** 球 */
    export function sphere(center: Position, radius: number): mmingCore.Shape {
        if (!(radius > 0)) return null;
        const c = mmingCore.blockXYZ(center);
        const cx = c[0], cy = c[1], cz = c[2];
        const r = Math.ceil(radius), rr = radius * radius;
        return new mmingCore.Shape(cx - r, cy - r, cz - r, cx + r, cy + r, cz + r, (y, z, out) => {
            const dy = y - cy, dz = z - cz;
            pushHalf(out, cx, isqrt(rr - dy * dy - dz * dz));
        });
    }

    /** ドーム（球の上半分。中心の高さが床になる） */
    export function dome(center: Position, radius: number, openBottom: boolean): mmingCore.Shape {
        if (!(radius > 0)) return null;
        const c = mmingCore.blockXYZ(center);
        const cx = c[0], cy = c[1], cz = c[2];
        const r = Math.ceil(radius), rr = radius * radius;
        const s = new mmingCore.Shape(cx - r, cy, cz - r, cx + r, cy + r, cz + r, (y, z, out) => {
            const dy = y - cy, dz = z - cz;
            pushHalf(out, cx, isqrt(rr - dy * dy - dz * dz));
        });
        s.openBottom = openBottom;
        return s;
    }

    /** たまご形（楕円体） */
    export function egg(center: Position, radiusX: number, radiusY: number, radiusZ: number): mmingCore.Shape {
        if (!(radiusX > 0 && radiusY > 0 && radiusZ > 0)) return null;
        const c = mmingCore.blockXYZ(center);
        const cx = c[0], cy = c[1], cz = c[2];
        const rx = Math.ceil(radiusX), ry = Math.ceil(radiusY), rz = Math.ceil(radiusZ);
        return new mmingCore.Shape(cx - rx, cy - ry, cz - rz, cx + rx, cy + ry, cz + rz, (y, z, out) => {
            const dy = (y - cy) / radiusY, dz = (z - cz) / radiusZ;
            const rest = 1 - dy * dy - dz * dz;
            if (rest >= 0) pushHalf(out, cx, Math.floor(radiusX * Math.sqrt(rest)));
        });
    }

    /** 高さごとに半径が変わる丸い立体の共通部品 */
    function round(center: Position, height: number, maxRadius: number, radiusAt: (k: number) => number): mmingCore.Shape {
        const h = Math.round(height);
        if (!(h >= 1 && maxRadius > 0)) return null;
        const c = mmingCore.blockXYZ(center);
        const cx = c[0], cy = c[1], cz = c[2];
        const r = Math.ceil(maxRadius);
        return new mmingCore.Shape(cx - r, cy, cz - r, cx + r, cy + h - 1, cz + r, (y, z, out) => {
            const rad = radiusAt(y - cy), dz = z - cz;
            pushHalf(out, cx, isqrt(rad * rad - dz * dz));
        });
    }

    /** 円柱（底の中心から上へ） */
    export function cylinder(center: Position, radius: number, height: number, open: boolean): mmingCore.Shape {
        const s = round(center, height, radius, (k) => radius);
        if (s) { s.openTop = open; s.openBottom = open; }
        return s;
    }

    /** 円すい（いちばん上が 1 ブロックのとがった先になる） */
    export function cone(center: Position, radius: number, height: number, openBottom: boolean): mmingCore.Shape {
        const h = Math.round(height);
        const s = round(center, height, radius, (k) => h <= 1 ? radius : radius * (h - 1 - k) / (h - 1));
        if (s) s.openBottom = openBottom;
        return s;
    }

    /** おわん形（下が 1 ブロックで、いちばん上が指定した半径。上は開いている） */
    export function bowl(center: Position, radius: number, height: number): mmingCore.Shape {
        const h = Math.round(height);
        const s = round(center, height, radius, (k) => h <= 1 ? radius : radius * Math.sqrt(k / (h - 1)));
        if (s) s.openTop = true;
        return s;
    }

    /** くびれタワー（上下のはしが endRadius、まん中が waistRadius） */
    export function waist(center: Position, endRadius: number, waistRadius: number, height: number): mmingCore.Shape {
        const h = Math.round(height);
        const a = Math.max(0, waistRadius);
        const m = (h - 1) / 2;
        return round(center, height, Math.max(endRadius, a), (k) => {
            const t = m > 0 ? (k - m) / m : 0;
            return Math.sqrt(a * a + (endRadius * endRadius - a * a) * t * t);
        });
    }

    /**
     * 正多角形の断面で、高さごとに大きさが変わる柱の共通部品（角柱・角すい）
     * @param scaleAt 下から k 段目の大きさ（1 が底と同じ）
     */
    function polygon(center: Position, sides: number, radius: number, height: number, scaleAt: (k: number) => number): mmingCore.Shape {
        const n = Math.round(sides), h = Math.round(height);
        if (!(n >= 3 && h >= 1 && radius > 0)) return null;
        const c = mmingCore.blockXYZ(center);
        const cx = c[0], cy = c[1], cz = c[2];
        const r = Math.ceil(radius);
        // 辺ごとの外向きの向き。n=4 のときは辺が軸に平行になる
        const start = n == 4 ? 0 : -Math.PI / 2 + Math.PI / n;
        const nxs: number[] = [], nzs: number[] = [];
        for (let i = 0; i < n; i++) {
            const angle = 2 * Math.PI * i / n + start;
            nxs.push(Math.cos(angle));
            nzs.push(Math.sin(angle));
        }
        const apothem = (n == 4 ? radius : radius * Math.cos(Math.PI / n));
        return new mmingCore.Shape(cx - r, cy, cz - r, cx + r, cy + h - 1, cz + r, (y, z, out) => {
            const limit = apothem * scaleAt(y - cy) + 1e-9;
            const dz = z - cz;
            // x の範囲を、辺ごとの条件 dx*nx + dz*nz <= limit で絞る
            let lo = -r, hi = r;
            for (let i = 0; i < n; i++) {
                const nx = nxs[i], rest = limit - dz * nzs[i];
                if (Math.abs(nx) < 1e-9) {
                    if (rest < 0) return;
                } else if (nx > 0) {
                    hi = Math.min(hi, Math.floor(rest / nx));
                } else {
                    lo = Math.max(lo, Math.ceil(rest / nx));
                }
            }
            if (lo <= hi) mmingCore.pushSpan(out, cx + lo, cx + hi);
        });
    }

    /** 角柱（半径は中心から角までの長さ。四角柱だけは中心から辺までの長さ） */
    export function prism(center: Position, sides: number, radius: number, height: number, open: boolean): mmingCore.Shape {
        const s = polygon(center, sides, radius, height, (k) => 1);
        if (s) { s.openTop = open; s.openBottom = open; }
        return s;
    }

    /** 角すい（底の中心から上へ。いちばん上がとがった先になる） */
    export function pyramid(center: Position, sides: number, radius: number, height: number, openBottom: boolean): mmingCore.Shape {
        const h = Math.round(height);
        const s = polygon(center, sides, radius, height, (k) => h <= 1 ? 1 : (h - 1 - k) / (h - 1));
        if (s) s.openBottom = openBottom;
        return s;
    }

    /** ドーナツ（中心を通る水平な輪） */
    export function donut(center: Position, ringRadius: number, thickness: number): mmingCore.Shape {
        if (!(ringRadius > 0 && thickness > 0)) return null;
        const c = mmingCore.blockXYZ(center);
        const cx = c[0], cy = c[1], cz = c[2];
        const outer = Math.ceil(ringRadius + thickness), t = Math.ceil(thickness);
        const tt = thickness * thickness;
        return new mmingCore.Shape(cx - outer, cy - t, cz - outer, cx + outer, cy + t, cz + outer, (y, z, out) => {
            const dy = y - cy, dz = z - cz;
            const rest = tt - dy * dy;
            if (rest < 0) return;
            const s = Math.sqrt(rest);
            const o = ringRadius + s, i = ringRadius - s;
            const outerHalf = isqrt(o * o - dz * dz);
            if (outerHalf < 0) return;
            if (i <= 0 || i * i - dz * dz <= 0) {
                pushHalf(out, cx, outerHalf);
                return;
            }
            // 真ん中に穴があるので 2 つの区間になる
            const hole = Math.ceil(Math.sqrt(i * i - dz * dz));
            if (hole > outerHalf) return;
            mmingCore.pushSpan(out, cx - outerHalf, cx - hole);
            mmingCore.pushSpan(out, cx + hole, cx + outerHalf);
        });
    }

    /** 円（平面。orientation の軸に垂直な面にかく） */
    export function circle(center: Position, radius: number, orientation: Axis): mmingCore.Shape {
        if (!(radius > 0)) return null;
        const c = mmingCore.blockXYZ(center);
        const cx = c[0], cy = c[1], cz = c[2];
        const r = Math.ceil(radius), rr = radius * radius;
        let s: mmingCore.Shape;
        if (orientation == Axis.X) {
            s = new mmingCore.Shape(cx, cy - r, cz - r, cx, cy + r, cz + r, (y, z, out) => {
                const dy = y - cy, dz = z - cz;
                if (dy * dy + dz * dz <= rr) mmingCore.pushSpan(out, cx, cx);
            });
            s.flatAxis = 0;
        } else if (orientation == Axis.Z) {
            s = new mmingCore.Shape(cx - r, cy - r, cz, cx + r, cy + r, cz, (y, z, out) => {
                const dy = y - cy;
                pushHalf(out, cx, isqrt(rr - dy * dy));
            });
            s.flatAxis = 2;
        } else {
            s = new mmingCore.Shape(cx - r, cy, cz - r, cx + r, cy, cz + r, (y, z, out) => {
                const dz = z - cz;
                pushHalf(out, cx, isqrt(rr - dz * dz));
            });
            s.flatAxis = 1;
        }
        return s;
    }

    /** チューブ（2 点を結ぶ太い線。はしは丸くなる） */
    export function tube(p0: Position, p1: Position, radius: number): mmingCore.Shape {
        if (!(radius > 0)) return null;
        const a = mmingCore.blockXYZ(p0), b = mmingCore.blockXYZ(p1);
        const ax = a[0], ay = a[1], az = a[2];
        const vx = b[0] - ax, vy = b[1] - ay, vz = b[2] - az;
        const len2 = vx * vx + vy * vy + vz * vz;
        const r = Math.ceil(radius), rr = radius * radius;
        const x0 = Math.min(ax, b[0]) - r, x1 = Math.max(ax, b[0]) + r;
        return new mmingCore.Shape(x0, Math.min(ay, b[1]) - r, Math.min(az, b[2]) - r, x1,
            Math.max(ay, b[1]) + r, Math.max(az, b[2]) + r, (y, z, out) => {
                let start = 0, inside = false;
                for (let x = x0; x <= x1 + 1; x++) {
                    let hit = false;
                    if (x <= x1) {
                        let t = len2 > 0 ? ((x - ax) * vx + (y - ay) * vy + (z - az) * vz) / len2 : 0;
                        t = Math.max(0, Math.min(1, t));
                        const dx = x - (ax + vx * t), dy = y - (ay + vy * t), dz = z - (az + vz * t);
                        hit = dx * dx + dy * dy + dz * dz <= rr;
                    }
                    if (hit && !inside) { start = x; inside = true; }
                    if (!hit && inside) { mmingCore.pushSpan(out, start, x - 1); inside = false; }
                }
                mmingCore.tick(x1 - x0 + 2);
            });
    }

    // ==============================
    // 点の集まりで作る形
    // ==============================

    /** 線 */
    export function line(p0: Position, p1: Position): mmingCore.Points {
        const a = mmingCore.blockXYZ(p0), b = mmingCore.blockXYZ(p1);
        const points = new mmingCore.Points();
        mmingCore.addLine(points, a[0], a[1], a[2], b[0], b[1], b[2]);
        return points;
    }

    /** らせん（底の中心から上へ height 段。clockwise は上から見て時計回り） */
    export function spiral(center: Position, radius: number, height: number, turns: number, clockwise: boolean): mmingCore.Points {
        const points = new mmingCore.Points();
        const h = Math.round(height);
        if (!(radius > 0 && h >= 1)) return points;
        const c = mmingCore.blockXYZ(center);
        const direction = clockwise ? 1 : -1;
        const arc = 2 * Math.PI * radius * Math.abs(turns);
        const steps = Math.max(h * 2, Math.ceil(Math.sqrt(arc * arc + h * h)) * 2);
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const angle = 2 * Math.PI * turns * t * direction;
            points.lineTo(
                c[0] + Math.round(radius * Math.cos(angle)),
                c[1] + Math.round((h - 1) * t),
                c[2] + Math.round(radius * Math.sin(angle)));
        }
        return points;
    }

    /** なめらかな曲線（ベジェ曲線。引っぱる点はいくつでもよい） */
    export function curve(from: Position, to: Position, pullPoints: Position[]): mmingCore.Points {
        const all: Position[] = [from];
        for (let i = 0; i < pullPoints.length; i++) all.push(pullPoints[i]);
        all.push(to);
        const n = all.length - 1;
        const px: number[] = [], py: number[] = [], pz: number[] = [];
        for (const p of all) {
            const b = mmingCore.blockXYZ(p);
            px.push(b[0]); py.push(b[1]); pz.push(b[2]);
        }
        const coeff: number[] = [];
        for (let i = 0; i <= n; i++) {
            let v = 1;
            for (let j = 0; j < i; j++) v = v * (n - j) / (j + 1);
            coeff.push(v);
        }
        // 制御点を結んだ折れ線の長さで分割数を決め、線でつないですき間をなくす
        let length = 0;
        for (let i = 1; i <= n; i++) {
            const dx = px[i] - px[i - 1], dy = py[i] - py[i - 1], dz = pz[i] - pz[i - 1];
            length += Math.sqrt(dx * dx + dy * dy + dz * dz);
        }
        const steps = Math.max(1, Math.ceil(length));
        const points = new mmingCore.Points();
        for (let s = 0; s <= steps; s++) {
            const t = s / steps;
            let x = 0, y = 0, z = 0;
            for (let i = 0; i <= n; i++) {
                const b = coeff[i] * Math.pow(1 - t, n - i) * Math.pow(t, i);
                x += b * px[i]; y += b * py[i]; z += b * pz[i];
            }
            points.lineTo(Math.round(x), Math.round(y), Math.round(z));
        }
        return points;
    }
}
