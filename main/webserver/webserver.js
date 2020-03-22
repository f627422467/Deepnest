(function (root) {
    'use strict';

    const {ipcRenderer} = require('electron');
    const path = require('path')
    const url = require('url')
    const http = require('http')
    const { app } = require('electron')

    root.Webserver = new Webserver();

    function addSVGs(body, scale) {

        /* clear */
        DeepNest.parts = [];
        DeepNest.imports = [];

        var idx = 0;
        body.svg.forEach(function (obj) {
            window.DeepNest.importsvg("svg-" + (idx++), "", obj, scale, false)
        });

        DeepNest.imports.forEach(function (im) {
            im.selected = false;
        });

        DeepNest.imports[DeepNest.imports.length - 1].selected = true;

    }

    function addSheet(width, height, count) {

        var units = "mm";
        var conversion = config.getSync('scale');

        // remember, scale is stored in units/inch
        if (units == 'mm') {
            conversion /= 25.4;
        }

        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', 0);
        rect.setAttribute('y', 0);
        rect.setAttribute('width', width * conversion);
        rect.setAttribute('height', height * conversion);
        svg.appendChild(rect);
        DeepNest.importsvg(null, null, (new XMLSerializer()).serializeToString(svg));

        DeepNest.parts[DeepNest.parts.length - 1].sheet = true;
        DeepNest.parts[DeepNest.parts.length - 1].quantity = count;

    }

    function selectSheet() {

    }

    function Webserver() {

        var self = this;

        this.start = function () {

            http.createServer(function (req, res) {

                if (req.url == "/status") {

                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.write("");
                    res.end();

                } else if (req.url == "/kill") {

                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.write("");
                    res.end();

                    var electron = require('electron');
                    var app = electron.remote.app;
                    app.quit();

                } else if (req.url == "/run") {

                    var strBody = '';

                    req.on('data', function (data) {
                        strBody += data;
                    });
                    req.on('end', function () {

                        var body = JSON.parse(strBody);

                        window.DeepNest.config.spacing = body.spacing;
                        window.DeepNest.config.scale = body.scale;

                        addSVGs(body, body.importscale);
                        addSheet(body.width, body.height, body.sheets);
                        window.StartNesting();

                        setTimeout(() => {

                            window.GlobalStop();

                        var selected = window.DeepNest.nests.filter(function (n) {
                            return n.selected
                        })[0];

                        if (selected) {

                            var placed = window.GlobalGetPartsPlaced().split("/");
                            if (placed[0] == placed[1]) {

                                var svg = window.GlobalExport();

                                var result = {
                                    svg: svg,
                                    parts: Number(placed[1]),
                                    placed: Number(placed[0]),
                                    sheets: selected.placements.length
                                };

                                res.writeHead(200, {'Content-Type': 'application/json'});
                                res.write(JSON.stringify(result));
                                res.end();

                            } else {

                                res.writeHead(500, {'Content-Type': 'text/plain'});
                                res.write("not all parts placed");
                                res.end();

                            }

                        } else {

                            res.writeHead(500, {'Content-Type': 'text/plain'});
                            res.write("no result");
                            res.end();

                        }


                    }, body.duration);


                    });

                } else {

                    res.writeHead(404, {'Content-Type': 'text/plain'});
                    res.write("");
                    res.end();

                }

            }).listen(9900);

        }

    }

})(this);