/**
 * IconMeister JavaScript is optimized for smallest GZIP size
 */
!((
  // IIFE defining IconMeister <svg-icon> Custom Element
  // IIFE parameter:
  ICONS, //! icons object in first parameter of IIFE at end of source code
  FUNCs = {
    // internal SVG creation functions
    path: (d, attrs = "") => `<path d='${d}' ${attrs}/>`,
    //! ALL attributes also become functions here!

    //!! optional SVG creation functions for more advanced SVG (see FlagMeister.Github.io)
    // circle: (radius, cx, cy) => `<circle cx='${cx}' cy='${cy}' r='${radius}'/>`,
    // polyline: points => `<polyline points='${points}'/>`,
    // polygon: points => `<polygon points='${points}'/>`,
    // line: (x1, y1, x2, y2) => `<line x1='${x1}' y1='${y1}' x2='${x2}' y2='${y2}'/>`,
    // rect: (x, y, w, h, r = 0, a = "") => `<rect width='${w}' height='${h}' x='${x}' y='${y}' rx='${r}' ${a}/>`,
  },
  Attrs = {
    //! Custom Element Observed Attributes - every attribute is made into a Getter/Setter also
    //!! The (irrelevant) order here is optimized for GZip compression
    stroke: "#000", // default black
    rect: "<rect width='100%' height='100%' fill='{tile}' {border}/>", // background SVG rectangle
    fill: "none", // fill color (many paths in iconsets are not draw to show fill color)
    tile: "none", // icon background color
    img: 1, //      create img (default) or raw SVG (img any value but "1")
    width: 1, //    stroke-width
    scale: 1, //    0 - 1 range
    opacity: 1, //  0 - 1 range
    is: "", //      ICONs[is] iconstring definition (no, this is NOT a Customized-Built-In-Element!)
    border: "", //  border around default (background) rect-angle - can be any valid SVG attributes string
    filter: "", //  if you know your SVG filters
    top: "", //     ANY valid SVG is added on top of the icon
    v1: "", //      optional Variable
    v2: "", //      optional Variable
    v3: "", //      optional Variable
    box: 9, //      default viewbox='0 0 9 9' or mostly parsed from Icon string defition: "icon": "box:24;path:..."
    rotate: 0, //   0 - 360 range
    xy: 0, //       translate(xy) offset in "X Y" notation
    w: 0, //        override viewBox width
    h: 0, //        override viewBox height
    api: [ICONS, FUNCs], // Custom Element is API for ICONs and FUNCs, add icons in getElementById(x).$[0]
  } // end Attributes definition
) => {
  // IIFE Function:
  customElements.define(
    "svg-icon",
    class extends HTMLElement {
      static get observedAttributes() {
        return Object.keys(Attrs);
      }
      attributeChangedCallback() {
        //! callback does NOT fire when <svg-icon> has NO attributes
        this.svg();
      }
      svg(
        //! svg() does not take parameters!
        //! everything here is declared here as 'parameter' to prevent additional LET declarations and GZip better
        THIS = this, // saves an extra GZip byte
        letFunc = THIS.A || // letFunc variable is used in later [func,pars] code below, saves a let declaration
          /* if THIS.A is declared do NOT do init code again,
             using capital A so GZip re-uses the A from observedAttributes
         */
          /****************************************************************** one time init */
          Object.keys(
            (THIS.A = { ...Attrs }) //! THIS.A is LOCAL copy in every Element for all attributes
          ).map(
            // map is shorter than forEach
            (attr) =>
              Object.defineProperty(
                //! create Getter/Setter for every attribute
                THIS,
                attr,
                {
                  // set: (val) => this[val == null ? "remove" : "set" + "Attribute"](a, val),
                  set: (val) => THIS.setAttribute(attr, val),
                  get: () =>
                    // get:
                    // (1) Attribute OR
                    // (2) get a CSS property value OR
                    // (3) use the THIS.A Attribute definition
                    THIS.getAttribute(attr) || // get DOM element attribute value //! 0 value is false!!
                    // CSS property: { --svg-icon-rect: "<rect ...>"} //! using quotes keeps IDE quiet
                    getComputedStyle(THIS)
                      .getPropertyValue(`--svg-icon-${attr}`) // read CSS prop --svg-icon-[attr]
                      .replace(/"/g, "") //! strip " from CSS property value,
                      .trim() || // trim spaces becuase CSS property is declared immediatly after semi-colon!
                    THIS.A[attr], // return (default or set) attribute value
                },
                //----------------------------------------------------------------------
                //! Code-golf saves bytes, abuse non used 4th parameter
                // create Function setter for all attributenames "box:36;fill:black"
                (FUNCs[attr] = (t) => ((THIS.A[attr] = t), "")) // Return "" to not include ghost chars in SVG
                //----------------------------------------------------------------------
              ) // end defineProperty
          ), // end .map((attr)
        /****************************************************************** end one time init */

        letPars, // declare variable, prevents a LET inside icon parser

        //! Icon string parser "box:24;width:2;path:...;<circle>"
        // box and width where created as function (4th defineProperty), path was defined as function in FUNCs above
        icon = (ICONS[THIS.is] || "").split`;`.map(
          //!! todo can we do without || "" ?
          (cmd) => (
            ([letFunc, letPars] = cmd.trim().split`:`),
            FUNCs[letFunc] // if a function exists
              ? FUNCs[letFunc].apply(THIS, letPars.split`,`) //execute with all parameters
              : cmd // no command exists, return (bare SVG) string eg: <circle>
          )
        ).join``,

        // for testing purposes
        // log = console.assert(THIS.is != "f-arrow-left", THIS.is, ICONS[THIS.is], icon),

        // replacing halfbox below SAVES 2 GZbytes, ADDS 26 Minified bytes, this saves 5 additional calcs
        halfbox = THIS.box / 2,

        //inline vertical-align hides font gutter under element, you never want to show that 5px (depending on font-size) space for qpg letters below the base-line
        svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${THIS.w || THIS.box} ${
          THIS.h || THIS.box
        }' style='vertical-align:top'>${
          THIS.rect
        }<g stroke-width='{width}' stroke='{stroke}' fill='{fill}' opacity='{opacity}' filter='{filter}' transform='translate({xy}) matrix({scale} 0 0 {scale} ${
          halfbox - halfbox * THIS.scale
        } ${halfbox - halfbox * THIS.scale}) rotate({rotate} ${halfbox} ${halfbox})'>${icon}</g>${
          THIS.top
        }</svg>`.replace(
          /{\s?([^{}\s]*)\s?}/g,
          // /{([^{}\s]*)}/g,//! shorter & seems to work also, needs more testing
          (sub, val) => THIS[val]
        )
      ) {
        return (THIS.innerHTML =
          THIS.img == 1
            ? // return dataURL
              `<img style='vertical-align:top' src="data:image/svg+xml,${svg.replace(/#/g, "%23")}">`
            : // or raw inline SVG
              svg);
      } /// end .svg() method
    } // end class extends HTMLElement
  ); /// end define Custom Element
})(
  /* IIFE parameters: */
  {
    // ICONs
    iconmeister: "iconmeister", //! in .min file replaced with Icon String data (by marker in IconMeister index.html)
    // im: "box:9;path:m3 3h3v3h-3z",
    // text: "box:100;fill:red;<text x='45' y='75' font-size='40' font-family='arial' text-anchor='middle'>{is}</text>",
    // dot1: "box:10;path:M5 5m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0,fill='red';scale:.2",
  } /// end ICONS parameter
);
