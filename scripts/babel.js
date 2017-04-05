const babel = require("gulp-babel");

module.exports = function (config) {
    if (!Array.isArray(config)) {
        config = [config];
    }

    if (config.length === 0) return babel();

    let transform = null;

    for (let step of config) {
        if (!transform) {
            transform = babel(step);
        }
        else {
            transform = transform.pipe(babel(step));
        }
    }

    return transform;
}
