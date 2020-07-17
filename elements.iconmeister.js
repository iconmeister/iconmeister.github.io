const $ICONS = {
  //! terser rewrites $ICONS as first parameter for IIFE
  // im: "box:9;path:m3 3h3v3h-3z",
  // text: "box:100;fill:red;<text x='45' y='75' font-size='40' font-family='arial' text-anchor='middle'>{is}</text>",
  // dot1: "box:10;path:M5 5m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0,fill='red';scale:.2",
};

!((
  // IIFE
  ICONS,
  FUNCs = {
    path: (d, attrs = "") => `<path d='${d}' ${attrs}/>`,
    // text: () => <text x='' y='' font-size='' font-family='' text-anchor=''></text>`
    // circle: (radius, cx, cy) => `<circle cx='${cx}' cy='${cy}' r='${radius}'/>`,
    // polyline: points => `<polyline points='${points}'/>`,
    // polygon: points => `<polygon points='${points}'/>`,
    // line: (x1, y1, x2, y2) => `<line x1='${x1}' y1='${y1}' x2='${x2}' y2='${y2}'/>`,
    // rect: (x, y, w, h, r = 0, a = "") => `<rect width='${w}' height='${h}' x='${x}' y='${y}' rx='${r}' ${a}/>`,
  },
  Attrs = {
    // Custom Element Observed Attributes
    v1: "", //optional attribute
    v2: "", //optional attribute
    v3: "", //optional attribute
    is: "", // ICONs[is] iconstring definition
    img: 1, // create img (default) or raw SVG
    box: 9, // viewbox='0 0 n n' parsed from Icon string: "box:24;path:..."

    rect: "<rect width='100%' height='100%' fill='{tile}' {border}/>",
    border: "",
    filter: "",
    tile: "none",

    fill: "none",
    width: 1,
    scale: 1,
    opacity: 1,
    rotate: 0,
    stroke: "#000",
    xy: 0,
    w: 0,
    h: 0,
    top: "",
    api: [ICONS, FUNCs], // Custom Element is API for ICONs and FUNCs, add icons in getElementById(x).$[0]
  } // Attributes
) => {
  customElements.define(
    "svg-icon",
    class extends HTMLElement {
      static get observedAttributes() {
        return Object.keys(Attrs);
      }
      attributeChangedCallback() {
        this.svg();
      }
      svg(
        THIS = this,
        func = THIS.A || // first init, declare func var, but not used in init
          Object.keys(
            (THIS.A = { ...Attrs }) // local copy Element getter/setter for all attributes
          ).map(
            (attr) =>
              Object.defineProperty(
                THIS,
                attr,
                {
                  // set: (val) => this[val == null ? "remove" : "set" + "Attribute"](a, val),
                  set: (val) => THIS.setAttribute(attr, val),
                  get: () =>
                    THIS.getAttribute(attr) || // get DOM element attribute value //! 0 value is false!!
                    getComputedStyle(THIS)
                      .getPropertyValue(`--svg-icon-` + attr) // read CSS prop --svg-icon-[attr] // trim spaces
                      .replace(/"/g, "") // strip " from CSS property value, using quotes keeps IDE quiet
                      .trim() ||
                    THIS.A[attr], // return attribute value
                },
                //----------------------------------------------------------------------
                //! Code-golf abuse non used 4th parameter: Setter CMDs for PARSE "box:36;fill:black"
                (FUNCs[attr] = (t) => ((THIS.A[attr] = t),""))// Setter; Return "" to not include ghost chars in SVG
                //----------------------------------------------------------------------
              ) // end defineProperty
          ), // end .map((attr) one time init

        pars, // Variable declaration (parameters from icon string "box:24")

        icon = (ICONS[THIS.is] || "").split`;`.map(
          (cmd) => (
            ([func, pars] = cmd.trim().split`:`),
            FUNCs[func]
              ? FUNCs[func].apply(THIS, pars.split`,`) //execute path:, box:, stroke: function
              : cmd // no command exists, return (bare SVG) string
          )
        ).join``,

        halfbox = THIS.box / 2, // replace halfbox saves 2 GZbytes, but is less reabable, slower and adds 26 Minified bytes

        svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${THIS.w || THIS.box} ${THIS.h || THIS.box}'>${
          THIS.rect
        }<g stroke-width='{width}' stroke='{stroke}' fill='{fill}' opacity='{opacity}' filter='{filter}' transform='translate({xy}) matrix({scale} 0 0 {scale} ${
          halfbox - halfbox * THIS.scale
        } ${halfbox - halfbox * THIS.scale}) rotate({rotate} ${halfbox} ${halfbox})'>${icon}</g>${
          THIS.top
        }</svg>`.replace(
          /{\s?([^{}\s]*)\s?}/g, //! original regexp
          // /{([^{}\s]*)}/g,//! seems to work also, needs more testing
          (sub, val) => THIS[val]
        )
      ) {
        return (THIS.innerHTML = THIS.img == 1 ? `<img src="data:image/svg+xml,${svg.replace(/#/g, "%23")}">` : svg);
      }
    } /// end define Custom Element
  );
})($ICONS);
