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
    let stepName = "";
    let stepDone = 0;
    let stepTotal = 0;

    /** 自分にだけ見えるメッセージを、ゲーム時刻（tick）を付けて出す */
    function log(text: string): void {
        const time = gameplay.timeQuery(TimeQuery.GameTime);
        player.tell(mobs.target(TargetSelectorKind.LocalPlayer), `${text} t=${time}`);
    }

    /** 今の処理の名前と進み具合を覚える。次のログに出る */
    export function setStep(name: string, done: number, total: number): void {
        stepName = name;
        stepDone = done;
        stepTotal = total;
    }

    /** 計算量を数え、一定回数ごとにメッセージを出して処理を続けられるようにする */
    export function tick(n: number): void {
        ticks += n;
        if (ticks >= YIELD_EVERY) {
            ticks = 0;
            log(`${stepName} ${stepDone}/${stepTotal}`);
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

    /** 置いた割合をログに出す */
    export function progress(done: number, total: number): void {
        if (!showProgress) return;
        const percent = total > 0 ? Math.min(100, Math.floor(done * 100 / total)) : 100;
        const step = Math.floor(percent / 10) * 10;
        if (step == lastPercent) return;
        lastPercent = step;
        log(`fill ${step}%`);
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
