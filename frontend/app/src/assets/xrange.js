/*
 Highcharts JS v9.0.1 (2021-02-15)

 X-range series

 (c) 2010-2021 Torstein Honsi, Lars A. V. Cabrera

 License: www.highcharts.com/license
*/
(function (a) {
    "object" === typeof module && module.exports
        ? ((a["default"] = a), (module.exports = a))
        : "function" === typeof define && define.amd
        ? define("highcharts/modules/xrange", ["highcharts"], function (n) {
              a(n);
              a.Highcharts = n;
              return a;
          })
        : a("undefined" !== typeof Highcharts ? Highcharts : void 0);
})(function (a) {
    function n(a, f, k, b) {
        a.hasOwnProperty(f) || (a[f] = b.apply(null, k));
    }
    a = a ? a._modules : {};
    n(
        a,
        "Series/XRange/XRangePoint.js",
        [a["Core/Series/Point.js"], a["Core/Series/SeriesRegistry.js"]],
        function (a, f) {
            var k =
                (this && this.__extends) ||
                (function () {
                    var a = function (b, d) {
                        a =
                            Object.setPrototypeOf ||
                            ({__proto__: []} instanceof Array &&
                                function (a, d) {
                                    a.__proto__ = d;
                                }) ||
                            function (a, d) {
                                for (var b in d) d.hasOwnProperty(b) && (a[b] = d[b]);
                            };
                        return a(b, d);
                    };
                    return function (b, d) {
                        function t() {
                            this.constructor = b;
                        }
                        a(b, d);
                        b.prototype = null === d ? Object.create(d) : ((t.prototype = d.prototype), new t());
                    };
                })();
            return (function (b) {
                function h() {
                    var a = (null !== b && b.apply(this, arguments)) || this;
                    a.options = void 0;
                    a.series = void 0;
                    a.tooltipDateKeys = ["x", "x2"];
                    return a;
                }
                k(h, b);
                h.getColorByCategory = function (a, b) {
                    var d = a.options.colors || a.chart.options.colors;
                    a = b.y % (d ? d.length : a.chart.options.chart.colorCount);
                    return {colorIndex: a, color: d && d[a]};
                };
                h.prototype.resolveColor = function () {
                    var a = this.series;
                    if (a.options.colorByPoint && !this.options.color) {
                        var b = h.getColorByCategory(a, this);
                        a.chart.styledMode || (this.color = b.color);
                        this.options.colorIndex || (this.colorIndex = b.colorIndex);
                    } else this.color || (this.color = a.color);
                };
                h.prototype.init = function () {
                    a.prototype.init.apply(this, arguments);
                    this.y || (this.y = 0);
                    return this;
                };
                h.prototype.setState = function () {
                    a.prototype.setState.apply(this, arguments);
                    this.series.drawPoint(this, this.series.getAnimationVerb());
                };
                h.prototype.getLabelConfig = function () {
                    var b = a.prototype.getLabelConfig.call(this),
                        h = this.series.yAxis.categories;
                    b.x2 = this.x2;
                    b.yCategory = this.yCategory = h && h[this.y];
                    return b;
                };
                h.prototype.isValid = function () {
                    return "number" === typeof this.x && "number" === typeof this.x2;
                };
                return h;
            })(f.seriesTypes.column.prototype.pointClass);
        }
    );
    n(a, "Series/XRange/XRangeComposition.js", [a["Core/Axis/Axis.js"], a["Core/Utilities.js"]], function (a, f) {
        var k = f.addEvent,
            b = f.pick;
        k(a, "afterGetSeriesExtremes", function () {
            var a = this.series,
                d;
            if (this.isXAxis) {
                var f = b(this.dataMax, -Number.MAX_VALUE);
                a.forEach(function (a) {
                    a.x2Data &&
                        a.x2Data.forEach(function (a) {
                            a > f && ((f = a), (d = !0));
                        });
                });
                d && (this.dataMax = f);
            }
        });
    });
    n(
        a,
        "Series/XRange/XRangeSeries.js",
        [
            a["Core/Globals.js"],
            a["Core/Color/Color.js"],
            a["Core/Series/SeriesRegistry.js"],
            a["Core/Utilities.js"],
            a["Series/XRange/XRangePoint.js"]
        ],
        function (a, f, k, b, h) {
            var d =
                    (this && this.__extends) ||
                    (function () {
                        var a = function (b, c) {
                            a =
                                Object.setPrototypeOf ||
                                ({__proto__: []} instanceof Array &&
                                    function (c, a) {
                                        c.__proto__ = a;
                                    }) ||
                                function (c, a) {
                                    for (var b in a) a.hasOwnProperty(b) && (c[b] = a[b]);
                                };
                            return a(b, c);
                        };
                        return function (b, c) {
                            function r() {
                                this.constructor = b;
                            }
                            a(b, c);
                            b.prototype = null === c ? Object.create(c) : ((r.prototype = c.prototype), new r());
                        };
                    })(),
                n = f.parse,
                A = k.series,
                p = k.seriesTypes.column,
                B = p.prototype,
                w = b.clamp,
                D = b.correctFloat,
                E = b.defined;
            f = b.extend;
            var C = b.find,
                v = b.isNumber,
                x = b.isObject,
                u = b.merge,
                y = b.pick;
            b = (function (a) {
                function b() {
                    var c = (null !== a && a.apply(this, arguments)) || this;
                    c.data = void 0;
                    c.options = void 0;
                    c.points = void 0;
                    return c;
                }
                d(b, a);
                b.prototype.init = function () {
                    p.prototype.init.apply(this, arguments);
                    this.options.stacking = void 0;
                };
                b.prototype.getColumnMetrics = function () {
                    function c() {
                        a.series.forEach(function (c) {
                            var a = c.xAxis;
                            c.xAxis = c.yAxis;
                            c.yAxis = a;
                        });
                    }
                    var a = this.chart;
                    c();
                    var b = B.getColumnMetrics.call(this);
                    c();
                    return b;
                };
                b.prototype.cropData = function (c, a, b, d) {
                    a = A.prototype.cropData.call(this, this.x2Data, a, b, d);
                    a.xData = c.slice(a.start, a.end);
                    return a;
                };
                b.prototype.findPointIndex = function (c) {
                    var a = this.cropped,
                        b = this.cropStart,
                        d = this.points,
                        e = c.id;
                    if (e)
                        var g = (g = C(d, function (a) {
                            return a.id === e;
                        }))
                            ? g.index
                            : void 0;
                    "undefined" === typeof g &&
                        (g = (g = C(d, function (a) {
                            return a.x === c.x && a.x2 === c.x2 && !a.touched;
                        }))
                            ? g.index
                            : void 0);
                    a && v(g) && v(b) && g >= b && (g -= b);
                    return g;
                };
                b.prototype.translatePoint = function (a) {
                    var b,
                        c,
                        d = this.xAxis,
                        e = this.yAxis,
                        g = this.columnMetrics,
                        m = this.options,
                        f = m.minPointLength || 0,
                        h = (null === (b = a.shapeArgs) || void 0 === b ? NaN : b.width) / 2,
                        n = (this.pointXOffset = g.offset);
                    b = a.plotX;
                    var k = y(a.x2, a.x + (a.len || 0)),
                        l = d.translate(k, 0, 0, 0, 1);
                    k = Math.abs(l - b);
                    var q = this.chart.inverted,
                        p = (y(m.borderWidth, 1) % 2) / 2,
                        t = g.offset,
                        z = Math.round(g.width);
                    f && ((f -= k), 0 > f && (f = 0), (b -= f / 2), (l += f / 2));
                    b = Math.max(b, -10);
                    l = w(l, -10, d.len + 10);
                    E(a.options.pointWidth) &&
                        ((t -= (Math.ceil(a.options.pointWidth) - z) / 2), (z = Math.ceil(a.options.pointWidth)));
                    m.pointPlacement &&
                        v(a.plotY) &&
                        e.categories &&
                        (a.plotY = e.translate(a.y, 0, 1, 0, 1, m.pointPlacement));
                    a.shapeArgs = {
                        x: Math.floor(Math.min(b, l)) + p,
                        y: Math.floor(a.plotY + t) + p,
                        width: Math.round(Math.abs(l - b)),
                        height: z,
                        r: this.options.borderRadius
                    };
                    q
                        ? (a.tooltipPos[1] += n + h)
                        : (a.tooltipPos[0] -= h + n - (null === (c = a.shapeArgs) || void 0 === c ? NaN : c.width) / 2);
                    c = a.shapeArgs.x;
                    m = c + a.shapeArgs.width;
                    0 > c || m > d.len
                        ? ((c = w(c, 0, d.len)),
                          (m = w(m, 0, d.len)),
                          (h = m - c),
                          (a.dlBox = u(a.shapeArgs, {x: c, width: m - c, centerX: h ? h / 2 : null})))
                        : (a.dlBox = null);
                    c = a.tooltipPos;
                    m = q ? 1 : 0;
                    h = q ? 0 : 1;
                    g = this.columnMetrics ? this.columnMetrics.offset : -g.width / 2;
                    c[m] = q ? c[m] + a.shapeArgs.width / 2 : c[m] + (d.reversed ? -1 : 0) * a.shapeArgs.width;
                    c[h] = w(c[h] + (q ? -1 : 1) * g, 0, e.len - 1);
                    if ((g = a.partialFill))
                        x(g) && (g = g.amount),
                            v(g) || (g = 0),
                            (e = a.shapeArgs),
                            (a.partShapeArgs = {
                                x: e.x,
                                y: e.y,
                                width: e.width,
                                height: e.height,
                                r: this.options.borderRadius
                            }),
                            (b = Math.max(Math.round(k * g + a.plotX - b), 0)),
                            (a.clipRectArgs = {x: d.reversed ? e.x + k - b : e.x, y: e.y, width: b, height: e.height});
                };
                b.prototype.translate = function () {
                    B.translate.apply(this, arguments);
                    this.points.forEach(function (a) {
                        this.translatePoint(a);
                    }, this);
                };
                b.prototype.drawPoint = function (a, b) {
                    var c = this.options,
                        d = this.chart.renderer,
                        e = a.graphic,
                        g = a.shapeType,
                        h = a.shapeArgs,
                        f = a.partShapeArgs,
                        k = a.clipRectArgs,
                        r = a.partialFill,
                        p = c.stacking && !c.borderRadius,
                        l = a.state,
                        q = c.states[l || "normal"] || {},
                        t = "undefined" === typeof l ? "attr" : b;
                    l = this.pointAttribs(a, l);
                    q = y(this.chart.options.chart.animation, q.animation);
                    if (a.isNull || !1 === a.visible) e && (a.graphic = e.destroy());
                    else {
                        if (e) e.rect[b](h);
                        else
                            (a.graphic = e = d
                                .g("point")
                                .addClass(a.getClassName())
                                .add(a.group || this.group)),
                                (e.rect = d[g](u(h))
                                    .addClass(a.getClassName())
                                    .addClass("highcharts-partfill-original")
                                    .add(e));
                        f &&
                            (e.partRect
                                ? (e.partRect[b](u(f)), e.partialClipRect[b](u(k)))
                                : ((e.partialClipRect = d.clipRect(k.x, k.y, k.width, k.height)),
                                  (e.partRect = d[g](f)
                                      .addClass("highcharts-partfill-overlay")
                                      .add(e)
                                      .clip(e.partialClipRect))));
                        this.chart.styledMode ||
                            (e.rect[b](l, q).shadow(c.shadow, null, p),
                            f &&
                                (x(r) || (r = {}),
                                x(c.partialFill) && (r = u(c.partialFill, r)),
                                (a =
                                    r.fill ||
                                    n(l.fill).brighten(-0.3).get() ||
                                    n(a.color || this.color)
                                        .brighten(-0.3)
                                        .get()),
                                (l.fill = a),
                                e.partRect[t](l, q).shadow(c.shadow, null, p)));
                    }
                };
                b.prototype.drawPoints = function () {
                    // eslint-disable-next-line @typescript-eslint/no-this-alias
                    var a = this,
                        b = a.getAnimationVerb();
                    a.points.forEach(function (c) {
                        a.drawPoint(c, b);
                    });
                };
                b.prototype.getAnimationVerb = function () {
                    return this.chart.pointCount < (this.options.animationLimit || 250) ? "animate" : "attr";
                };
                b.prototype.isPointInside = function (b) {
                    var c = b.shapeArgs,
                        d = b.plotX,
                        f = b.plotY;
                    return c
                        ? "undefined" !== typeof d &&
                              "undefined" !== typeof f &&
                              0 <= f &&
                              f <= this.yAxis.len &&
                              0 <= c.x + c.width &&
                              d <= this.xAxis.len
                        : a.prototype.isPointInside.apply(this, arguments);
                };
                b.defaultOptions = u(p.defaultOptions, {
                    colorByPoint: !0,
                    dataLabels: {
                        formatter: function () {
                            var a = this.point.partialFill;
                            x(a) && (a = a.amount);
                            if (v(a) && 0 < a) return D(100 * a) + "%";
                        },
                        inside: !0,
                        verticalAlign: "middle"
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size: 10px">{point.x} - {point.x2}</span><br/>',
                        pointFormat:
                            '<span style="color:{point.color}">\u25cf</span> {series.name}: <b>{point.yCategory}</b><br/>'
                    },
                    borderRadius: 3,
                    pointRange: 0
                });
                return b;
            })(p);
            f(b.prototype, {
                type: "xrange",
                parallelArrays: ["x", "x2", "y"],
                requireSorting: !1,
                animate: A.prototype.animate,
                cropShoulder: 1,
                getExtremesFromAll: !0,
                autoIncrement: a.noop,
                buildKDTree: a.noop,
                pointClass: h
            });
            k.registerSeriesType("xrange", b);
            ("");
            return b;
        }
    );
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    n(a, "masters/modules/xrange.src.js", [], function () {});
});
//# sourceMappingURL=xrange.js.map