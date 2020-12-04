////////////////////////////////////////////////////////////// 
//////////////////////// Constants /////////////////////////// 
////////////////////////////////////////////////////////////// 

const pi2 = 2 * Math.PI 
const pi1_2 = Math.PI / 2

const numData = 406 // = 60 * 24 -> minutes per day 389
const dotRadius = 0 // these are the little grey data dots

//Locations of visual elements based on the data
const averageBabies = 10 // the yellow baseline 
const maxBabies = 15 //helps with red coloring 
const minBabies = 5 // helps with blue coloring 
const axisLocation = 15 //location of the title (months etc) 
const gridLineData = [9.1, 10.9] // dotted lines for grid
const gridLineData1 = [9.1]  // title of negative dotted grid lines
const gridLineData2 = [10.9]
// Change the label on line 300
const outerCircleShadow = 17
const axisLocation2 = 17

//Colors

// Outside Band Colors (13 bands)
// Original red color scheme: ['#ffa500', '#fb9200', '#f58200', '#ee7000', '#e65e00', '#dd4c01', '#d13a01', '#c12e03', '#b02404', '#9f1905', '#8e1005', '#7d0603', '#6b0101']

const colorsRed = ['#0d4982', '#0d4982', '#1d6092', '#1d6092', '#2c79a1', '#2c79a1', '#3294a5', '#3294a5', '#1ab29d', '#1ab29d', '#1ab29d', '#1ab29d', '#1ab29d'] 


// Inside Band Colors (5 bands)
// Original blue color scheme: ['#0d4982', '#1d6092', '#2c79a1', '#3294a5', '#1ab29d']

const colorsBlue = ['#7d0603', '#8e1005', '#9f1905', '#b02404', '#c12e03'] 

////////////////////////////////////////////////////////////// 
//////////////////////// Create SVG //////////////////////////
////////////////////////////////////////////////////////////// 

const margin = {
    top: 120,
    right: 20,
    bottom: 150,
    left: 20
}
const width = 1250 - margin.left - margin.right
const height = 900 - margin.top - margin.bottom

//SVG container - using d3's margin convention
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + (margin.left + width / 2) + "," + (margin.top + height / 2) + ")")


//////////////////////////////////////////////////////////////
////////////////////// Create scales /////////////////////////
//////////////////////////////////////////////////////////////

//Angle scale for the time
const timeScale = d3.scaleLinear()
    .domain([0, numData-1])
    .range([0.025 * pi2, 0.975 * pi2])

//Radius scale for the number of births
const birthScale = d3.scaleLinear()
    .domain([0, maxBabies])
    .range([0, height/2])

//Area between the loess line and the average line
const areaScale = d3.radialArea()
    .angle(d => timeScale(d.time) )
    .innerRadius(d => birthScale(d.line))
    .outerRadius(d => birthScale(averageBabies))

////////////////////////////////////////////////////////////// 
///////////////////// Create SVG effects ///////////////////// 
//////////////////////////////////////////////////////////////

const defs = svg.append("defs")

//Create a shadow filter
const filter = defs.append("filter").attr("id","shadow")
filter.append("feColorMatrix")
    .attr("type", "matrix")
    .attr("values", "0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 0 0.1 0")
    filter.append("feGaussianBlur")
    .attr("stdDeviation","5")
    .attr("result","coloredBlur")
const feMerge = filter.append("feMerge")
feMerge.append("feMergeNode").attr("in","coloredBlur")
feMerge.append("feMergeNode").attr("in","SourceGraphic")

//Create background "chart-area" circle
svg.append("circle")
    .attr("r", birthScale(outerCircleShadow))
    .style("fill", "white")
    .style("filter", "url(#shadow)")

//////////////////////////////////////////////////////////////
///////////////////////// Add title //////////////////////////
//////////////////////////////////////////////////////////////
svg.append("text")
    .attr("class", "title-top1")
    .attr("y", -45)
    .attr("x", -72)
    .text("Trailing 5-Day")
    .attr("font-family", function (d, i) { return i < 5 ? "arial" : "arial"; })


svg.append("text")
    .attr("class", "title-top")
    .attr("y", -20)
    .attr("x", -65)
    .text("Fiserv Stock")
    .attr("font-family", "arial")
    //.style("font-size","32")
    //.style("fill", "#ff6600")
   

//svg.append("text")
//    .attr("class", "title-bottom")
//    .attr("y", 22)
//    .style("font-size", "20")
//    .text("Outperformance / Underperformace")

svg.append("text")
    .attr("class", "Outperformance")
    .attr("y", 15)
    //.attr("x", -132)
    .text("Outperformance")
    .attr("font-family", "arial")

svg.append("text")
    .attr("class", "textSlash")
    .attr("y", 15)
    .attr("x", 90)
    .text("/")
    .attr("font-family", "arial")

svg.append("text")
    .attr("class", "Underperformance")
    .attr("y", 36)
    /*.attr("x", 16)*/
    .text("Underperformance")
    .attr("font-family", "arial")

svg.append("text")
    .attr("class", "vsSentence")
    .attr("y", 59)
    //.attr("x", 1)
    .style("font-size", "18")
    .text("vs. the S&P 500")
    .attr("font-family", "arial")

//////////////////////////////////////////////////////////////
////////////////////// Draw time labels //////////////////////
//////////////////////////////////////////////////////////////

const times = ["\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0Monday", "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0Tuesday", "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0Wednesday", "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0Thursday", "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0Friday"]
    //,"noon", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm", "11pm"]

const timeLabels = svg.append("g")
    .attr("class", "time-label-group")
    .attr("font-family", "arial")

//Will calculate starting and ending angles
const pie = d3.pie()
    .startAngle(timeScale(0)) //Because we're not using a full 2*pi circle
    .endAngle(timeScale(numData-1)) //Because we're not using a full 2*pi circle
    .value(81) //Each hour is 60 minutes long CHANGED FROM 60 to 78 ()
    .padAngle(.06) //A bit of space between each slice ************ SPACE BETWEEN GREY LINES
    .sort(null) //Don't sort, but keep the order as in the data

//Will create the SVG arc path formulas
const arc = d3.arc()
    .innerRadius(birthScale(axisLocation)) 
    .outerRadius(birthScale(axisLocation)*1.015) //Make it a very thin donut chart THIS IS THE THICKNESS OF THE GREY LINE under the label

//Draw the arc	
timeLabels.selectAll(".time-axis")
    .data(pie(times))
    .enter().append("path")
    .attr("class", "time-axis")
    .attr("id", (d, i) => "time-label-" + i)
    .attr("d", arc)
    
//Append the time labels
timeLabels.selectAll(".time-axis-text")
    .data(times)
    .enter().append("text")
    .attr("class", "time-axis-text")
    .attr("dy", -7)
    //.attr("x", 135)
    .append("textPath")
    .attr("xlink:href", (d, i) => "#time-label-" + i)
    .attr("font-size", "18px")
    //.style("text-anchor", "middle") //place the text halfway on the arc
    //.attr("startOffset", "22%") //scootch the text clockwise
    .text(d => d)

const times2 = ["9:30 am\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A012:00 pm\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A04:00 pm", "9:30 am\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A012:00 pm\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A04:00 pm", "9:30 am\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A012:00 pm\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A04:00 pm", "9:30 am\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A012:00 pm\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A04:00 pm", "9:30 am\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A012:00 pm\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A04:00 pm"]


//Draw the arc2	
timeLabels.selectAll(".time-axis2")
    .data(pie(times2))
    .enter().append("path")
    .attr("class", "time-axis2")
    .attr("id", (d, i) => "time-label2-" + i)
    .attr("d", arc)

//Append the time labels2
timeLabels.selectAll(".time-axis-text2")
    .data(times2)
    .enter().append("text")
    .attr("class", "time-axis-text2")
    .attr("dy", 19)
    //.attr("x", 135)
    .append("textPath")
    .attr("xlink:href", (d, i) => "#time-label2-" + i)
    .attr("font-size", "12px")
    //.style("text-anchor", "middle") //place the text halfway on the arc
    //.attr("startOffset", "22%") //scootch the text clockwise
    .text(d => d)


//////////////////////////////////////////////////////////////
/////////////////////// Read in data /////////////////////////
//////////////////////////////////////////////////////////////

d3.csv("data/StockDataInput.csv").then((babyData) => {

    //Turn strings into actual numbers
    babyData.forEach(d => {
        d.time = +d.time
        d.births = +d.births
        d.line = +d.line
    })

    //////////////////////////////////////////////////////////////
    /////////////////////// Draw circles /////////////////////////
    //////////////////////////////////////////////////////////////

    //const circles = svg.append("g")
    //    .attr("class", "circle-group")

    ////Using scales in radial
    //circles.selectAll(".circle")
    //    .data(babyData)
    //    .enter().append("circle")
    //    .attr("class", "circle")
    //    .attr("cx", d => birthScale(d.births) * Math.cos(timeScale(d.time) - pi1_2)) //radius * cos(angle)
    //    .attr("cy", d => birthScale(d.births) * Math.sin(timeScale(d.time) - pi1_2)) //radius * sin(angle)
    //    .attr("r", dotRadius)

    //////////////////////////////////////////////////////////////
    ////////////////////// Create clip paths /////////////////////
    //////////////////////////////////////////////////////////////

    const clips = svg.append("g").attr("class", "clip-group")

    clips.append("clipPath")
        .attr("id", "clip-area")
        .append("path")
        .attr("d", areaScale(babyData))

    //////////////////////////////////////////////////////////////
    ///////////////////////// Draw areas /////////////////////////
    //////////////////////////////////////////////////////////////

    const area = svg.append("g")
        .attr("class", "area-group")
        .attr("clip-path", "url(#clip-area)")

    //Create the circles but have them clipped by the area
    area.selectAll(".color-circle-above")
        .data(colorsRed.reverse())
        .enter().append("circle")
        .attr("class", "color-circle-above")
        .attr("r", (d, i) => birthScale(maxBabies) - (birthScale(maxBabies) - birthScale(averageBabies)) / colorsRed.length * i)
        .style("fill", d => d)
        .style("filter", "url(#shadow)")

    //Create the circles but have them clipped by the area
    area.selectAll(".color-circle-below")
        .data(colorsBlue.reverse())
        .enter().append("circle")
        .attr("class", "color-circle-below")
        .attr("r", (d, i) => birthScale(averageBabies) - (birthScale(averageBabies) - birthScale(minBabies)) / colorsBlue.length * i)
        .style("fill", d => d)
        .style("filter", "url(#shadow)")

    //////////////////////////////////////////////////////////////
    ///////////////////// Draw gridlines /////////////////////////
    //////////////////////////////////////////////////////////////

    const gridLines = svg.append("g")
        .attr("class", "gridline-group")

    //Add the axis lines
    gridLines.selectAll(".axis-line")
        .data(gridLineData)
        .enter().append("path")
        .attr("class", "axis-line")
        .attr("d", d => arcPath(birthScale(d)))

    //WORKS gridLines.selectAll(".axis-number")
      //  .data(gridLineData)
      //  .enter().append("text")
      //  .attr("class", "axis-number")
      //  .attr("y", d => -birthScale(d))
      //  .attr("dy", "0.4em")
      //  .text(".axis-number")

    gridLines.selectAll(".axis-number1")
        .data(gridLineData1)
        .enter().append("text")
        .attr("class", "axis-number1")
        .attr("y", d => -birthScale(d))
        .attr("x", -15)
        .attr("dy", "0.4em")
        .text("-0.5%")
        .attr("font-family", "Indie Flower")
        .attr("font-size", "13px")
        .style("fill", "grey")
        .attr("font-family", "arial")
 
    gridLines.selectAll(".axis-number2")
        .data(gridLineData2)
        .enter().append("text")
        .attr("class", "axis-number2")
        .attr("y", d => -birthScale(d))
        .attr("x", -15)
        .attr("dy", "0.4em")
        .text("+0.5%")
        .attr("font-family", "Indie Flower")
        .attr("font-size", "13px")
        .style("fill", "grey")
        .attr("font-family", "arial")

              
    //////////////////////////////////////////////////////////////
    /////////////////////// Draw circles /////////////////////////
    //////////////////////////////////////////////////////////////

    const circlesTop = svg.append("g")
        .attr("class", "circle-group")
        .attr("clip-path", "url(#clip-area)")

    //Using scales in radial
    circlesTop.selectAll(".circle-top")
        .data(babyData)
        .enter().append("circle")
        .attr("class", "circle-top")
        .attr("cx", d => birthScale(d.births) * Math.cos(timeScale(d.time) - pi1_2) ) //radius * cos(angle)
        .attr("cy", d => birthScale(d.births) * Math.sin(timeScale(d.time) - pi1_2) ) //radius * sin(angle)
        .attr("r", dotRadius)

    //////////////////////////////////////////////////////////////
    ///////////////////////// Draw lines /////////////////////////
    //////////////////////////////////////////////////////////////

    //Draw an average line
    const averageLine = svg.append("path")
        .style("stroke-width",5)
        .attr("class", "average-line")
        .attr("d", () => {
            let r = birthScale(averageBabies)
            return arcPath(r)
        })
                     
           
    ////////////////////////////////////////////////////////////// 
    ///////////////////////// Annotations ////////////////////////
    ////////////////////////////////////////////////////////////// 

    const annotations = svg.append("g")
        .attr("class", "annotation-group")
      

    const annotationData = [
        {
            //className: "average-note",
            //note: { title: "S&P 500", label: "Baseline comparison is S&P 500's value ", wrap: 140,},
            
            //data: { births: averageBabies, time: 12 },
            //type: d3.annotationCallout,
            //dy: -70,
            //dx: -130,
            //connector: { end: "dot" }
        }, {
            //className: "real-note",
            //note: {title: "Fiserv Stock Value", label: "Fiserv's stock value over/underperformace compared to S&P 500", wrap: 140 },
            //data: {births: 11, time: 105},
            //type: d3.annotationCallout,
            //dy: -30,
            //dx: 110,
            //connector: { end: "dot" }
        },{
            // Line between Monday and Tuesday (outerline)
            note: { title: " ", label: " ", wrap: 230 },
            data: {births: averageBabies, time: 80},
            type: d3.annotationLabel,
            dy: -25,
            dx: 120,
            //connector: {end: "dot"},
        }, {
            //   //Line between Monday and Tuesday (innerline)
            //note: { title: " ", label: " ", wrap: 230 },
            //data: { births: averageBabies, time: 80 },
            //type: d3.annotationLabel,
            //dy: 20,
            //dx: -120,
        }, {
              // Line between Tuesday and Wednesday (outerline)
            note: { title: " ", label: " ", wrap: 230 },
            data: { births: averageBabies, time: 162 },
            type: d3.annotationLabel,
            dy: 100,
            dx: 73,
        }, {
            //// Line between Tuesday and Wednesday (innerline)
            //note: { title: " ", label: " ", wrap: 230 },
            //data: { births: averageBabies, time: 162 },
            //type: d3.annotationLabel,
            //dy: -105,
            //dx: -75,
        },{
            // Line between Wednesday and Thursday (outerline)
            note: { title: " ", label: " ", wrap: 230 },
            data: { births: averageBabies, time: 244 },
            type: d3.annotationLabel,
            dy: 105,
            dx: -68,
        }, {
            //// Line between Wednesday and Thursday (innerline)
            //note: { title: " ", label: " ", wrap: 230 },
            //data: { births: averageBabies, time: 244 },
            //type: d3.annotationLabel,
            //dy: -105,
            //dx: 68,
        },{
             //Line between Thursday and Friday (outerline)
            note: { title: " ", label: " ", wrap: 230 },
            data: { births: averageBabies, time: 325 },
            type: d3.annotationLabel,
            dy: -25,
            dx: -120,
        }, {
            //// Line between Thursday and Friday (innerline)
            //note: { title: " ", label: " ", wrap: 230 },
            //data: { births: averageBabies, time: 326 },
            //type: d3.annotationLabel,
            //dy: 20,
            //dx: 120,
        }
    ]

    //Set-up the annotation
    const makeAnnotations = d3.annotation()
        .accessors({
            x: d => birthScale(d.births) * Math.cos(timeScale(d.time) - pi1_2),
            y: d => birthScale(d.births) * Math.sin(timeScale(d.time) - pi1_2)
        })
        .notePadding(8)
        .annotations(annotationData)

    //Create the annotation
    annotations.call(makeAnnotations)

    /////////////////////////////////////////////////////////////////////////////
    ///////// Drawing tickmarks along a circle /////////////////////////////////

    //var svg = d3.select('svg');
    const originX = 10;
    const originY = 20;
    const innerCircleRadius1 = 5;
    const outerCircleRadius1 = 10;

    const table = svg.append("circle").attr({
        cx: originX,
        cy: originY,
        r: innerCircleRadius1,
        fill: "purple",
        stroke: "black"
    });

    const outerCircle1 = svg.append("circle").attr({
        cx: originX,
        cy: originY,
        r: outerCircleRadius1,
        fill: "purple",
        stroke: "black"
    });

        
})//d3.csv

////////////////////////////////////////////////////////////// 
/////////////////////// Helper functions /////////////////////
////////////////////////////////////////////////////////////// 

function arcPath(r) {
    let xStart = r * Math.cos(timeScale(0) - pi1_2)
    let yStart = r * Math.sin(timeScale(0) - pi1_2)
    let xEnd = r * Math.cos(timeScale(numData-1) - pi1_2)
    let yEnd = r * Math.sin(timeScale(numData-1) - pi1_2)

    return "M" + [xStart, yStart] + " A" + [r,r] + " 0 1 1 " + [xEnd, yEnd] 
}//function arcPath

