const corsPrefix = "https://viviify.com:8080/";
let svg = null;
let timer = null;

const drawWords = words => {
    const width = 1600;
    const height = 1600;

    svg = d3.select("#svg-container")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .classed("svg-content", true)
        .call(d3.zoom().on("zoom", (event) => {
            svg.attr("transform", event.transform)
        }))
        .append("g");

    const nodes = [];
    const links = [];

    const mainNodeSize = 100;
    const MANY_BODY_STRENGTH = -20;

    const addMainNode = (
        node,
        size,
        color,
        fontSize
    ) => {
        node.size = size;
        node.color = color;
        node.fontSize = fontSize;
        nodes.push(node);
    };

    const addChildNode = (
        parentNode,
        childNode,
        size,
        color,
        fontSize,
        distance
    ) => {
        childNode.size = size;
        childNode.color = color;
        childNode.fontSize = fontSize;
        nodes.push(childNode);
        links.push({
            source: parentNode,
            target: childNode,
            distance: distance,
        });
    };

    const capitalize = word => {
        return word.replace(/\b\w/g, l => l.toUpperCase());
    }

    let colorIndex = 0;
    const getColor = (lightness) => {
        return `hsl(${(colorIndex++ * 25) % 360}, 100%, ${lightness}`;
    }

    const mainNode = { id: capitalize(words.word) };
    addMainNode(mainNode, mainNodeSize, getColor("78%"), "20px");
    mainNode.fx = width / 2;
    mainNode.fy = height / 2;

    for (const c1 of words.children) {
        const childNode1 = { id: capitalize(c1.word) };
        addChildNode(mainNode, childNode1, mainNodeSize * 0.6, getColor("80%"), "12px", 300);

        for (const c2 of c1.children) {
            const childNode2 = { id: capitalize(c2.word) };
            addChildNode(childNode1, childNode2, mainNodeSize * 0.6 * 0.6, getColor("82%"), "8px", 200);

            for (const c3 of c2.children) {
                const childNode3 = { id: capitalize(c3.word) };
                addChildNode(childNode2, childNode3, mainNodeSize * 0.6 * 0.6 * 0.6, getColor("84%"), "5px", 100);
            }
        }
    }

    const simulation = d3.forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(MANY_BODY_STRENGTH))
        .force("link", d3.forceLink(links).distance((link) => link.distance))
        .force("center", d3.forceCenter(width / 2, height / 2));

    const dragInteraction = d3.drag().on("drag", (event, node) => {
        node.fx = event.x;
        node.fy = event.y;
        simulation.alpha(1.5);
        simulation.restart();
    });

    const callAlpha = () => {
        simulation.alpha(1.5);
        timer = window.setTimeout(callAlpha, 10);
    }
    callAlpha();

    const lines = svg
        .selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("stroke", "rgb(230, 230, 230)");

    const circles = svg
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("fill", (node) => node.color || "rgb(230, 230, 230)")
        .attr("r", (node) => node.size)
        .call(dragInteraction);

    const text = svg
        .selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .style("pointer-events", "none")
        .style("font-size", (node) => node.fontSize)
        .style("fill", "rgb(40, 40, 40)")
        .text((node) => node.id);

    simulation.on("tick", () => {
        circles.attr("cx", (node) => node.x).attr("cy", (node) => node.y);
        text.attr("x", (node) => node.x).attr("y", (node) => node.y);

        lines
            .attr("x1", (link) => link.source.x)
            .attr("y1", (link) => link.source.y)
            .attr("x2", (link) => link.target.x)
            .attr("y2", (link) => link.target.y);
    });
}

const getWordsData = async word => {
    const url = `${corsPrefix}http://104.248.224.60:5000/api/v1/flask/data`;
    const options = { method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" }, body: JSON.stringify({ word: word }) };
    const res = await fetch(url, options);
    const json = await res.json();
    return json;
}

window.onload = async () => {
    const title = document.getElementById("title");
    const textArea = document.getElementById("text-area");
    const brainstorm = document.getElementById("brainstorm");

    title.addEventListener("click", () => {
        window.location.href = "/";
    });

    textArea.addEventListener("keydown", (event) => {
        const key = event.keyCode || event.which;
        if (key === 13) {
            event.preventDefault();
            brainstorm.click();
        }
    });

    brainstorm.addEventListener("click", async () => {
        const word = textArea.value.trim().toLowerCase();
        if (!word.length) {
            alert("Please type any text.");
            textArea.value = "";
            return;
        }
        if (timer) {
            clearTimeout(timer);
        }
        if (svg) {
            d3.select("#svg-container").selectAll("svg").remove();
            const svgContainer = document.getElementById("svg-container");
            svgContainer.innerHTML = "";
        }
        // sends the word and returns words data
        const data = await getWordsData(word);
        if (data.error) {
            alert("Error:", data.message);
            return;
        }
        drawWords(data.words);
    });
}