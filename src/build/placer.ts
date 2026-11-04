// 直方体を /fill で置く処理（ブロックにはならない）
// プレイヤーから遠い場所は読み込まれていないので、tickingarea で読み込んでから置く
namespace mmingCore {
    /** 読み込み窓の一辺（チャンク）。tickingarea の上限 100 チャンクに収まる */
    const WINDOW_CHUNKS = 10;
    /** 窓を並べる間隔（チャンク）。重ねて並べるので、x・z が 129 以下の直方体は必ずどれかの窓に入る */
    const WINDOW_STEP = 2;
    /** 図形が 1 つの窓に収まらないときの、直方体の x・z の上限 */
    const MAX_BOX_XZ = 129;
    /** 上限なしを表す値 */
    const NO_LIMIT = 1000000;
    /** プレイヤーのチャンクからこのチャンク数以内なら、tickingarea なしで置く */
    const NEAR_CHUNKS = 3;
    /** tickingarea を付けてから置き始めるまでの待ち時間（ミリ秒） */
    const LOAD_WAIT_MS = 100;
    /** 読み込みが遅くて置けていないときに置き直す回数 */
    const RETRIES = 3;

    let areaIsSet = false;
    let lastCount = 0;

    function chunkOf(v: number): number {
        return Math.floor(v / 16);
    }

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

    function clearArea(): void {
        if (areaIsSet) player.execute(`tickingarea remove ${areaName()}`);
        areaIsSet = false;
    }

    function setArea(x0: number, z0: number, x1: number, z1: number): void {
        clearArea();
        player.execute(`tickingarea add ${x0} 0 ${z0} ${x1} 0 ${z1} ${areaName()}`);
        areaIsSet = true;
        loops.pause(LOAD_WAIT_MS);
    }

    function fillBoxes(boxes: number[][], block: number, done: number, total: number): void {
        let n = done;
        for (const b of boxes) {
            blocks.fill(block, world(b[0], b[2], b[4]), world(b[1], b[3], b[5]), FillOperation.Replace);
            n++;
            mmingCore.progress(n, total);
        }
    }

    /** 遠い場所の直方体を置き、置けたか確かめる。読み込みが遅いときは待って置き直す */
    function fillFar(boxes: number[][], block: number, done: number, total: number): void {
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
        if (x1 < x0 || rows.data.length == 0) return;

        // プレイヤーの近くなら、読み込まれているのでそのまま置く
        const me = mmingCore.blockXYZ(player.position());
        const cx = chunkOf(me[0]), cz = chunkOf(me[2]);
        const near = Math.abs(chunkOf(x0) - cx) <= NEAR_CHUNKS && Math.abs(chunkOf(x1) - cx) <= NEAR_CHUNKS
            && Math.abs(chunkOf(z0) - cz) <= NEAR_CHUNKS && Math.abs(chunkOf(z1) - cz) <= NEAR_CHUNKS;
        const oneWindow = chunkOf(x1) - chunkOf(x0) < WINDOW_CHUNKS && chunkOf(z1) - chunkOf(z0) < WINDOW_CHUNKS;

        const boxes = mmingCore.cover(rows, near || oneWindow ? NO_LIMIT : MAX_BOX_XZ);
        if (boxes.length == 0) return;
        if (near) {
            fillBoxes(boxes, block, 0, boxes.length);
            return;
        }
        if (oneWindow) {
            setArea(chunkOf(x0) * 16, chunkOf(z0) * 16, chunkOf(x1) * 16 + 15, chunkOf(z1) * 16 + 15);
            fillFar(boxes, block, 0, boxes.length);
            clearArea();
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
        mmingCore.tick(boxes.length);
        // tickingarea の移動が少なくなるように、列ごとに行ったり来たりする順で回る
        keys.sort((a, b) => a[0] != b[0] ? a[0] - b[0] : ((a[0] / WINDOW_STEP) % 2 == 0 ? a[1] - b[1] : b[1] - a[1]));
        let done = 0;
        for (const k of keys) {
            const list = windows[`${k[0]},${k[1]}`];
            setArea(k[0] * 16, k[1] * 16, (k[0] + WINDOW_CHUNKS) * 16 - 1, (k[1] + WINDOW_CHUNKS) * 16 - 1);
            fillFar(list, block, done, boxes.length);
            done += list.length;
        }
        clearArea();
    }

    /** 図形を置く。clearInside なら、中身を置いてから内側を空気にする（外側と内側を別々に置くより fill が少ない） */
    export function placeShape(s: mmingCore.Shape, block: number, clearInside: boolean): void {
        if (!s) return;
        mmingCore.progressStart();
        placeRows(s.rows(), s.x0, s.x1, block);
        lastCount = s.rows().count();
        if (clearInside) {
            const inner = mmingCore.innerRows(s);
            placeRows(inner, s.x0, s.x1, Block.Air);
            lastCount -= inner.count();
        }
        mmingCore.progressDone();
    }

    /** 図形を軸方向の段ごとに、リストのブロックを順に使って置く */
    export function placeLayers(blockList: number[], s: mmingCore.Shape, axis: Axis, thickness: number): void {
        if (!s || blockList.length == 0) return;
        mmingCore.progressStart();
        const layers = mmingCore.layersOf(s, axis, thickness, blockList.length);
        lastCount = 0;
        for (let i = 0; i < layers.length; i++) {
            placeRows(layers[i], s.x0, s.x1, blockList[i]);
            lastCount += layers[i].count();
        }
        mmingCore.progressDone();
    }

    /** さっき置いたブロックの数 */
    export function lastPlaced(): number {
        return lastCount;
    }
}
