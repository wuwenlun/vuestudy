function _extends() {
    return _extends = Object.assign ||
        function (a) {
            for (var b, c = 1; c < arguments.length; c++)
                for (var d in b = arguments[c], b)
                    Object.prototype.hasOwnProperty.call(b, d) && (a[d] = b[d]);
            return a
        },
        _extends.apply(this, arguments)
}

var normalMerge = ["attrs", "props", "domProps"],
    toArrayMerge = ["class", "style", "directives"],
    functionalMerge = ["on", "nativeOn"],
    mergeJsxProps = function (a) {
        return a.reduce(function (c, a) {
                for (var b in a)
                    if (!c[b]) c[b] = a[b];
                    else if (-1 !== normalMerge.indexOf(b))
                        c[b] = _extends({}, c[b], a[b]);
                    else if (-1 !== toArrayMerge.indexOf(b)) {
                        var d = c[b] instanceof Array ? c[b] : [c[b]],
                            e = a[b] instanceof Array ? a[b] : [a[b]];
                        c[b] = d.concat(e)
                    } else if (-1 !== functionalMerge.indexOf(b)) {
                        for (var f in a[b])
                            if (c[b][f]) {
                                var g = c[b][f] instanceof Array ? c[b][f] : [c[b][f]],
                                    h = a[b][f] instanceof Array ? a[b][f] : [a[b][f]];
                                c[b][f] = g.concat(h)
                            } else c[b][f] = a[b][f];
                    } else if ("hook" == b)
                        for (var i in a[b])
                            c[b][i] = c[b][i] ? mergeFn(c[b][i], a[b][i]) : a[b][i];
                    else c[b] = a[b];
                return c
            },
            {})
    },
    mergeFn = function (a, b) {
        return function () {
            a && a.apply(this, arguments),
            b && b.apply(this, arguments)
        }
    };
module.exports = mergeJsxProps;
