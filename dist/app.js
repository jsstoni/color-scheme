(function () {
  const D = document;

  function toHSL(H) {
    let r = 0,
      g = 0,
      b = 0;
    if (H.length == 4) {
      r = "0x" + H[1] + H[1];
      g = "0x" + H[2] + H[2];
      b = "0x" + H[3] + H[3];
    } else if (H.length == 7) {
      r = "0x" + H[1] + H[2];
      g = "0x" + H[3] + H[4];
      b = "0x" + H[5] + H[6];
    }
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r, g, b),
      cmax = Math.max(r, g, b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;

    if (delta == 0) h = 0;
    else if (cmax == r) h = ((g - b) / delta) % 6;
    else if (cmax == g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return "hsl(" + h + "," + s + "%," + l + "%)";
  }

  function toRGB(h) {
    let r = 0,
      g = 0,
      b = 0;
    if (h.length == 4) {
      r = "0x" + h[1] + h[1];
      g = "0x" + h[2] + h[2];
      b = "0x" + h[3] + h[3];
    } else if (h.length == 7) {
      r = "0x" + h[1] + h[2];
      g = "0x" + h[3] + h[4];
      b = "0x" + h[5] + h[6];
    }

    return "rgb(" + +r + "," + +g + "," + +b + ")";
  }

  function mixColors(color1, color2, ratio) {
    const hexToRgb = (hex) => {
      const bigint = parseInt(hex.slice(1), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return { r, g, b };
    };

    const rgbToHex = (r, g, b) =>
      `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;

    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);

    const mixedColor = {
      r: Math.round(c1.r * ratio + c2.r * (1 - ratio)),
      g: Math.round(c1.g * ratio + c2.g * (1 - ratio)),
      b: Math.round(c1.b * ratio + c2.b * (1 - ratio)),
    };

    return rgbToHex(mixedColor.r, mixedColor.g, mixedColor.b);
  }

  const palettes = [0.05, 0.1, 0.3, 0.5, 0.7, 1, 0.1, 0.3, 0.5, 0.7];

  function generateColors(event) {
    const color_base = event?.target.value || "#4673fb";
    const containerPalette = D.querySelector("#palette");
    const hsl = D.querySelector("#hsl");
    const rgb = D.querySelector("#rgb");
    const hex = D.querySelector("#hex");
    containerPalette.innerHTML = "";
    rgb.innerHTML = toRGB(color_base);
    hsl.innerHTML = toHSL(color_base);
    hex.innerHTML = color_base;
    let n = 0;
    let textColor;
    for (const porcent of palettes) {
      if (n < 5) {
        color = mixColors(color_base, "#ffffff", porcent);
        textColor = "#000000";
      } else if (n === 5) {
        color = color_base;
      } else {
        textColor = "#ffffff";
        color = mixColors("#000000", color_base, porcent);
      }
      const listColor = D.createElement("li");
      listColor.innerHTML = `${color}`;
      Object.assign(listColor.style, {
        background: color,
        padding: "5px 10px",
        color: textColor,
      });
      containerPalette.appendChild(listColor);
      n++;
    }
  }

  D.querySelector("#color").addEventListener("change", generateColors);

  generateColors();
})();
