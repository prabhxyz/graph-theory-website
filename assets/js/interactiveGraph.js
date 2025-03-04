document.addEventListener('DOMContentLoaded', function () {
  const svg = d3.select("#interactiveGraph svg");
  const width = +svg.attr("width");
  const height = +svg.attr("height");

  const nodes = [
    { id: "A", info: "This is node A" },
    { id: "B", info: "This is node B" },
    { id: "C", info: "This is node C" },
    { id: "D", info: "This is node D" },
    { id: "E", info: "This is node E" }
  ];

  const links = [
    { source: "A", target: "B" },
    { source: "A", target: "C" },
    { source: "B", target: "C" },
    { source: "C", target: "D" },
    { source: "D", target: "E" }
  ];

  // Force simulation
  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(100))
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("attractX", d3.forceX(width / 2).strength(0.05))
    .force("attractY", d3.forceY(height / 2).strength(0.05));

  const link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter().append("line");

  const node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .enter().append("circle")
    .attr("r", 15)
    .attr("fill", "#69b3a2")
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended))
    .on("click", (event, d) => {
      alert(d.info);
    });

  const label = svg.append("g")
    .attr("class", "labels")
    .selectAll("text")
    .data(nodes)
    .enter().append("text")
    .attr("text-anchor", "middle")
    .attr("dy", 4)
    .text(d => d.id);

  simulation.on("tick", () => {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);

    label
      .attr("x", d => d.x)
      .attr("y", d => d.y);
  });

  // Optional: Attract nodes to mouse
  svg.on("mousemove", function(event) {
    const [mx, my] = d3.pointer(event);
    simulation.force("attractX", d3.forceX(mx).strength(0.1));
    simulation.force("attractY", d3.forceY(my).strength(0.1));
    simulation.alphaTarget(0.3).restart();
  })
  .on("mouseout", function() {
    simulation.force("attractX", d3.forceX(width/2).strength(0.05));
    simulation.force("attractY", d3.forceY(height/2).strength(0.05));
  });

  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
});
