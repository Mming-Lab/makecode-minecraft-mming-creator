// 直方体を読み込み窓ごとに /fill で置く処理（ブロックにはならない）
// プレイヤーから遠い場所は読み込まれていないので、tickingarea で窓を読み込ませてから置く
namespace mmingCore {
    /** 読み込み窓の一辺（チャンク）。tickingarea の上限 100 チャンクに収まる */
    const WINDOW_CHUNKS = 10;
    /** 窓を並べる間隔（チャンク）。重ねて並べるので、x・z が 129 以下の直方体は必ずどれかの窓に入る */
    const WINDOW_STEP = 2;
    /** 図形が 1 つの窓に収まらないときの、直方体の x・z の上限 */
    const MAX_BOX_XZ = 129;
    /** 上限なしを表す値 */
    const NO_LIMIT = 1000000;
    /** tickingarea を付けてから置き始めるまでの待ち時間（ミリ秒）の初期値 */
    const LOAD_WAIT_MS = 100;
    /** 置けていないときに置き直す回数 */
    const RETRIES = 3;

    let currentArea = "";
    let lastCount = 0;

    /** プレイヤーごとの tickingarea の名前（英数字以外は使えないので除く） */
    function areaName(): string {
        const name = player.name();
        let safe = "";
        for (let i = 0; i < name.length; i++) {
            const c = name.charAt(i);
            if ((c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || (c >= "0" && c <= "9")) safe += c;
        }
        return `mmingCreator${safe}`;
    }

    function loadArea(x0: number, z0: number, x1: number, z1: number): void {
        const area = `${x0} ${z0} ${x1} ${z1}`;
        if (area == currentArea) return;
        const name = areaName();
        player.execute(`tickingarea remove ${name}`);
        player.execute(`tickingarea add ${x0} 0 ${z0} ${x1} 0 ${z1} ${name}`);
        currentArea = area;
        loops.pause(LOAD_WAIT_MS);
    }

    function unloadArea(): void {
        player.execute(`tickingarea remove ${areaName()}`);
        currentArea = "";
    }

    function chunkOf(v: number): number {
        return Math.floor(v / 16);
    }

    function fillBoxes(boxes: number[][], block: number, done: number, total: number): void {
        let n = done;
        for (const b of boxes) {
            blocks.fill(block, world(b[0], b[2], b[4]), world(b[1], b[3], b[5]), FillOperation.Replace);
            n++;
            mmingCore.progress(n, total);
        }
    }

    /** 窓の直方体を置き、最初の直方体が置けたか確かめる。読み込みが遅いときは待って置き直す */
    function fillWindow(boxes: number[][], block: number, done: number, total: number): void {
        let wait = LOAD_WAIT_MS;
        for (let i = 0; i <= RETRIES; i++) {
            fillBoxes(boxes, block, done, total);
            const b = boxes[0];
            if (blocks.testForBlock(block, world(b[0], b[2], b[4]))) return;
            wait *= 2;
            loops.pause(wait);
        }
    }

    /** 行の集まりをブロックで置く */
    export function placeRows(rows: mmingCore.Rows, x0: number, x1: number, block: number): void {
        const z0 = rows.z0, z1 = rows.z0 + rows.nz - 1;
        const oneWindow = chunkOf(x1) - chunkOf(x0) < WINDOW_CHUNKS && chunkOf(z1) - chunkOf(z0) < WINDOW_CHUNKS;
        const boxes = mmingCore.cover(rows, oneWindow ? NO_LIMIT : MAX_BOX_XZ);
        if (boxes.length == 0) return;

        if (oneWindow) {
            loadArea(chunkOf(x0) * 16, chunkOf(z0) * 16, chunkOf(x1) * 16 + 15, chunkOf(z1) * 16 + 15);
            fillWindow(boxes, block, 0, boxes.length);
            return;
        }

        // 直方体を、はじまりのチャンクに合わせて窓に振り分ける
        const windows: { [key: string]: number[][] } = {};
        const keys: number[][] = [];
        for (const b of boxes) {
            const wx = Math.floor(chunkOf(b[0]) / WINDOW_STEP) * WINDOW_STEP;
            const wz = Math.floor(chunkOf(b[4]) / WINDOW_STEP) * WINDOW_STEP;
            const key = `${wx},${wz}`;
            if (!windows[key]) {
                windows[key] = [];
                keys.push([wx, wz]);
            }
            windows[key].push(b);
        }
        // tickingarea の移動が少なくなるように、列ごとに行ったり来たりする順で回る
        keys.sort((a, b) => a[0] != b[0] ? a[0] - b[0] : ((a[0] / WINDOW_STEP) % 2 == 0 ? a[1] - b[1] : b[1] - a[1]));
        let done = 0;
        for (const k of keys) {
            const list = windows[`${k[0]},${k[1]}`];
            loadArea(k[0] * 16, k[1] * 16, (k[0] + WINDOW_CHUNKS) * 16 - 1, (k[1] + WINDOW_CHUNKS) * 16 - 1);
            fillWindow(list, block, done, boxes.length);
            done += list.length;
        }
    }

    /** 図形を fill の選び方に合わせて置く */
    export function placeShape(s: mmingCore.Shape, block: number, fill: BuildFill): void {
        if (!s) return;
        mmingCore.progressStart();
        const solid = mmingCore.rowsOf(s);
        if (fill == BuildFill.Solid) {
            lastCount = solid.count();
            placeRows(solid, s.x0, s.x1, block);
        } else {
            const inner = mmingCore.innerRows(s, solid);
            const shell = mmingCore.shellRows(solid, inner);
            lastCount = shell.count();
            if (fill == BuildFill.Shell) {
                placeRows(shell, s.x0, s.x1, block);
            } else {
                // 殻と内側を別々に置くより、中身を置いてから内側を空気にするほうが fill が少ない
                placeRows(solid, s.x0, s.x1, block);
                placeRows(inner, s.x0, s.x1, Block.Air);
            }
        }
        unloadArea();
        mmingCore.progressDone();
    }

    /** 点の集まりを置く */
    export function placePoints(points: mmingCore.Points, block: number): void {
        const n = points.count();
        lastCount = n;
        if (n == 0) return;
        mmingCore.progressStart();
        // 窓の大きさに重ならないように仕分ける
        const groups: { [key: string]: number[] } = {};
        const keys: number[][] = [];
        const size = WINDOW_CHUNKS * 16;
        for (let i = 0; i < n; i++) {
            const wx = Math.floor(points.xs[i] / size), wz = Math.floor(points.zs[i] / size);
            const key = `${wx},${wz}`;
            if (!groups[key]) {
                groups[key] = [];
                keys.push([wx, wz]);
            }
            groups[key].push(i);
            mmingCore.tick(1);
        }
        keys.sort((a, b) => a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]);
        let done = 0;
        for (const k of keys) {
            const list = groups[`${k[0]},${k[1]}`];
            const rows = mmingCore.rowsOfPoints(points, list);
            const boxes = mmingCore.cover(rows, NO_LIMIT);
            if (boxes.length > 0) {
                loadArea(k[0] * size, k[1] * size, k[0] * size + size - 1, k[1] * size + size - 1);
                fillWindow(boxes, block, 0, boxes.length);
            }
            done++;
            mmingCore.progress(done, keys.length);
        }
        unloadArea();
        mmingCore.progressDone();
    }

    /** さっき置いたブロックの数 */
    export function lastPlaced(): number {
        return lastCount;
    }

    /** 図形のセルを座標リストにする */
    export function positionsOfRows(rows: mmingCore.Rows): Position[] {
        const result: Position[] = [];
        for (let i = 0; i < rows.data.length; i++) {
            const row = rows.data[i];
            const y = rows.y0 + Math.idiv(i, rows.nz), z = rows.z0 + i % rows.nz;
            for (let k = 0; k < row.length; k += 2) {
                for (let x = row[k]; x <= row[k + 1]; x++) result.push(world(x, y, z));
                mmingCore.tick(row[k + 1] - row[k] + 1);
            }
        }
        return result;
    }

    /** 図形の座標リスト（outsideOnly なら外側だけ） */
    export function positionsOf(s: mmingCore.Shape, outsideOnly: boolean): Position[] {
        if (!s) return [];
        const solid = mmingCore.rowsOf(s);
        return positionsOfRows(outsideOnly ? mmingCore.shellRows(solid, mmingCore.innerRows(s, solid)) : solid);
    }
}
