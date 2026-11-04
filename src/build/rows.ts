// 図形の表し方と、図形どうしの計算（ブロックにはならない）
// 図形は「行」の集まりで表す。行は y と z を決めたときの x の区間 [a0, b0, a1, b1, ...]（昇順）
namespace mmingCore {
    const WORLD_MIN_Y = -64;
    const WORLD_MAX_Y = 319;
    const NO_ROW: number[] = [];

    function clampY(y: number): number {
        return Math.max(WORLD_MIN_Y, Math.min(WORLD_MAX_Y, y));
    }

    /** y・z の範囲にある行の集まり */
    export class Rows {
        y0: number; z0: number; ny: number; nz: number;
        data: number[][];

        constructor(y0: number, y1: number, z0: number, z1: number) {
            this.y0 = y0; this.z0 = z0;
            this.ny = y1 - y0 + 1; this.nz = z1 - z0 + 1;
            this.data = [];
            for (let i = 0; i < this.ny * this.nz; i++) {
                this.data.push(NO_ROW);
                mmingCore.tick(1);
            }
        }

        at(y: number, z: number): number[] {
            const i = y - this.y0, k = z - this.z0;
            if (i < 0 || i >= this.ny || k < 0 || k >= this.nz) return NO_ROW;
            return this.data[i * this.nz + k];
        }

        /** セルの数 */
        count(): number {
            let n = 0;
            for (const row of this.data) {
                for (let i = 0; i < row.length; i += 2) n += row[i + 1] - row[i] + 1;
                mmingCore.tick(1);
            }
            return n;
        }
    }

    /**
     * 図形。ブロックの値として受け渡しする。
     * 行は最初に必要になったときに作る
     */
    export class Shape {
        x0: number; y0: number; z0: number;
        x1: number; y1: number; z1: number;
        /** y と z を決めたときの x の区間を out に足す */
        span: (y: number, z: number, out: number[]) => void;
        /** 外側の判定で見ない軸（平面の図形用）。0=X 1=Y 2=Z、-1 はすべて見る */
        flatAxis: number;
        /** true なら上にふたを付けない */
        openTop: boolean;
        /** true なら下にふたを付けない */
        openBottom: boolean;
        /** 線や曲線の、通る順の点 */
        path: Points;
        private cached: Rows;

        constructor(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number,
            span: (y: number, z: number, out: number[]) => void) {
            this.x0 = x0; this.y0 = y0; this.z0 = z0;
            this.x1 = x1; this.y1 = y1; this.z1 = z1;
            this.span = span;
            this.flatAxis = -1;
            this.openTop = false;
            this.openBottom = false;
            this.path = null;
            this.cached = null;
        }

        /** 行の集まり */
        rows(): Rows {
            if (this.cached) return this.cached;
            const y0 = clampY(this.y0), y1 = clampY(this.y1);
            const rows = new Rows(y0, y1, this.z0, this.z1);
            for (let y = y0; y <= y1; y++) {
                mmingCore.setStep("rows", y - y0, rows.ny);
                for (let z = this.z0; z <= this.z1; z++) {
                    const out: number[] = [];
                    this.span(y, z, out);
                    rows.data[(y - y0) * rows.nz + (z - this.z0)] = out;
                }
                mmingCore.tick(rows.nz);
            }
            this.cached = rows;
            return rows;
        }

        setRows(rows: Rows): void {
            this.cached = rows;
        }
    }

    /** 行の集まりから図形を作る */
    export function shapeOfRows(rows: Rows): Shape {
        let x0 = 0, x1 = -1, found = false;
        for (const row of rows.data) {
            mmingCore.tick(1);
            if (row.length == 0) continue;
            const a = row[0], b = row[row.length - 1];
            if (!found) { x0 = a; x1 = b; found = true; }
            else { x0 = Math.min(x0, a); x1 = Math.max(x1, b); }
        }
        const s = new Shape(x0, rows.y0, rows.z0, x1, rows.y0 + rows.ny - 1, rows.z0 + rows.nz - 1, null);
        s.setRows(rows);
        return s;
    }

    /** 何もない図形（大きさが 0 以下のとき） */
    export function emptyShape(): Shape {
        return shapeOfRows(new Rows(0, -1, 0, -1));
    }

    /** 行に区間 [a, b] を足す */
    export function pushSpan(out: number[], a: number, b: number): void {
        out.push(a);
        out.push(b);
    }

    /** 2 つの行の共通部分 */
    function intersect(a: number[], b: number[]): number[] {
        const out: number[] = [];
        let i = 0, j = 0;
        while (i < a.length && j < b.length) {
            const lo = Math.max(a[i], b[j]), hi = Math.min(a[i + 1], b[j + 1]);
            if (lo <= hi) pushSpan(out, lo, hi);
            if (a[i + 1] < b[j + 1]) i += 2; else j += 2;
        }
        return out;
    }

    /** 2 つの行を合わせる */
    function unite(a: number[], b: number[]): number[] {
        const out: number[] = [];
        let i = 0, j = 0;
        while (i < a.length || j < b.length) {
            let lo: number, hi: number;
            if (j >= b.length || (i < a.length && a[i] <= b[j])) {
                lo = a[i]; hi = a[i + 1]; i += 2;
            } else {
                lo = b[j]; hi = b[j + 1]; j += 2;
            }
            const n = out.length;
            if (n > 0 && lo <= out[n - 1] + 1) out[n - 1] = Math.max(out[n - 1], hi);
            else pushSpan(out, lo, hi);
        }
        return out;
    }

    /** 行 a から行 b を引く */
    export function subtract(a: number[], b: number[]): number[] {
        const out: number[] = [];
        let j = 0;
        for (let i = 0; i < a.length; i += 2) {
            let lo = a[i];
            const hi = a[i + 1];
            while (j < b.length && b[j + 1] < lo) j += 2;
            let k = j;
            while (k < b.length && b[k] <= hi) {
                if (b[k] > lo) pushSpan(out, lo, b[k] - 1);
                lo = Math.max(lo, b[k + 1] + 1);
                k += 2;
            }
            if (lo <= hi) pushSpan(out, lo, hi);
        }
        return out;
    }

    /** 行の両はしを 1 マスずつ削る */
    function erode(a: number[]): number[] {
        const out: number[] = [];
        for (let i = 0; i < a.length; i += 2) {
            if (a[i] + 1 <= a[i + 1] - 1) pushSpan(out, a[i] + 1, a[i + 1] - 1);
        }
        return out;
    }

    /** 内側（6 方向の隣がすべて図形の中のセル）の行を作る */
    export function innerRows(s: Shape): Rows {
        const solid = s.rows();
        const yEnd = solid.y0 + solid.ny - 1;
        const inner = new Rows(solid.y0, yEnd, solid.z0, solid.z0 + solid.nz - 1);
        for (let y = solid.y0; y <= yEnd; y++) {
            for (let z = solid.z0; z < solid.z0 + solid.nz; z++) {
                let row = solid.at(y, z);
                if (row.length == 0) continue;
                if (s.flatAxis != 0) row = erode(row);
                if (s.flatAxis != 1) {
                    if (!(y == yEnd && s.openTop)) row = intersect(row, solid.at(y + 1, z));
                    if (!(y == solid.y0 && s.openBottom)) row = intersect(row, solid.at(y - 1, z));
                }
                if (s.flatAxis != 2) {
                    row = intersect(row, solid.at(y, z + 1));
                    row = intersect(row, solid.at(y, z - 1));
                }
                inner.data[(y - solid.y0) * solid.nz + (z - solid.z0)] = row;
            }
            mmingCore.tick(solid.nz);
        }
        return inner;
    }

    /** 2 つの図形を行ごとに計算する。operation は 0=和 1=差 2=積 */
    function combine(a: Shape, b: Shape, operation: number): Shape {
        const ra = a.rows(), rb = b.rows();
        const y0 = Math.min(ra.y0, rb.y0), y1 = Math.max(ra.y0 + ra.ny, rb.y0 + rb.ny) - 1;
        const z0 = Math.min(ra.z0, rb.z0), z1 = Math.max(ra.z0 + ra.nz, rb.z0 + rb.nz) - 1;
        const rows = new Rows(y0, y1, z0, z1);
        for (let y = y0; y <= y1; y++) {
            for (let z = z0; z <= z1; z++) {
                const p = ra.at(y, z), q = rb.at(y, z);
                let row: number[];
                if (operation == 0) row = unite(p, q);
                else if (operation == 1) row = subtract(p, q);
                else row = intersect(p, q);
                rows.data[(y - y0) * rows.nz + (z - z0)] = row;
            }
            mmingCore.tick(rows.nz);
        }
        return shapeOfRows(rows);
    }

    export function unionShape(a: Shape, b: Shape): Shape { return combine(a, b, 0); }
    export function differenceShape(a: Shape, b: Shape): Shape { return combine(a, b, 1); }
    export function intersectionShape(a: Shape, b: Shape): Shape { return combine(a, b, 2); }

    /** 図形をずらす */
    export function moveShape(s: Shape, dx: number, dy: number, dz: number): Shape {
        const src = s.rows();
        const rows = new Rows(src.y0 + dy, src.y0 + src.ny - 1 + dy, src.z0 + dz, src.z0 + src.nz - 1 + dz);
        for (let i = 0; i < src.data.length; i++) {
            const row = src.data[i];
            mmingCore.tick(1);
            if (row.length == 0) continue;
            const moved: number[] = [];
            for (let k = 0; k < row.length; k++) moved.push(row[k] + dx);
            rows.data[i] = moved;
        }
        const result = shapeOfRows(rows);
        result.flatAxis = s.flatAxis;
        result.openTop = s.openTop;
        result.openBottom = s.openBottom;
        if (s.path) {
            const path = new Points();
            for (let k = 0; k < s.path.count(); k++) path.add(s.path.xs[k] + dx, s.path.ys[k] + dy, s.path.zs[k] + dz);
            result.path = path;
        }
        return result;
    }

    /** 図形の、軸方向で from〜to 段目（端から 0 始まり）の部分だけを取り出す */
    export function sliceShape(s: Shape, axis: Axis, from: number, to: number): Shape {
        const src = s.rows();
        const rows = new Rows(src.y0, src.y0 + src.ny - 1, src.z0, src.z0 + src.nz - 1);
        const lo = Math.min(from, to), hi = Math.max(from, to);
        const keep = [s.x0 + lo, s.x0 + hi];
        for (let y = 0; y < src.ny; y++) {
            for (let z = 0; z < src.nz; z++) {
                const row = src.data[y * src.nz + z];
                if (row.length == 0) continue;
                const k = axis == Axis.Y ? y : z;
                let out = row;
                if (axis == Axis.X) out = intersect(row, keep);
                else if (k < lo || k > hi) continue;
                rows.data[y * src.nz + z] = out;
            }
            mmingCore.tick(src.nz);
        }
        return shapeOfRows(rows);
    }

    /**
     * 図形を軸方向の段で分ける。
     * @returns count 個の行の集まり。段は thickness 段ごとに 0, 1, ... と順に割り当てる
     */
    export function layersOf(s: Shape, axis: Axis, thickness: number, count: number): Rows[] {
        const src = s.rows();
        const result: Rows[] = [];
        for (let c = 0; c < count; c++) result.push(new Rows(src.y0, src.y0 + src.ny - 1, src.z0, src.z0 + src.nz - 1));
        const t = Math.max(1, Math.floor(thickness));
        const groupOf = (k: number) => Math.floor(k / t) % count;
        for (let y = 0; y < src.ny; y++) {
            for (let z = 0; z < src.nz; z++) {
                const i = y * src.nz + z;
                const row = src.data[i];
                if (row.length == 0) continue;
                if (axis == Axis.X) {
                    for (let k = 0; k < row.length; k += 2) {
                        let a = row[k];
                        while (a <= row[k + 1]) {
                            const g = groupOf(a - s.x0);
                            const end = Math.min(row[k + 1], a + t - 1 - (a - s.x0) % t);
                            let out: number[] = result[g].data[i];
                            if (out === NO_ROW) out = [];
                            pushSpan(out, a, end);
                            result[g].data[i] = out;
                            a = end + 1;
                        }
                    }
                } else {
                    result[groupOf(axis == Axis.Y ? y : z)].data[i] = row;
                }
            }
            mmingCore.tick(src.nz);
        }
        return result;
    }

    // ==============================
    // 点の集まり（線・曲線・螺旋・座標リスト）
    // ==============================

    /** 整数座標の点の集まり（続けて同じ点は足さない） */
    export class Points {
        xs: number[];
        ys: number[];
        zs: number[];

        constructor() {
            this.xs = [];
            this.ys = [];
            this.zs = [];
        }

        add(x: number, y: number, z: number): void {
            const n = this.xs.length;
            if (n > 0 && this.xs[n - 1] == x && this.ys[n - 1] == y && this.zs[n - 1] == z) return;
            this.xs.push(x);
            this.ys.push(y);
            this.zs.push(z);
            mmingCore.tick(1);
        }

        /** 前の点から線でつないで、すき間なく足す */
        lineTo(x: number, y: number, z: number): void {
            const n = this.xs.length;
            if (n == 0) this.add(x, y, z);
            else addLine(this, this.xs[n - 1], this.ys[n - 1], this.zs[n - 1], x, y, z);
        }

        count(): number {
            return this.xs.length;
        }

        toPositions(): Position[] {
            const result: Position[] = [];
            for (let i = 0; i < this.xs.length; i++) {
                result.push(world(this.xs[i], this.ys[i], this.zs[i]));
                mmingCore.tick(1);
            }
            return result;
        }
    }

    /** 3D の Bresenham で 2 点間を結ぶ（両端を含む） */
    export function addLine(points: Points, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number): void {
        const dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
        const dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
        const dz = Math.abs(z1 - z0), sz = z0 < z1 ? 1 : -1;
        const dm = Math.max(dx, Math.max(dy, dz));
        let ex = Math.floor(dm / 2), ey = ex, ez = ex;
        let x = x0, y = y0, z = z0;
        for (let i = 0; i <= dm; i++) {
            points.add(x, y, z);
            ex -= dx; if (ex < 0) { ex += dm; x += sx; }
            ey -= dy; if (ey < 0) { ey += dm; y += sy; }
            ez -= dz; if (ez < 0) { ez += dm; z += sz; }
        }
    }

    /** 昇順に x を差し込む（同じ値は入れない） */
    function insertX(xs: number[], x: number): void {
        let i = xs.length;
        xs.push(x);
        while (i > 0 && xs[i - 1] > x) {
            xs[i] = xs[i - 1];
            i--;
        }
        xs[i] = x;
    }

    /** 点の集まりから図形を作る（通る順も残す） */
    export function shapeOfPoints(points: Points): Shape {
        const n = points.count();
        if (n == 0) return emptyShape();
        let y0 = points.ys[0], y1 = y0, z0 = points.zs[0], z1 = z0;
        for (let i = 1; i < n; i++) {
            y0 = Math.min(y0, points.ys[i]); y1 = Math.max(y1, points.ys[i]);
            z0 = Math.min(z0, points.zs[i]); z1 = Math.max(z1, points.zs[i]);
        }
        mmingCore.tick(n);
        y0 = clampY(y0); y1 = clampY(y1);
        const rows = new Rows(y0, y1, z0, z1);
        for (let i = 0; i < n; i++) {
            const y = points.ys[i];
            if (y < y0 || y > y1) continue;
            const k = (y - y0) * rows.nz + (points.zs[i] - z0);
            if (rows.data[k] === NO_ROW) rows.data[k] = [];
            insertX(rows.data[k], points.xs[i]);
            mmingCore.tick(1);
        }
        // x を続いているものごとに区間にまとめる
        for (let k = 0; k < rows.data.length; k++) {
            const xs = rows.data[k];
            if (xs.length == 0) continue;
            const row: number[] = [];
            let a = xs[0], b = xs[0];
            for (let i = 1; i < xs.length; i++) {
                if (xs[i] <= b + 1) b = xs[i];
                else { pushSpan(row, a, b); a = xs[i]; b = xs[i]; }
            }
            pushSpan(row, a, b);
            rows.data[k] = row;
            mmingCore.tick(xs.length);
        }
        const s = shapeOfRows(rows);
        s.path = points;
        return s;
    }

    /** 図形の座標リスト。線や曲線は通る順に返す */
    export function positionsOf(s: Shape): Position[] {
        if (s.path) return s.path.toPositions();
        const rows = s.rows();
        const result: Position[] = [];
        for (let i = 0; i < rows.data.length; i++) {
            const row = rows.data[i];
            const y = rows.y0 + Math.floor(i / rows.nz), z = rows.z0 + i % rows.nz;
            for (let k = 0; k < row.length; k += 2) {
                for (let x = row[k]; x <= row[k + 1]; x++) result.push(world(x, y, z));
                mmingCore.tick(row[k + 1] - row[k] + 1);
            }
        }
        return result;
    }

    /**
     * 座標リストを点の集まりにする。
     * 相対座標はプレイヤーの位置を 1 回だけ調べて足す（1 つずつゲームに問い合わせると遅い）
     */
    export function pointsOfPositions(positions: Position[]): Points {
        const points = new Points();
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
            points.add(Math.floor(x), Math.floor(y), Math.floor(z));
        }
        return points;
    }
}
