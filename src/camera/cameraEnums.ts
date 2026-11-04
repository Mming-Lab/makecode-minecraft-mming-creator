// 「カメラ」カテゴリの選択肢

/** カメラの動き方（アイコンは easing.jres。キーはメンバー名と同じ） */
enum CameraEase {
    //% block="linear"
    //% jres alias=""
    linear,
    //% block="spring"
    //% jres alias=""
    spring,
    //% block="in quad"
    //% jres alias=""
    in_quad,
    //% block="out quad"
    //% jres alias=""
    out_quad,
    //% block="in out quad"
    //% jres alias=""
    in_out_quad,
    //% block="in cubic"
    //% jres alias=""
    in_cubic,
    //% block="out cubic"
    //% jres alias=""
    out_cubic,
    //% block="in out cubic"
    //% jres alias=""
    in_out_cubic,
    //% block="in quart"
    //% jres alias=""
    in_quart,
    //% block="out quart"
    //% jres alias=""
    out_quart,
    //% block="in out quart"
    //% jres alias=""
    in_out_quart,
    //% block="in quint"
    //% jres alias=""
    in_quint,
    //% block="out quint"
    //% jres alias=""
    out_quint,
    //% block="in out quint"
    //% jres alias=""
    in_out_quint,
    //% block="in sine"
    //% jres alias=""
    in_sine,
    //% block="out sine"
    //% jres alias=""
    out_sine,
    //% block="in out sine"
    //% jres alias=""
    in_out_sine,
    //% block="in expo"
    //% jres alias=""
    in_expo,
    //% block="out expo"
    //% jres alias=""
    out_expo,
    //% block="in out expo"
    //% jres alias=""
    in_out_expo,
    //% block="in circ"
    //% jres alias=""
    in_circ,
    //% block="out circ"
    //% jres alias=""
    out_circ,
    //% block="in out circ"
    //% jres alias=""
    in_out_circ,
    //% block="in bounce"
    //% jres alias=""
    in_bounce,
    //% block="out bounce"
    //% jres alias=""
    out_bounce,
    //% block="in out bounce"
    //% jres alias=""
    in_out_bounce,
    //% block="in back"
    //% jres alias=""
    in_back,
    //% block="out back"
    //% jres alias=""
    out_back,
    //% block="in out back"
    //% jres alias=""
    in_out_back,
    //% block="in elastic"
    //% jres alias=""
    in_elastic,
    //% block="out elastic"
    //% jres alias=""
    out_elastic,
    //% block="in out elastic"
    //% jres alias=""
    in_out_elastic
}

/** 視点 */
enum CameraView {
    //% block="my eyes"
    FirstPerson,
    //% block="from behind"
    ThirdPerson,
    //% block="from the front"
    ThirdPersonFront
}

/** カメラのゆれの種類 */
enum CameraShakeType {
    //% block="positional"
    Positional,
    //% block="rotational"
    Rotational
}

/** 止めたり戻したりできる操作 */
enum CameraInput {
    //% block="moving"
    Movement,
    //% block="looking around"
    LookAround,
    //% block="jumping"
    Jump,
    //% block="sneaking"
    Sneak,
    //% block="moving sideways"
    Sideways,
    //% block="getting on"
    Mount,
    //% block="getting off"
    Dismount,
    //% block="moving forward"
    Forward,
    //% block="moving backward"
    Backward,
    //% block="moving left"
    Left,
    //% block="moving right"
    Right
}
