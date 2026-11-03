// 「カメラ」カテゴリのブロック

//% block="Camera" weight=100 color=#54bfff icon=""
//% groups='["Start and End","Place","Move","Effects","Controls"]'
namespace mmingCamera {
    /** CameraEase と同じ順番のコマンド用の名前 */
    const EASE_IDS = ["linear", "spring",
        "in_quad", "out_quad", "in_out_quad", "in_cubic", "out_cubic", "in_out_cubic",
        "in_quart", "out_quart", "in_out_quart", "in_quint", "out_quint", "in_out_quint",
        "in_sine", "out_sine", "in_out_sine", "in_expo", "out_expo", "in_out_expo",
        "in_circ", "out_circ", "in_out_circ", "in_bounce", "out_bounce", "in_out_bounce",
        "in_back", "out_back", "in_out_back", "in_elastic", "out_elastic", "in_out_elastic"];
    const VIEW_IDS = ["minecraft:first_person", "minecraft:third_person", "minecraft:third_person_front"];
    /** CameraInput と同じ順番のコマンド用の名前 */
    const INPUT_IDS = ["movement", "camera", "jump", "sneak", "lateral_movement", "mount", "dismount",
        "move_forward", "move_backward", "move_left", "move_right"];
    /** CameraShake と同じ順番の強さ（実機で調整する） */
    const SHAKE_LEVELS = [0.2, 0.6, 1.5];
    /** ズームの視野角 */
    const FOV_CLOSE = 30;
    const FOV_WIDE = 100;
    /** フェードの各時間の上限（秒） */
    const FADE_MAX = 10;
    /** 「まわりを回る」で 1 区間に進む角度 */
    const ORBIT_STEP_DEGREES = 15;

    const num = mmingCore.num;

    function camera(args: string): void {
        player.execute(`camera @s ${args}`);
    }

    function free(args: string): void {
        camera(`set minecraft:free ${args}`);
    }

    function setInputState(id: string, on: boolean): void {
        player.execute(`inputpermission set @s ${id} ${on ? "enabled" : "disabled"}`);
    }

    /**
     * Stop moving and looking around, and hide the HUD, to film a scene.
     * Use "reset everything" to come back.
     */
    //% blockId=mming_camera_startFilming
    //% block="start filming mode"
    //% group="Start and End" weight=100
    export function startFilming(): void {
        for (let i = 0; i <= CameraInput.Sneak; i++) setInputState(INPUT_IDS[i], false);
        player.execute("hud @s hide all");
    }

    /**
     * Put the camera, zoom, shaking, HUD and all controls back to normal.
     */
    //% blockId=mming_camera_reset
    //% block="reset everything"
    //% group="Start and End" weight=90
    export function reset(): void {
        camera("clear");
        camera("fov_clear");
        camera("detach_from_entity");
        player.execute("camerashake stop @s");
        player.execute("hud @s reset all");
        for (const id of INPUT_IDS) setInputState(id, true);
    }

    /**
     * Place the camera at a position, looking at another position.
     * @param position where to put the camera
     * @param look what to look at
     */
    //% blockId=mming_camera_placeAt
    //% block="place camera at $position|looking at $look"
    //% position.shadow=minecraftCreatePosition
    //% look.shadow=mming_coords_inFront
    //% group="Place" weight=100
    export function placeAt(position: Position, look: Position): void {
        free(`pos ${position} facing ${look}`);
    }

    /**
     * See through your eyes, from behind you, or from the front.
     * @param view the view
     */
    //% blockId=mming_camera_setView
    //% block="set view to $view"
    //% view.defl=CameraView.ThirdPerson
    //% group="Place" weight=90
    export function setView(view: CameraView): void {
        camera(`set ${VIEW_IDS[view]}`);
    }

    /**
     * Place the camera at a position with an angle.
     * @param position where to put the camera
     * @param upDown the angle up and down (-90 up to 90 down)
     * @param leftRight the angle left and right
     */
    //% blockId=mming_camera_placeAtAngle
    //% block="place camera at $position|angle up/down $upDown left/right $leftRight"
    //% position.shadow=minecraftCreatePosition
    //% upDown.min=-90 upDown.max=90
    //% leftRight.min=-180 leftRight.max=180
    //% group="Place" weight=80 advanced=true
    export function placeAtAngle(position: Position, upDown: number, leftRight: number): void {
        free(`pos ${position} rot ${num(upDown)} ${num(leftRight)}`);
    }

    /**
     * Keep the camera in place and turn it to follow a mob, like a security camera.
     * @param target who to follow
     */
    //% blockId=mming_camera_watch
    //% block="watch $target with camera"
    //% target.shadow=minecraftTarget
    //% group="Place" weight=70 advanced=true
    export function watch(target: TargetSelector): void {
        target.addRule("c", "1");
        camera("set minecraft:free");
        camera(`target_entity ${target}`);
    }

    /**
     * Put the camera on a mob so that it moves along, like a helmet camera.
     * @param target who to ride with
     */
    //% blockId=mming_camera_ride
    //% block="ride along with $target"
    //% target.shadow=minecraftTarget
    //% group="Place" weight=60 advanced=true
    export function ride(target: TargetSelector): void {
        target.addRule("c", "1");
        camera("set minecraft:follow_orbit");
        camera(`attach_to_entity ${target}`);
    }

    /**
     * Stop watching or riding along.
     */
    //% blockId=mming_camera_stopFollowing
    //% block="stop following"
    //% group="Place" weight=50 advanced=true
    export function stopFollowing(): void {
        camera("remove_target");
        camera("detach_from_entity");
    }

    /**
     * Move the camera smoothly to a position, looking at another position.
     * @param position where to go
     * @param look what to look at
     * @param seconds how long it takes
     * @param style how it moves
     * @param wait wait until it arrives
     */
    //% blockId=mming_camera_moveTo
    //% block="move camera to $position|looking at $look|in $seconds seconds||style $style|wait $wait"
    //% position.shadow=minecraftCreatePosition
    //% look.shadow=mming_coords_inFront
    //% seconds.min=0 seconds.defl=3
    //% style.fieldEditor="gridpicker"
    //% style.fieldOptions.width=90
    //% style.fieldOptions.columns=3
    //% style.fieldOptions.maxRows="6"
    //% wait.shadow=toggleOnOff wait.defl=true
    //% expandableArgumentMode="toggle"
    //% group="Move" weight=100
    export function moveTo(position: Position, look: Position, seconds: number, style: CameraEase = CameraEase.in_out_sine, wait: boolean = true): void {
        free(`ease ${num(seconds)} ${EASE_IDS[style]} pos ${position} facing ${look}`);
        if (wait) loops.pause(seconds * 1000);
    }

    /**
     * Fly the camera around a position, always looking at it.
     * @param center what to fly around
     * @param radius how far from the center
     * @param height how far above the center
     * @param seconds how long it takes
     * @param degrees how far to go around
     */
    //% blockId=mming_camera_orbit
    //% block="fly camera around $center|radius $radius|height $height|in $seconds seconds||degrees $degrees"
    //% center.shadow=mming_coords_inFront
    //% radius.min=1 radius.defl=10
    //% height.defl=5
    //% seconds.min=1 seconds.defl=8
    //% degrees.min=-720 degrees.max=720 degrees.defl=360
    //% expandableArgumentMode="toggle"
    //% group="Move" weight=90
    export function orbit(center: Position, radius: number, height: number, seconds: number, degrees: number = 360): void {
        const c = center.toWorld();
        const cx = c.getValue(Axis.X), cy = c.getValue(Axis.Y), cz = c.getValue(Axis.Z);
        const steps = Math.max(8, Math.ceil(Math.abs(degrees) / ORBIT_STEP_DEGREES));
        const stepSeconds = seconds / steps;
        const look = `facing ${num(cx)} ${num(cy)} ${num(cz)}`;
        const at = (i: number) => {
            const angle = degrees * i / steps * Math.PI / 180;
            return `pos ${num(cx + radius * Math.cos(angle))} ${num(cy + height)} ${num(cz + radius * Math.sin(angle))}`;
        };
        free(`${at(0)} ${look}`);
        for (let i = 1; i <= steps; i++) {
            free(`ease ${num(stepSeconds)} linear ${at(i)} ${look}`);
            loops.pause(stepSeconds * 1000);
        }
    }

    /**
     * Turn the camera without moving it.
     * @param upDown the angle up and down (-90 up to 90 down)
     * @param leftRight the angle left and right
     * @param seconds how long it takes
     */
    //% blockId=mming_camera_turn
    //% block="turn camera up/down $upDown left/right $leftRight||in $seconds seconds"
    //% upDown.min=-90 upDown.max=90
    //% leftRight.min=-180 leftRight.max=180 leftRight.defl=30
    //% seconds.min=0 seconds.defl=0
    //% expandableArgumentMode="toggle"
    //% group="Move" weight=80
    export function turn(upDown: number, leftRight: number, seconds: number = 0): void {
        const rot = `rot ${num(upDown)} ${num(leftRight)}`;
        if (seconds > 0) {
            free(`ease ${num(seconds)} linear ${rot}`);
            loops.pause(seconds * 1000);
        } else {
            free(rot);
        }
    }

    /**
     * Zoom the camera in or out.
     * @param level how far to zoom
     * @param seconds how long it takes
     */
    //% blockId=mming_camera_zoom
    //% block="zoom $level||in $seconds seconds"
    //% level.defl=CameraZoom.Close
    //% seconds.min=0 seconds.defl=1
    //% expandableArgumentMode="toggle"
    //% group="Effects" weight=100
    export function zoom(level: CameraZoom, seconds: number = 1): void {
        const ease = `${num(seconds)} linear`;
        if (level == CameraZoom.Normal) camera(`fov_clear ${ease}`);
        else camera(`fov_set ${level == CameraZoom.Close ? FOV_CLOSE : FOV_WIDE} ${ease}`);
        loops.pause(seconds * 1000);
    }

    /**
     * Shake the screen. It cannot be seen if the player turned off camera shake in the settings.
     * @param level how strong
     * @param seconds how long
     */
    //% blockId=mming_camera_shake
    //% block="shake screen $level for $seconds seconds"
    //% level.defl=CameraShake.Medium
    //% seconds.min=0 seconds.defl=1
    //% group="Effects" weight=90
    export function shake(level: CameraShake, seconds: number): void {
        player.execute(`camerashake add @s ${SHAKE_LEVELS[level]} ${num(seconds)} positional`);
    }

    /**
     * Fade the screen to a color and back. Each time can be up to 10 seconds.
     * @param color the color
     * @param fadeIn seconds to reach the color
     * @param hold seconds to stay
     * @param fadeOut seconds to come back
     * @param wait wait until it ends
     */
    //% blockId=mming_camera_fade
    //% block="fade screen to $color|in $fadeIn hold $hold out $fadeOut||wait $wait"
    //% color.shadow=colorNumberPicker color.defl=0x000000
    //% fadeIn.min=0 fadeIn.max=10 fadeIn.defl=1
    //% hold.min=0 hold.max=10 hold.defl=1
    //% fadeOut.min=0 fadeOut.max=10 fadeOut.defl=1
    //% wait.shadow=toggleOnOff wait.defl=true
    //% expandableArgumentMode="toggle"
    //% group="Effects" weight=80
    export function fade(color: number, fadeIn: number, hold: number, fadeOut: number, wait: boolean = true): void {
        const a = Math.min(FADE_MAX, Math.max(0, fadeIn));
        const b = Math.min(FADE_MAX, Math.max(0, hold));
        const c = Math.min(FADE_MAX, Math.max(0, fadeOut));
        camera(`fade time ${num(a)} ${num(b)} ${num(c)} color ${(color >> 16) & 0xFF} ${(color >> 8) & 0xFF} ${color & 0xFF}`);
        if (wait) loops.pause((a + b + c) * 1000);
    }

    /**
     * Make a color from red, green and blue.
     * @param red red (0 to 255)
     * @param green green (0 to 255)
     * @param blue blue (0 to 255)
     */
    //% blockId=mming_camera_rgb
    //% block="color red $red green $green blue $blue"
    //% red.min=0 red.max=255
    //% green.min=0 green.max=255
    //% blue.min=0 blue.max=255
    //% group="Effects" weight=70 advanced=true
    export function rgb(red: number, green: number, blue: number): number {
        return ((red & 0xFF) << 16) | ((green & 0xFF) << 8) | (blue & 0xFF);
    }

    /**
     * Turn a control on or off.
     * @param input the control
     * @param on turn it on
     */
    //% blockId=mming_camera_setInput
    //% block="$input $on"
    //% input.defl=CameraInput.Movement
    //% on.shadow=toggleOnOff on.defl=false
    //% group="Controls" weight=100 advanced=true
    export function setInput(input: CameraInput, on: boolean): void {
        setInputState(INPUT_IDS[input], on);
    }

    /**
     * Show or hide the hotbar, hearts and so on. The chat stays on the screen.
     * @param on show it
     */
    //% blockId=mming_camera_showHud
    //% block="show HUD $on"
    //% on.shadow=toggleOnOff on.defl=false
    //% group="Controls" weight=90 advanced=true
    export function showHud(on: boolean): void {
        player.execute(`hud @s ${on ? "reset" : "hide"} all`);
    }
}
