/**
 * This modules contains the functions that draw the map
 * and animate the cyber attacks.
 */

(function() {

/**
 * CONSTANTS 
 */
const WIDTH = 960;
const HEIGHT = 580;
const TRANS_DURATION = 1500;
const COLORS = [
  'rgb(255, 179, 186)',
  'rgb(255, 223, 186)',
  'rgb(255, 255, 186)',
  'rgb(186, 255, 201)',
  'rgb(186, 225, 255)'
];

/**
 * HELPER FUNCTIONS 
 */
function rndRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function unitVector(x1, y1, x2, y2) {
  const v = [x2-x1, y2-y1];
  const norm = Math.sqrt(Math.pow(v[0], 2), Math.pow(v[1], 2));
  return [v[0]/norm, v[1]/norm];
};

/**
 * INIT D3 OBJECTS
 */
const projection = d3.geo.equirectangular()
    .scale(HEIGHT / Math.PI)
    .translate([WIDTH / 2, HEIGHT / 2]);

const path = d3.geo.path()
    .projection(projection);

const svg = d3.select("body").append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT);

module.exports.drawMap = () => {

  svg.append("defs").append("path")
      .datum({type: "Sphere"})
      .attr("id", "sphere")
      .attr("d", path);

  svg.append("use")
      .attr("class", "stroke")
      .attr("xlink:href", "#sphere");

  svg.append("use")
      .attr("class", "fill")
      .attr("xlink:href", "#sphere");


  /**
   * LOAD MAP DATA 
   */
  d3.json("./data/world-110m.json", (error, world) => {

    if (error) throw error;

    const countries = topojson.feature(world, world.objects.countries).features;

    svg.selectAll(".country")
        .data(countries)
      .enter().insert("path", ".graticule")
        .attr("class", "country")
        .attr("d", path)

    svg.insert("path", ".graticule")
        .datum(topojson.mesh(world, world.objects.countries, (a, b) => a !== b))
        .attr("class", "boundary")
        .attr("d", path);

  });

  d3.select(self.frameElement).style("height", HEIGHT + "px");

}

module.exports.animateCyberAttack = (p1, p2) => {

  /**
   * First we plot the points on the map by projecting the
   * lat/lng coordinates to the Cartesian plane.
   */
  const toCartesian = axis => d => {
    return projection([d.lng, d.lat])[axis === "x" ? 0 : 1]
  };
  const color = COLORS[rndRange(0, COLORS.length)];
  const radius = "14px";

  const circle = svg.selectAll("circle")
      .data([p1, p2], d => d.name);

  const impactRadius = () => `${rndRange(14, 48)}px`;

  circle.enter().append("circle")
      .attr("r", radius)
      .attr("stroke", color)
      .attr("stroke-opacity", 0.5)
      .attr("stroke-width", 4)
      .attr("fill", "transparent");

  circle
      .attr("cx", toCartesian("x"))
      .attr("cy", toCartesian("y"))
    // Following transition handles impact at origin
    .transition().duration(TRANS_DURATION).ease("linear")
      .attr("r", d => d.name === p1.name ? impactRadius() : radius)
      .attr("stroke-opacity", d => d.name === p1.name ? 0 : 1)
    // Following transition handles impact at destination
    .transition().delay(TRANS_DURATION).duration(500).ease("linear")
      .attr("r", d => d.name === p2.name ? impactRadius() : radius)
      .attr("stroke-opacity", 0.1)
      .remove();

  /**
   * Then we draw the arrow that shoots between the points.
   *
   * We start by finding the unit vector of the vector between the two
   * points in order to draw a segment of the straight line between them,
   * extending from point A.
   *
   * Then we simply transition the line segment towards point B.
   */
  const x1 = toCartesian("x")(p1);
  const y1 = toCartesian("y")(p1);
  const x2 = toCartesian("x")(p2);
  const y2 = toCartesian("y")(p2);

  const [u1, u2] = unitVector(x1, y1, x2, y2);
  const dist = 30; // Arrow length

  const line = svg.selectAll("line")
      .data([p1], d => d.name);

  line.enter().append("line")
      .style("stroke", color)
      .attr("stroke-opacity", 0.7)
      .style("stroke-width", 3);

  line
      .attr("x1", x1)
      .attr("y1", y1)
      .attr("x2", x1 + dist*u1)
      .attr("y2", y1 + dist*u2)
    .transition().duration(TRANS_DURATION)
      .ease("cubic")
      .attr("x1", x2 - dist*u1)
      .attr("y1", y2 - dist*u2)
      .attr("x2", x2)
      .attr("y2", y2)
      .remove();

};

})();
