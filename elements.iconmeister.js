const $ICONS = {
  //! terser rewrites $ICONS as first parameter for IIFE
  // text: "box:100;fill:red;<text x='45' y='75' font-size='40' font-family='arial' text-anchor='middle'>{is}</text>",
  // dot1: "box:10;path:M5 5m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0,fill='red';scale:.2",
  // dot2: "top:{d1}",
  // dot3: "box:10;icon:dot2",
  // dot4: "icon:dot3",
  // dot5: "box:10;icon:dot4;icon:dot1",
  // dot6: "box:10;icon:dot5",
};
!((
  ICONS,
  FUNCs = {
    path: (d, attrs = "") => `<path d='${d}' ${attrs}/>`,
    // text: () => <text x='' y='' font-size='' font-family='' text-anchor=''></text>`
    // circle: (radius, cx, cy) => `<circle cx='${cx}' cy='${cy}' r='${radius}'/>`,
    // polyline: points => `<polyline points='${points}'/>`,
    // polygon: points => `<polygon points='${points}'/>`,
    // line: (x1, y1, x2, y2) => `<line x1='${x1}' y1='${y1}' x2='${x2}' y2='${y2}'/>`,
    // rect: (x, y, w, h, radius = 0, attrs = "") => `<rect width='${w}' height='${h}' x='${x}' y='${y}' rx='${radius}' ${attrs}/>`,
  }, // Functions
  Attrs = {
    // Custom Element Observed Attributes
    is: "", // ICONs[is]
    svg: 0, // create img (default) or raw SVG
    box: 9, // viewbox='0 0 n n' parsed from Icon string: "box:24;path:..."
    rect: "<rect width='100%' height='100%' fill='{tile}' {border}/>",
    border: "",
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
    $: FUNCs, // Custom Element is API for ICONs
    icons: ICONS, // Custom Element is API for ICONs
  } // Attributes
) => {
  customElements.define(
    "svg-icon",
    class extends HTMLElement {
      static get observedAttributes() {
        return Object.keys(Attrs);
      }
      attributeChangedCallback() {
        this.icon();
      }
      icon(
        THIS = this,
        command = THIS.A || // first init
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
                (FUNCs[attr] = (t) => (THIS.A[attr] = t))
                //----------------------------------------------------------------------
              ) // end defineProperty
          ), // end .map((attr) one time init
        VAR1 = THIS.box / 2,
        svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${
          THIS.w || THIS.box
        } ${THIS.h || THIS.box}'>${`${
          THIS.rect
        }<g stroke='{stroke}' stroke-width='{width}' fill='{fill}' opacity='{opacity}' transform='translate({xy}) matrix({scale} 0 0 {scale} ${
          VAR1 - VAR1 * THIS.scale
        } ${VAR1 - VAR1 * THIS.scale}) rotate({rotate} ${VAR1} ${VAR1})'>${(
          ICONS[THIS.is] || "path:m3 3h3v3h-3z"
        ).split`;`.map(
          (cmd) => (
            ([command, VAR1] = cmd.trim().split`:`),
            FUNCs[command]
              ? FUNCs[command].apply(THIS, VAR1.split`,`) //execute
              : cmd // no command exists, return (bare SVG) string
          )
        ).join``}</g>{top}`.replace(
          /{\s?([^{}\s]*)\s?}/g,
          (sub, val) => THIS[val]
        )}</svg>`
      ) {
        THIS.innerHTML = THIS.svg
          ? svg
          : `<img src="data:image/svg+xml,${svg.replace(/#/g, "%23")}">`;
      }
    } /// end define Custom Element
  );
})($ICONS);
