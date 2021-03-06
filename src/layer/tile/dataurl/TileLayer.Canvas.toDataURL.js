L.TileLayer.Canvas.include({

    // NW attempt at saving the whole visible viewport to a data URL

    toViewportCanvas: function (format) {
        format = format || 'image/png';

        var pixelBounds = this._map.getPixelBounds();

        var tileW = Math.floor(pixelBounds.min.x / this.options.tileSize),
            tileN = Math.floor(pixelBounds.min.y / this.options.tileSize),
            tileE = Math.floor(pixelBounds.max.x / this.options.tileSize),
            tileS = Math.floor(pixelBounds.max.y / this.options.tileSize),
            srcX, srcXEnd, srcY, srcYEnd;

        var vpCanvas = document.createElement("canvas");
        vpCanvas.width = this._map.getSize().x;
        vpCanvas.height = this._map.getSize().y;

        var img, ctx, partTileW, partTileH, destX, destY = 0;

        ctx = vpCanvas.getContext("2d");

        for (var yt = tileN; yt <= tileS; yt++) {

            destX = 0;
            srcY = (yt === tileN) ?  pixelBounds.min.y %
                this.options.tileSize : 0;
            srcYEnd = (yt === tileS) ?  pixelBounds.max.y %
                this.options.tileSize : this.options.tileSize;
            partTileH = srcYEnd - srcY;

            for (var xt = tileW; xt <= tileE; xt++) {

                srcX = (xt === tileW) ?
                    pixelBounds.min.x % this.options.tileSize : 0;
                srcXEnd = (xt === tileE) ?
                    pixelBounds.max.x % this.options.tileSize :
                    this.options.tileSize;
                partTileW = srcXEnd - srcX;

                // drawImage() will take a canvas as 1st parameter, not
                // just an image, so no need to do toDataURL() here
                ctx.drawImage(this._tiles[xt + ':' + yt], srcX, srcY, partTileW,
                        partTileH, destX, destY, partTileW, partTileH);
                destX += partTileW;

            }

            destY += partTileH;
        }

        return vpCanvas;
    },

    toDataURL: function (format) {
        return this.toViewportCanvas(format).toDataURL();
    }
});
