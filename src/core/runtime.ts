// 拡張機能全体で使う部品（ブロックにはならない）
namespace mmingCore {
    /**
     * この回数の計算ごとに、自分だけに見えるメッセージを出す。
     * MakeCode は計算だけを続けると止まってしまう。実機では 300 回ごとに発言すると通り、
     * 発言なしで execute や loops.pause をはさんでも止まった（理由は分かっていない）。
     * player.say は全員に見えるので player.tell を使う
     */
    const YIELD_EVERY = 300;

    let ticks = 0;
    let showProgress = true;
    let lastPercent = -1;

    /** 計算量を数え、一定回数ごとにメッセージを出して処理を続けられるようにする */
    export function tick(n: number): void {
        ticks += n;
        if (ticks >= YIELD_EVERY) {
            ticks = 0;
            player.tell(mobs.target(TargetSelectorKind.LocalPlayer), "...");
        }
    }

    /** コマンドに入れる数値を整える（1e-7 のような表記にならないようにする） */
    export function num(v: number): number {
        return Math.round(v * 1000) / 1000;
    }

    /** 座標をワールド座標の整数 [x, y, z] にする（ゲームと同じく切り捨て） */
    export function blockXYZ(p: Position): number[] {
        const w = p.toWorld();
        return [Math.floor(w.getValue(Axis.X)), Math.floor(w.getValue(Axis.Y)), Math.floor(w.getValue(Axis.Z))];
    }

    export function setShowProgress(on: boolean): void {
        showProgress = on;
    }

    /** 進捗を画面下のアクションバーに出す。文字は翻訳できないので記号だけにする */
    export function progress(done: number, total: number): void {
        if (!showProgress) return;
        const percent = total > 0 ? Math.min(100, Math.floor(done * 100 / total)) : 100;
        const step = Math.floor(percent / 10) * 10;
        if (step == lastPercent) return;
        lastPercent = step;
        const filled = step / 10;
        let bar = "§a";
        for (let i = 0; i < 10; i++) {
            if (i == filled) bar += "§7";
            bar += "|";
        }
        player.execute(`title @s actionbar ${bar} §f${step}%`);
    }

    /** 進捗の表示を始める */
    export function progressStart(): void {
        lastPercent = -1;
        progress(0, 1);
    }

    /** 完了を音で知らせる */
    export function progressDone(): void {
        progress(1, 1);
        if (showProgress) player.execute("playsound random.levelup @s");
    }
}
