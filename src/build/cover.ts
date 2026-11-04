// 行の集まりをなるべく少ない直方体に分ける処理（ブロックにはならない）
// 直方体は図形の外にはみ出さない。すでに置いたセルには重なってよいので、図形だけを見て広げ、
// 候補を選ぶときは新しく埋まるセルの数で比べる
namespace mmingCore {
    /** /fill 1 回で置ける最大ブロック数 */
    export const FILL_LIMIT = 32768;

    /** 行が区間 [a, b] をまるごと含むか */
    function rowHas(row: number[], a: number, b: number): boolean {
        for (let i = 0; i < row.length; i += 2) {
            if (row[i] <= a && b <= row[i + 1]) return true;
        }
        return false;
    }

    /** box の外側の 1 層（axis=1 は y=c、axis=2 は z=c）がすべて図形の中か */
    function layerOk(rows: mmingCore.Rows, box: number[], axis: number, c: number): boolean {
        // 途中で false を返すときも数えるように、調べる前に足す
        mmingCore.tick(axis == 1 ? box[5] - box[4] + 1 : box[3] - box[2] + 1);
        if (axis == 1) {
            for (let z = box[4]; z <= box[5]; z++) {
                if (!rowHas(rows.at(c, z), box[0], box[1])) return false;
            }
        } else {
            for (let y = box[2]; y <= box[3]; y++) {
                if (!rowHas(rows.at(y, c), box[0], box[1])) return false;
            }
        }
        return true;
    }

    /** box を axis 方向（1=y、2=z）の両側へ交互に広げる */
    function extend(rows: mmingCore.Rows, box: number[], axis: number, maxLen: number): void {
        let low = true, high = true;
        while (low || high) {
            const width = box[1] - box[0] + 1;
            const height = box[3] - box[2] + 1;
            const depth = box[5] - box[4] + 1;
            const face = axis == 1 ? width * depth : width * height;
            const len = axis == 1 ? height : depth;
            if (len >= maxLen || face * (len + 1) > FILL_LIMIT) return;
            if (low) {
                if (layerOk(rows, box, axis, box[axis * 2] - 1)) box[axis * 2] = box[axis * 2] - 1;
                else low = false;
            }
            const len2 = axis == 1 ? box[3] - box[2] + 1 : box[5] - box[4] + 1;
            if (len2 >= maxLen || face * (len2 + 1) > FILL_LIMIT) return;
            if (high) {
                if (layerOk(rows, box, axis, box[axis * 2 + 1] + 1)) box[axis * 2 + 1] = box[axis * 2 + 1] + 1;
                else high = false;
            }
        }
    }

    /** x を起点の両側へ、box のすべての行に含まれる範囲まで広げる */
    function extendX(rows: mmingCore.Rows, box: number[], sx: number, maxLen: number): void {
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

    /** 起点のセルから直方体を作る。xFirst なら x→y→z、そうでなければ z→y→x の順に広げる */
    function grow(rows: mmingCore.Rows, sx: number, y: number, z: number, xFirst: boolean, maxXZ: number): number[] {
        const box = [sx, sx, y, y, z, z];
        if (xFirst) {
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
    function countFree(free: mmingCore.Rows, box: number[]): number {
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

    function cutBox(free: mmingCore.Rows, box: number[]): void {
        const cut = [box[0], box[1]];
        for (let y = box[2]; y <= box[3]; y++) {
            for (let z = box[4]; z <= box[5]; z++) {
                const i = (y - free.y0) * free.nz + (z - free.z0);
                if (free.data[i].length > 0) free.data[i] = mmingCore.subtract(free.data[i], cut);
            }
            mmingCore.tick(box[5] - box[4] + 1);
        }
    }

    /**
     * 行の集まりをなるべく少ない直方体 [x0, x1, y0, y1, z0, z1] に分ける。
     * @param maxXZ 直方体の x・z の長さの上限（読み込み窓に収めるため）
     */
    export function cover(rows: mmingCore.Rows, maxXZ: number): number[][] {
        const free = new mmingCore.Rows(rows.y0, rows.y0 + rows.ny - 1, rows.z0, rows.z0 + rows.nz - 1);
        for (let i = 0; i < rows.data.length; i++) {
            free.data[i] = rows.data[i];
            mmingCore.tick(1);
        }
        const boxes: number[][] = [];
        for (let r = 0; r < rows.data.length; r++) {
            const y = rows.y0 + Math.floor(r / rows.nz);
            const z = rows.z0 + r % rows.nz;
            mmingCore.tick(1);
            while (free.data[r].length > 0) {
                const sx = free.data[r][0];
                const a = grow(rows, sx, y, z, true, maxXZ);
                const b = grow(rows, sx, y, z, false, maxXZ);
                const best = countFree(free, a) >= countFree(free, b) ? a : b;
                boxes.push(best);
                cutBox(free, best);
            }
        }
        return boxes;
    }
}
