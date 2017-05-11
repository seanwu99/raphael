Raphael.fn.connection = function (obj1, obj2, line, bg) {
    if (obj1.line && obj1.from && obj1.to) {
        line = obj1;
        obj1 = line.from;
        obj2 = line.to;
    }
    var bb1 = obj1.getBBox(),
        bb2 = obj2.getBBox(),
        p = [{x: bb1.x + bb1.width / 2, y: bb1.y - 1},
            {x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1},
            {x: bb1.x - 1, y: bb1.y + bb1.height / 2},
            {x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2},
            {x: bb2.x + bb2.width / 2, y: bb2.y - 1},
            {x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1},
            {x: bb2.x - 1, y: bb2.y + bb2.height / 2},
            {x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2}],
        d = {}, dis = [];
    for (var i = 0; i < 4; i++) {
        for (var j = 4; j < 8; j++) {
            var dx = Math.abs(p[i].x - p[j].x),
                dy = Math.abs(p[i].y - p[j].y);
            if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
                dis.push(dx + dy);
                d[dis[dis.length - 1]] = [i, j];
            }
        }
    }
    if (dis.length == 0) {
        var res = [0, 4];
    } else {
        res = d[Math.min.apply(Math, dis)];
    }
    var x1 = p[res[0]].x,
        y1 = p[res[0]].y,
        x4 = p[res[1]].x,
        y4 = p[res[1]].y;
    dx = Math.max(Math.abs(x1 - x4) / 2, 10);
    dy = Math.max(Math.abs(y1 - y4) / 2, 10);
    var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
        y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
        x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
        y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
    var path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(",");
    if (line && line.line) {
        line.bg && line.bg.attr({path: path});
        line.line.attr({path: path});
    } else {
        var color = typeof line == "string" ? line : "#000";
        return {
            bg: bg && bg.split && this.path(path).attr({
                stroke: bg.split("|")[0],
                fill: "none",
                "stroke-width": bg.split("|")[1] || 3
            }),
            line: this.path(path).attr({stroke: color, fill: "none"}),
            from: obj1,
            to: obj2
        };
    }
};

function cc(obj) {
    console.log(obj)
}
var sp1, sp2, x2, y2;
var el;
window.onload = function () {
    var
        dragger = function () {
            this.ox = this.type == "rect" ? this.attr("x") : this.attr("cx");
            this.oy = this.type == "rect" ? this.attr("y") : this.attr("cy");
            this.animate({"fill-opacity": .2}, 500);
        },
        move = function (dx, dy) {
            var n = 0;
            for (var i = 0; i < shapes.length; i++) {
                if (this.id == sp1[i]) {
                    n = i;
                }
            }
            cc('n ' + n);
            var att = this.type == "rect" ? {x: this.ox + dx, y: this.oy + dy} : {cx: this.ox + dx, cy: this.oy + dy};
            this.attr(att);
            for (var i = connections.length; i--;) {
                r.connection(connections[i]);
            }
            var att2 = shapes2[n].type == "rect" ? {
                x: x2[n] + dx,
                y: y2[n] + dy
            } : {cx: x2[n] + dx, cy: y2[n] + dy};
            shapes2[n].attr(att2);
        },
        up = function () {
            this.animate({"fill-opacity": 1}, 500);
            cc(this.id + "/" + this.ox);
            var n = 0;
            for (var i = 0; i < shapes.length; i++) {
                if (this.id == sp1[i]) {
                    n = i;
                }
            }

            cc(n + "/" + shapes2[n].type);
            cc(x2[n] + "/" + shapes2[n].getBBox().x);
            if (shapes2[n].type == "rect") {
                x2[n] = shapes2[n].getBBox().x;
                y2[n] = shapes2[n].getBBox().y;
            } else if (shapes2[n].type == "ellipse") {
                x2[n] = shapes2[n].getBBox().cx;
                y2[n] = shapes2[n].getBBox().cy;
            }
            cc(x2[n] + "/" + shapes2[n].getBBox().x);

        },
        r = Raphael("holder", 1200, 800),
        connections = [],
        shapes = [
            r.ellipse(190, 100, 30, 20),
            r.rect(290, 80, 60, 40, 10),
            r.rect(290, 180, 60, 40, 2),
            r.ellipse(450, 100, 20, 20),
            r.rect(500, 500, 100, 120, 2),
        ],
        shapes2 = [
            r.rect(190 - 15, 100 - 10, 30, 20),
            r.ellipse(290 + 30, 80 + 20, 30, 20),
            r.ellipse(290 + 30, 180 + 20, 30, 20),
            r.rect(450 - 10, 100 - 10, 20, 20, 2),
            r.ellipse(500 + 50, 500 + 50, 50, 50),
        ];
    var text1 = r.text(230, 120, "tertreterter").attr({"font-size": "14px", "fill": "#ffffff"});
    sp1 = [], sp2 = [], x2 = [], y2 = [];
    for (var i = 0; i < shapes.length; i++) {
        sp1.push(shapes[i].id);
        sp2.push(shapes2[i].id);
        if (shapes2[i].type == 'rect') {
            x2.push(shapes2[i].getBBox().x);
            y2.push(shapes2[i].getBBox().y);
        } else if (shapes2[i].type == 'ellipse') {
            x2.push(shapes2[i].getBBox().cx);
            y2.push(shapes2[i].getBBox().cy);
        }
        cc(shapes2[i].type);
        cc(shapes2[i].getBBox());
        cc(x2[i] + "/" + y2[i]);
    }
    for (var i = 0, ii = shapes.length; i < ii; i++) {
        var color = "blue";//Raphael.getColor();
        var color2 = "#ffffff";
        shapes2[i].attr({stroke: color2, "stroke-width": 1});
        shapes[i].attr({fill: color, stroke: color, "fill-opacity": 1, "stroke-width": 2, cursor: "move"});
        shapes[i].drag(move, dragger, up);
    }
    connections.push(r.connection(shapes[0], shapes[1], "#fff"));
    connections.push(r.connection(shapes[1], shapes[2], "#fff", "#fff"));
    connections.push(r.connection(shapes[1], shapes[3], "#000", "#fff"));
    connections.push(r.connection(shapes[2], shapes[4], "#fff"));
    connections.push(r.connection(shapes[3], shapes[4], "#fff", "#666"));
};
