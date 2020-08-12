!((
  // IIFE
  ICONS = {
    "arrow-back":
      "box:24;path:M19 11H7.14l3.63-4.36a1 1 0 1 0-1.54-1.28l-5 6a1.19 1.19 0 0 0-.09.15c0 .05 0 .08-.07.13A1 1 0 0 0 4 12a1 1 0 0 0 .07.36c0 .05 0 .08.07.13a1.19 1.19 0 0 0 .09.15l5 6A1 1 0 0 0 10 19a1 1 0 0 0 .64-.23 1 1 0 0 0 .13-1.41L7.14 13H19a1 1 0 0 0 0-2z",
    "book-open-outline":
      "box:24;path:M20.62 4.22a1 1 0 0 0-.84-.2L12 5.77 4.22 4A1 1 0 0 0 3 5v12.2a1 1 0 0 0 .78 1l8 1.8h.44l8-1.8a1 1 0 0 0 .78-1V5a1 1 0 0 0-.38-.78zM5 6.25l6 1.35v10.15L5 16.4zM19 16.4l-6 1.35V7.6l6-1.35z",
    camera:
      "box:24;path:M19 7h-3V5.5A2.5 2.5 0 0 0 13.5 3h-3A2.5 2.5 0 0 0 8 5.5V7H5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-8a3 3 0 0 0-3-3zm-9-1.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V7h-4zM20 18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1zM12 10.5a3.5 3.5 0 1 0 3.5 3.5 3.5 3.5 0 0 0-3.5-3.5zm0 5a1.5 1.5 0 1 1 1.5-1.5 1.5 1.5 0 0 1-1.5 1.5z",
    "menu-outline": "box:24;rct:3,11,18,2,.95;rct:3,16,18,2,.95;rct:3,6,18,2,.95",
    "edit-outline":
      "box:24;path:M19.4 7.34L16.66 4.6A2 2 0 0 0 14 4.53l-9 9a2 2 0 0 0-.57 1.21L4 18.91a1 1 0 0 0 .29.8A1 1 0 0 0 5 20h.09l4.17-.38a2 2 0 0 0 1.21-.57l9-9a1.92 1.92 0 0 0-.07-2.71zM9.08 17.62l-3 .28.27-3L12 9.32l2.7 2.7zM16 10.68L13.32 8l1.95-2L18 8.73z",
    teams:
      "box:24;path:M9 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0-6a2 2 0 1 1-2 2 2 2 0 0 1 2-2zM17 13a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm0-4a1 1 0 1 1-1 1 1 1 0 0 1 1-1zM17 14a5 5 0 0 0-3.06 1.05A7 7 0 0 0 2 20a1 1 0 0 0 2 0 5 5 0 0 1 10 0 1 1 0 0 0 2 0 6.9 6.9 0 0 0-.86-3.35A3 3 0 0 1 20 19a1 1 0 0 0 2 0 5 5 0 0 0-5-5z",
  },
  FUNCs = {
    path: (d, attrs = "") => `<path d='${d}' ${attrs}/>`,
    rct: (x, y, w, h, r = 0) => `<rect width='${w}' height='${h}' x='${x}' y='${y}' rx='${r}'/>`,
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
            (THIS.A = {
              ...Attrs,
            }) // local copy Element getter/setter for all attributes
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
                (FUNCs[attr] = (t) => ((THIS.A[attr] = t), "")) // Setter; Return "" to not include ghost chars in SVG
                //----------------------------------------------------------------------
              ) // end defineProperty
          ), // end .map((attr) one time init

        pars, // parse icon string setting properties (box:24)

        icon = (ICONS[THIS.is] || "").split`;`.map(
          (cmd) => (
            ([func, pars] = cmd.trim().split`:`),
            FUNCs[func]
              ? FUNCs[func].apply(THIS, pars.split`,`) //execute
              : cmd // no command exists, return (bare SVG) string
          )
        ).join``,

        // log = console.assert(THIS.is != "f-arrow-left", THIS.is, ICONS[THIS.is], icon),

        halfbox = THIS.box / 2, // replace saves 2 GZbytes, adds 26 Minified bytes
        c = console.log(THIS.top),
        svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${THIS.w || THIS.box} ${THIS.h || THIS.box}'>${
          THIS.rect
        }<g stroke-width='{width}' stroke='{stroke}' fill='{fill}' opacity='{opacity}' filter='{filter}' transform='translate({xy}) matrix({scale} 0 0 {scale} ${
          halfbox - halfbox * THIS.scale
        } ${halfbox - halfbox * THIS.scale}) rotate({rotate} ${halfbox} ${halfbox})'>${icon}</g>${
          THIS.top
        }</svg>`.replace(/{\s?([^{}\s]*)\s?}/g, (sub, val) => THIS[val])
      ) {
        return (THIS.innerHTML = THIS.img == 1 ? `<img src="data:image/svg+xml,${svg.replace(/#/g, "%23")}">` : svg);
      }
    } /// end define Custom Element
  );
})();
