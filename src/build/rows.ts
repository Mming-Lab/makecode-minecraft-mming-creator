// 図形の表し方と、セルの集まりを直方体に分ける処理（ブロックにはならない）
// 図形は「行」の集まりで表す。行は y と z を決めたときの x の区間 [a0, b0, a1, b1, ...]（昇順）
namespace mmingCore {
    /** /fill 1 回で置ける最大ブロック数 */
    export const FILL_LIMIT = 32768;
    const WORLD_MIN_Y = -64;
    const WORLD_MAX_Y = 319;
    /** 行の並べ方を 2 通り試す上限の行数（これより多いと計算が長くなる） */
    const TRY_BOTH_ORDERS_ROWS = 10000;

    /** 図形 = 外接直方体（ワールド座標の整数）＋ 行ごとの x の区間 */
    export class Shape {
        x0: number; y0: number; z0: number;
        x1: number; y1: number; z1: number;
        /** y と z を決めたときの x の区間を out に足す */
        span: (y: number, z: number, out: number[]) => void;
        /** 殻の判定で見ない軸（平面の図形用）。0=X 1=Y 2=Z、-1 はすべて見る */
        flatAxis: number;
        /** true なら上にふたを付けない */
        openTop: boolean;
        /** true なら下にふたを付けない */
        openBottom: boolean;

        constructor(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number,
            span: (y: number, z: number, out: number[]) => void) {
            this.x0 = x0; this.y0 = y0; this.z0 = z0;
            this.x1 = x1; this.y1 = y1; this.z1 = z1;
            this.span = span;
            this.flatAxis = -1;
            this.openTop = false;
            this.openBottom = false;
        }
    }

    const NO_ROW: number[] = [];

    /** y・z の範囲にある行の集まり */
    export class Rows {
        y0: number; z0: number; ny: number; nz: number;
        data: number[][];

        constructor(y0: number, y1: number, z0: number, z1: number) {
            this.y0 = y0; this.z0 = z0;
            this.ny = y1 - y0 + 1; this.nz = z1 - z0 + 1;
            this.data = [];
            for (let i = 0; i < this.ny * this.nz; i++) this.data.push(NO_ROW);
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
            }
            return n;
        }
    }

    function clampY(y: number): number {
        return Math.max(WORLD_MIN_Y, Math.min(WORLD_MAX_Y, y));
    }

    /** 図形を行の集まりにする */
    export function rowsOf(s: Shape): Rows {
        const y0 = clampY(s.y0), y1 = clampY(s.y1);
        const rows = new Rows(y0, y1, s.z0, s.z1);
        for (let y = y0; y <= y1; y++) {
            for (let z = s.z0; z <= s.z1; z++) {
                const out: number[] = [];
                s.span(y, z, out);
                rows.data[(y - y0) * rows.nz + (z - s.z0)] = out;
            }
            mmingCore.tick(rows.nz);
        }
        return rows;
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

    /** 行 a から行 b を引く */
    function subtract(a: number[], b: number[]): number[] {
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
    export function innerRows(s: Shape, solid: Rows): Rows {
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

    /** 外側（殻）の行を作る: 中身 − 内側 */
    export function shellRows(solid: Rows, inner: Rows): Rows {
        const shell = new Rows(solid.y0, solid.y0 + solid.ny - 1, solid.z0, solid.z0 + solid.nz - 1);
        for (let i = 0; i < solid.data.length; i++) {
            shell.data[i] = subtract(solid.data[i], inner.data[i]);
        }
        mmingCore.tick(solid.data.length);
        return shell;
    }

    // ==============================
    // 直方体に分ける
    // ==============================

    /** 行が区間 [a, b] をまるごと含むか */
    function rowHas(row: number[], a: number, b: number): boolean {
        for (let i = 0; i < row.length; i += 2) {
            if (row[i] <= a && b <= row[i + 1]) return true;
        }
        return false;
    }

    /** box の外側の 1 層（axis=1 は y=c、axis=2 は z=c）がすべて図形の中か */
    function layerOk(rows: Rows, box: number[], axis: number, c: number): boolean {
        if (axis == 1) {
            for (let z = box[4]; z <= box[5]; z++) {
                if (!rowHas(rows.at(c, z), box[0], box[1])) return false;
            }
        } else {
            for (let y = box[2]; y <= box[3]; y++) {
                if (!rowHas(rows.at(y, c), box[0], box[1])) return false;
            }
        }
        mmingCore.tick(box[3] - box[2] + box[5] - box[4] + 2);
        return true;
    }

    /** box を axis 方向（1=y、2=z）の両側へ交互に広げる */
    function extend(rows: Rows, box: number[], axis: number, maxLen: number): void {
        let low = true, high = true;
        while (low || high) {
            const width = box[1] - box[0] + 1;
            const height = box[3] - box[2] + 1;
            const depth = box[5] - box[4] + 1;
            const face = axis == 1 ? width * depth : width * height;
            const len = axis == 1 ? height : depth;
            if (len >= maxLen || face * (len + 1) > FILL_LIMIT) return;
            if (low) {
                if (layerOk(rows, box, axis, box[axis * 2] - 1)) box[axis * 2]--; else low = false;
            }
            const len2 = axis == 1 ? box[3] - box[2] + 1 : box[5] - box[4] + 1;
            if (len2 >= maxLen || face * (len2 + 1) > FILL_LIMIT) return;
            if (high) {
                if (layerOk(rows, box, axis, box[axis * 2 + 1] + 1)) box[axis * 2 + 1]++; else high = false;
            }
        }
    }

    /** x を起点の両側へ、box のすべての行に含まれる範囲まで広げる */
    function extendX(rows: Rows, box: number[], sx: number, maxLen: number): void {
        let lo = -1000000000, hi = 1000000000;
        for (let y = box[2]; y <= box[3]; y++) {
            for (let z = box[4]; z <= box[5]; z++) {
                const row = rows.at(y, z);
                for (let i = 0; i < row.length; i += 2) {
                    if (row[i] <= sx && sx <= row[i + 1]) {
                        lo = Math.max(lo, row[i]);
                        hi = Math.min(hi, row[i + 1]);
                        break;
                    }
                }
            }
            mmingCore.tick(box[5] - box[4] + 1);
        }
        const area = (box[3] - box[2] + 1) * (box[5] - box[4] + 1);
        const limit = Math.min(maxLen, Math.floor(FILL_LIMIT / area));
        if (hi - lo + 1 > limit) {
            if (sx - lo + 1 > limit) lo = sx;
            hi = Math.min(hi, lo + limit - 1);
        }
        box[0] = lo;
        box[1] = hi;
    }

    /** 起点のセルから直方体を作る。order=0 は x→y→z、1 は z→y→x の順に広げる */
    function grow(rows: Rows, sx: number, y: number, z: number, order: number, maxXZ: number): number[] {
        const box = [sx, sx, y, y, z, z];
        if (order == 0) {
            extendX(rows, box, sx, maxXZ);
            extend(rows, box, 1, 100000);
            extend(rows, box, 2, maxXZ);
        } else {
            extend(rows, box, 2, maxXZ);
            extend(rows, box, 1, 100000);
            extendX(rows, box, sx, maxXZ);
        }
        return box;
    }

    /** box の中で、まだ置いていないセルの数 */
    function countFree(free: Rows, box: number[]): number {
        let n = 0;
        for (let y = box[2]; y <= box[3]; y++) {
            for (let z = box[4]; z <= box[5]; z++) {
                const row = free.at(y, z);
                for (let i = 0; i < row.length; i += 2) {
                    const lo = Math.max(row[i], box[0]), hi = Math.min(row[i + 1], box[1]);
                    if (lo <= hi) n += hi - lo + 1;
                }
            }
            mmingCore.tick(box[5] - box[4] + 1);
        }
        return n;
    }

    function cutBox(free: Rows, box: number[]): void {
        const cut = [box[0], box[1]];
        for (let y = box[2]; y <= box[3]; y++) {
            for (let z = box[4]; z <= box[5]; z++) {
                const i = (y - free.y0) * free.nz + (z - free.z0);
                if (free.data[i].length > 0) free.data[i] = subtract(free.data[i], cut);
            }
            mmingCore.tick(box[5] - box[4] + 1);
        }
    }

    function coverInOrder(rows: Rows, order: number[], maxXZ: number): number[][] {
        const free = new Rows(rows.y0, rows.y0 + rows.ny - 1, rows.z0, rows.z0 + rows.nz - 1);
        for (let i = 0; i < rows.data.length; i++) free.data[i] = rows.data[i];
        const boxes: number[][] = [];
        for (const r of order) {
            const y = rows.y0 + Math.idiv(r, rows.nz);
            const z = rows.z0 + r % rows.nz;
            while (free.data[r].length > 0) {
                const sx = free.data[r][0];
                // 広げるときは図形だけを見て（置いたセルに重なってよい）、選ぶときは新しく埋まる数で比べる
                const a = grow(rows, sx, y, z, 0, maxXZ);
                const b = grow(rows, sx, y, z, 1, maxXZ);
                const best = countFree(free, a) >= countFree(free, b) ? a : b;
                boxes.push(best);
                cutBox(free, best);
            }
        }
        return boxes;
    }

    /**
     * 行の集まりをなるべく少ない直方体 [x0, x1, y0, y1, z0, z1] に分ける。
     * 直方体は図形の外にはみ出さない（重なることはある）。
     * @param maxXZ 直方体の x・z の長さの上限（読み込み窓に収めるため）
     */
    export function cover(rows: Rows, maxXZ: number): number[][] {
        const scan: number[] = [];
        for (let i = 0; i < rows.data.length; i++) {
            if (rows.data[i].length > 0) scan.push(i);
        }
        const first = coverInOrder(rows, scan, maxXZ);
        if (scan.length > TRY_BOTH_ORDERS_ROWS) return first;
        // 形によって当たり外れがあるので、短い行から順に処理する並べ方も試す
        const lengthOf = (i: number) => {
            const row = rows.data[i];
            let n = 0;
            for (let k = 0; k < row.length; k += 2) n += row[k + 1] - row[k] + 1;
            return n;
        };
        const lengths: number[] = [];
        for (let i = 0; i < rows.data.length; i++) lengths.push(lengthOf(i));
        const shortFirst = scan.slice(0);
        shortFirst.sort((a, b) => lengths[a] != lengths[b] ? lengths[a] - lengths[b] : a - b);
        const second = coverInOrder(rows, shortFirst, maxXZ);
        return second.length < first.length ? second : first;
    }

    // ==============================
    // 点の集まり（線・曲線・らせん・座標リスト）
    // ==============================

    /** 整数座標の点の集まり（重複は自動で除く） */
    export class Points {
        xs: number[];
        ys: number[];
        zs: number[];
        private seen: { [key: string]: boolean };

        constructor() {
            this.xs = [];
            this.ys = [];
            this.zs = [];
            this.seen = {};
        }

        add(x: number, y: number, z: number): void {
            const key = `${x},${y},${z}`;
            if (this.seen[key]) return;
            this.seen[key] = true;
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
            for (let i = 0; i < this.xs.length; i++) result.push(world(this.xs[i], this.ys[i], this.zs[i]));
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

    /** 点の番号 list から行の集まりを作る */
    export function rowsOfPoints(points: Points, list: number[]): Rows {
        let y0 = points.ys[list[0]], y1 = y0, z0 = points.zs[list[0]], z1 = z0;
        for (const i of list) {
            y0 = Math.min(y0, points.ys[i]); y1 = Math.max(y1, points.ys[i]);
            z0 = Math.min(z0, points.zs[i]); z1 = Math.max(z1, points.zs[i]);
        }
        y0 = clampY(y0); y1 = clampY(y1);
        const rows = new Rows(y0, y1, z0, z1);
        for (const i of list) {
            const y = points.ys[i];
            if (y < y0 || y > y1) continue;
            const k = (y - y0) * rows.nz + (points.zs[i] - z0);
            if (rows.data[k] === NO_ROW) rows.data[k] = [];
            rows.data[k].push(points.xs[i]);
        }
        // x を昇順に並べて、続いているものを区間にまとめる
        for (let k = 0; k < rows.data.length; k++) {
            const xs = rows.data[k];
            if (xs.length == 0) continue;
            xs.sort((a, b) => a - b);
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
        return rows;
    }
}
