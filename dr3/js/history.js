class History {
    constructor(svg) {
        this.data = [];
        this.user = 0;
        this.count = 0;
        this.links = svg.append("g").attr("class", "linksGrpup");
        this.restart = false;
        //this.dotsGroup = svg.append("g").attr("class", "dotsGroup"); //HACK moved to init

         this.linkTempGroup = svg.append("g").attr("class", "linkTempGroup") ;
        this.linkTemp = undefined;
        this.color = ["red", "blue", "green", "purple", "orange", "yellow", "pink", "brown", "black", "grey"];
    }

    setUser(user) {
        this.user = user;
    }

    addHistory(d) {

       
        var length = this.data.length;
        var lastTarget = length > 0 ? this.data[length - 1].target: d;
  
        const item = {
            user: this.user, 
            source: lastTarget,
            target: d,
            count : this.count,
            timeStamp: Date.now()
        };


      
        //Handle temp line
        this.count = this.count +1;
        this.restart = this.count>3;
        if(this.count>3)
        {
            this.count =0;
            this.linkTempGroup.selectAll("line").remove();
            this.data.push(item);
        }
        else
        {
            this.updateTemp(item);
            this.data.push(item);
        }
        this.update();
    }

    clearHistory() {
        this.data = [];
    }

    showHistory() {
        //combine dummy records to data
        this.data = this.data.concat(pastRecords);
        this.update();
    }

    hideHistory() {
        //combine dummy records to data
        for(var i =0; i< pastRecords.length; i++)
        {
            for(var j =0; j< this.data.length; j++)
            {
                if(pastRecords[i].timeStamp == this.data[j].timeStamp)
                {
                    this.data.splice(j, 1); // 2nd parameter means remove one item only
                }
            }

        }
        console.log(this.data);
        this.links.selectAll("line").remove();
        //this.links = svg.append("g").attr("class", "linksGrpup");
        this.dotsGroup.selectAll("circle").remove();
        //this.dotsGroup = svg.append("g").attr("class", "dotsGroup")
        this.update();
    }

    getHistory() {
        return this.data;
    }

    getLastClick() {
      if(this.data.length > 0)
        return this.data[this.data.length - 1].target;
      else
        return null;
    }

    updateTemp(i)
    {
        this.linkTempGroup.selectAll("line").remove();
        this.linkTemp = this.linkTempGroup.append("line")
        .attr("x1",  i.target.sx)
        .attr("y1",  i.target.sy)
        .attr("x2",  i.target.sx)
        .attr("y2",  i.target.sy)
        .attr("stroke", this.color[i.user])
        .style("stroke-dasharray", ("3, 3"))
        .style("z-index", 0)
        ;
    }

    update()
    {
        // All recorded links

        this.links.selectAll("line")
        .data(this.data)
        .enter()
        .append("line")
        .attr("x1", d=> d.source.sx)
        .attr("y1", d=> d.source.sy)
        .attr("x2", d=> d.target.sx)
        .attr("y2", d=> d.target.sy)
        .attr("stroke", d=> this.color[d.user])
        .attr("opacity", d=> d.count === 0 ? 0 : 0.5)
        ;

        //All recorded nodes
       
        this.dotsGroup.selectAll("circle")
        .data(this.data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d=> d.target.sx)
        .attr("cy", d=> d.target.sy)
        .attr("r", 5)
        .attr("fill", d=> this.color[d.user])
        .attr("stroke", "transparent")
        .attr("stroke-width", 0)
        .attr("opacity", 0.2)
        .attr("z-index", 0)
        ;
        // temp to track mouse movement
  
    } 

    updateOnMove(x,y)
    {

        if(this.linkTemp === undefined) return;

        // update the link position
        this.linkTemp.attr("x2", x)
                     .attr("y2", y);

    }
}

//Dummy history
pastRecords = [
    {
      "user": 0,
      "source": {
        "name": "sence",
        "level": 1,
        "fixed": 1,
        "x": 760,
        "y": 347,
        "text": "Sense",
        "children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "Sence Case A <img src='data/img1.jpg'> </img>",
            "children": null,
            "id": 2,
            "likes": 0,
            "pin": false,
            "parrentIdx": 1,
            "x": 712.6830839652644,
            "y": 216.69835727251188,
            "index": 0,
            "weight": 1,
            "px": 712.7295770119083,
            "py": 216.82479522821475,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "Maybe not only image",
                "id": 3,
                "likes": 0,
                "pin": false,
                "parrentIdx": 2,
                "x": 960,
                "y": 497,
                "index": 0,
                "weight": 1,
                "px": 960,
                "py": 497
              },
              {
                "name": "Case A 2",
                "level": 3,
                "text": "Case A2<img src='data/img3.jpg'> </img>",
                "id": 4,
                "likes": 0,
                "pin": false,
                "parrentIdx": 2,
                "x": 960,
                "y": 497,
                "index": 1,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ]
          },
          {
            "name": "Case B",
            "level": 2,
            "text": "Sence B <img src='data/img4.jpg'> </img>",
            "children": null,
            "id": 5,
            "likes": 0,
            "pin": false,
            "parrentIdx": 1,
            "x": 658.8883354645722,
            "y": 251.45216473168293,
            "index": 1,
            "weight": 1,
            "px": 658.9866236316363,
            "py": 251.5448627097099,
            "_children": [
              {
                "name": "Case B 1",
                "level": 3,
                "text": "Some text here",
                "id": 6,
                "likes": 0,
                "pin": false,
                "parrentIdx": 5,
                "x": 960,
                "y": 497,
                "index": 3,
                "weight": 1,
                "px": 960,
                "py": 497
              },
              {
                "name": "Case B 2",
                "level": 3,
                "text": "CaseB2 <img src='data/img6.jpg'> </img>",
                "id": 7,
                "likes": 0,
                "pin": false,
                "parrentIdx": 5,
                "x": 960,
                "y": 497,
                "index": 4,
                "weight": 1,
                "px": 960,
                "py": 497
              },
              {
                "name": "Case B 3",
                "level": 3,
                "text": "CaseB3 <img src='data/img7.jpg'> </img>",
                "id": 8,
                "likes": 0,
                "pin": false,
                "parrentIdx": 5,
                "x": 960,
                "y": 497,
                "index": 5,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ]
          }
        ],
        "id": 1,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 2,
        "weight": 3,
        "px": 760,
        "py": 347,
        "_children": null,
        "sx": 763,
        "sy": 361,
        "selected": true
      },
      "target": {
        "name": "sence",
        "level": 1,
        "fixed": 1,
        "x": 760,
        "y": 347,
        "text": "Sense",
        "children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "Sence Case A <img src='data/img1.jpg'> </img>",
            "children": null,
            "id": 2,
            "likes": 0,
            "pin": false,
            "parrentIdx": 1,
            "x": 712.6830839652644,
            "y": 216.69835727251188,
            "index": 0,
            "weight": 1,
            "px": 712.7295770119083,
            "py": 216.82479522821475,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "Maybe not only image",
                "id": 3,
                "likes": 0,
                "pin": false,
                "parrentIdx": 2,
                "x": 960,
                "y": 497,
                "index": 0,
                "weight": 1,
                "px": 960,
                "py": 497
              },
              {
                "name": "Case A 2",
                "level": 3,
                "text": "Case A2<img src='data/img3.jpg'> </img>",
                "id": 4,
                "likes": 0,
                "pin": false,
                "parrentIdx": 2,
                "x": 960,
                "y": 497,
                "index": 1,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ]
          },
          {
            "name": "Case B",
            "level": 2,
            "text": "Sence B <img src='data/img4.jpg'> </img>",
            "children": null,
            "id": 5,
            "likes": 0,
            "pin": false,
            "parrentIdx": 1,
            "x": 658.8883354645722,
            "y": 251.45216473168293,
            "index": 1,
            "weight": 1,
            "px": 658.9866236316363,
            "py": 251.5448627097099,
            "_children": [
              {
                "name": "Case B 1",
                "level": 3,
                "text": "Some text here",
                "id": 6,
                "likes": 0,
                "pin": false,
                "parrentIdx": 5,
                "x": 960,
                "y": 497,
                "index": 3,
                "weight": 1,
                "px": 960,
                "py": 497
              },
              {
                "name": "Case B 2",
                "level": 3,
                "text": "CaseB2 <img src='data/img6.jpg'> </img>",
                "id": 7,
                "likes": 0,
                "pin": false,
                "parrentIdx": 5,
                "x": 960,
                "y": 497,
                "index": 4,
                "weight": 1,
                "px": 960,
                "py": 497
              },
              {
                "name": "Case B 3",
                "level": 3,
                "text": "CaseB3 <img src='data/img7.jpg'> </img>",
                "id": 8,
                "likes": 0,
                "pin": false,
                "parrentIdx": 5,
                "x": 960,
                "y": 497,
                "index": 5,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ]
          }
        ],
        "id": 1,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 2,
        "weight": 3,
        "px": 760,
        "py": 347,
        "_children": null,
        "sx": 763,
        "sy": 361,
        "selected": true
      },
      "count": 0,
      "timeStamp": 1698146591239
    },
    {
      "user": 0,
      "source": {
        "name": "sence",
        "level": 1,
        "fixed": 1,
        "x": 760,
        "y": 347,
        "text": "Sense",
        "children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "Sence Case A <img src='data/img1.jpg'> </img>",
            "children": null,
            "id": 2,
            "likes": 0,
            "pin": false,
            "parrentIdx": 1,
            "x": 712.6830839652644,
            "y": 216.69835727251188,
            "index": 0,
            "weight": 1,
            "px": 712.7295770119083,
            "py": 216.82479522821475,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "Maybe not only image",
                "id": 3,
                "likes": 0,
                "pin": false,
                "parrentIdx": 2,
                "x": 960,
                "y": 497,
                "index": 0,
                "weight": 1,
                "px": 960,
                "py": 497
              },
              {
                "name": "Case A 2",
                "level": 3,
                "text": "Case A2<img src='data/img3.jpg'> </img>",
                "id": 4,
                "likes": 0,
                "pin": false,
                "parrentIdx": 2,
                "x": 960,
                "y": 497,
                "index": 1,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ]
          },
          {
            "name": "Case B",
            "level": 2,
            "text": "Sence B <img src='data/img4.jpg'> </img>",
            "children": null,
            "id": 5,
            "likes": 0,
            "pin": false,
            "parrentIdx": 1,
            "x": 658.8883354645722,
            "y": 251.45216473168293,
            "index": 1,
            "weight": 1,
            "px": 658.9866236316363,
            "py": 251.5448627097099,
            "_children": [
              {
                "name": "Case B 1",
                "level": 3,
                "text": "Some text here",
                "id": 6,
                "likes": 0,
                "pin": false,
                "parrentIdx": 5,
                "x": 960,
                "y": 497,
                "index": 3,
                "weight": 1,
                "px": 960,
                "py": 497
              },
              {
                "name": "Case B 2",
                "level": 3,
                "text": "CaseB2 <img src='data/img6.jpg'> </img>",
                "id": 7,
                "likes": 0,
                "pin": false,
                "parrentIdx": 5,
                "x": 960,
                "y": 497,
                "index": 4,
                "weight": 1,
                "px": 960,
                "py": 497
              },
              {
                "name": "Case B 3",
                "level": 3,
                "text": "CaseB3 <img src='data/img7.jpg'> </img>",
                "id": 8,
                "likes": 0,
                "pin": false,
                "parrentIdx": 5,
                "x": 960,
                "y": 497,
                "index": 5,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ]
          }
        ],
        "id": 1,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 2,
        "weight": 3,
        "px": 760,
        "py": 347,
        "_children": null,
        "sx": 763,
        "sy": 361,
        "selected": true
      },
      "target": {
        "name": "lifeworlds",
        "level": 1,
        "fixed": 1,
        "x": 860,
        "y": 347,
        "text": "Lifeworlds",
        "children": null,
        "id": 9,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 3,
        "weight": 1,
        "px": 860,
        "py": 347,
        "_children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "Lifeworld A <img src='data/img8.jpg'> </img>",
            "children": null,
            "id": 10,
            "likes": 0,
            "pin": false,
            "parrentIdx": 9,
            "x": 839.6208477859166,
            "y": 189.989546503114,
            "index": 3,
            "weight": 1,
            "px": 839.6993920964356,
            "py": 190.82508215426475,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "This has more<img src='data/img9.jpg'> </img>",
                "children": null,
                "id": 11,
                "likes": 0,
                "pin": false,
                "parrentIdx": 10,
                "x": 960,
                "y": 497,
                "index": 10,
                "weight": 3,
                "px": 960,
                "py": 497,
                "_children": [
                  {
                    "name": "Case A 1",
                    "level": 4,
                    "text": "Some detailed text",
                    "id": 12,
                    "likes": 0,
                    "pin": false,
                    "parrentIdx": 11,
                    "x": 960,
                    "y": 497,
                    "index": 8,
                    "weight": 1,
                    "px": 960,
                    "py": 497
                  },
                  {
                    "name": "Case A 2",
                    "level": 4,
                    "text": "Very down to sensing",
                    "id": 13,
                    "likes": 0,
                    "pin": false,
                    "parrentIdx": 11,
                    "x": 960,
                    "y": 497,
                    "index": 9,
                    "weight": 1,
                    "px": 960,
                    "py": 497
                  }
                ]
              },
              {
                "name": "Case A 2",
                "level": 3,
                "text": "<img src='data/img10.jpg'> </img>",
                "id": 14,
                "likes": 0,
                "pin": false,
                "parrentIdx": 10,
                "x": 960,
                "y": 497,
                "index": 11,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ]
          }
        ],
        "sx": 861,
        "sy": 363,
        "selected": true
      },
      "count": 1,
      "timeStamp": 1698146592085
    },
    {
      "user": 0,
      "source": {
        "name": "lifeworlds",
        "level": 1,
        "fixed": 1,
        "x": 860,
        "y": 347,
        "text": "Lifeworlds",
        "children": null,
        "id": 9,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 3,
        "weight": 1,
        "px": 860,
        "py": 347,
        "_children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "Lifeworld A <img src='data/img8.jpg'> </img>",
            "children": null,
            "id": 10,
            "likes": 0,
            "pin": false,
            "parrentIdx": 9,
            "x": 839.6208477859166,
            "y": 189.989546503114,
            "index": 3,
            "weight": 1,
            "px": 839.6993920964356,
            "py": 190.82508215426475,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "This has more<img src='data/img9.jpg'> </img>",
                "children": null,
                "id": 11,
                "likes": 0,
                "pin": false,
                "parrentIdx": 10,
                "x": 960,
                "y": 497,
                "index": 10,
                "weight": 3,
                "px": 960,
                "py": 497,
                "_children": [
                  {
                    "name": "Case A 1",
                    "level": 4,
                    "text": "Some detailed text",
                    "id": 12,
                    "likes": 0,
                    "pin": false,
                    "parrentIdx": 11,
                    "x": 960,
                    "y": 497,
                    "index": 8,
                    "weight": 1,
                    "px": 960,
                    "py": 497
                  },
                  {
                    "name": "Case A 2",
                    "level": 4,
                    "text": "Very down to sensing",
                    "id": 13,
                    "likes": 0,
                    "pin": false,
                    "parrentIdx": 11,
                    "x": 960,
                    "y": 497,
                    "index": 9,
                    "weight": 1,
                    "px": 960,
                    "py": 497
                  }
                ]
              },
              {
                "name": "Case A 2",
                "level": 3,
                "text": "<img src='data/img10.jpg'> </img>",
                "id": 14,
                "likes": 0,
                "pin": false,
                "parrentIdx": 10,
                "x": 960,
                "y": 497,
                "index": 11,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ]
          }
        ],
        "sx": 861,
        "sy": 363,
        "selected": true
      },
      "target": {
        "name": "to describe",
        "level": 1,
        "fixed": 1,
        "x": 950,
        "y": 350,
        "text": "To describe",
        "children": null,
        "id": 15,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 4,
        "weight": 1,
        "px": 950,
        "py": 350,
        "_children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "Describe <img src='data/img11.jpg'> </img>",
            "children": null,
            "id": 16,
            "likes": 0,
            "pin": false,
            "parrentIdx": 15,
            "x": 979.6727116391756,
            "y": 197.12407437715325,
            "index": 4,
            "weight": 1,
            "px": 979.4275265274324,
            "py": 198.64013357507199,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "What<img src='data/img12.jpg'> </img>",
                "id": 17,
                "likes": 0,
                "pin": false,
                "parrentIdx": 16,
                "x": 960,
                "y": 497,
                "index": 14,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ]
          }
        ],
        "sx": 942,
        "sy": 365,
        "selected": true
      },
      "count": 2,
      "timeStamp": 1698146592825
    },
    {
      "user": 0,
      "source": {
        "name": "to describe",
        "level": 1,
        "fixed": 1,
        "x": 950,
        "y": 350,
        "text": "To describe",
        "children": null,
        "id": 15,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 4,
        "weight": 1,
        "px": 950,
        "py": 350,
        "_children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "Describe <img src='data/img11.jpg'> </img>",
            "children": null,
            "id": 16,
            "likes": 0,
            "pin": false,
            "parrentIdx": 15,
            "x": 979.6727116391756,
            "y": 197.12407437715325,
            "index": 4,
            "weight": 1,
            "px": 979.4275265274324,
            "py": 198.64013357507199,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "What<img src='data/img12.jpg'> </img>",
                "id": 17,
                "likes": 0,
                "pin": false,
                "parrentIdx": 16,
                "x": 960,
                "y": 497,
                "index": 14,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ]
          }
        ],
        "sx": 942,
        "sy": 365,
        "selected": true
      },
      "target": {
        "name": "needs & aspirations",
        "level": 1,
        "fixed": 1,
        "x": 1060,
        "y": 347,
        "text": "Needs & aspirations",
        "children": null,
        "id": 18,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 5,
        "weight": 1,
        "px": 1060,
        "py": 347,
        "_children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "<img src='data/img13.jpg'> </img>",
            "children": null,
            "id": 19,
            "likes": 0,
            "pin": false,
            "parrentIdx": 18,
            "x": 1157.7616402071035,
            "y": 235.739187417692,
            "index": 5,
            "weight": 1,
            "px": 1156.7894010040302,
            "py": 236.90851828206573,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img14.jpg'> </img>",
                "id": 20,
                "likes": 0,
                "pin": false,
                "parrentIdx": 19,
                "x": 960,
                "y": 497,
                "index": 17,
                "weight": 1,
                "px": 960,
                "py": 497
              },
              {
                "name": "Case A 2",
                "level": 3,
                "text": "<img src='data/img15.jpg'> </img>",
                "id": 21,
                "likes": 0,
                "pin": false,
                "parrentIdx": 19,
                "x": 960,
                "y": 497,
                "index": 18,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ]
          }
        ],
        "sx": 1056,
        "sy": 364,
        "selected": true
      },
      "count": 3,
      "timeStamp": 1698146593701
    },
    {
      "user": 0,
      "source": {
        "name": "needs & aspirations",
        "level": 1,
        "fixed": 1,
        "x": 1060,
        "y": 347,
        "text": "Needs & aspirations",
        "children": null,
        "id": 18,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 5,
        "weight": 1,
        "px": 1060,
        "py": 347,
        "_children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "<img src='data/img13.jpg'> </img>",
            "children": null,
            "id": 19,
            "likes": 0,
            "pin": false,
            "parrentIdx": 18,
            "x": 1157.7616402071035,
            "y": 235.739187417692,
            "index": 5,
            "weight": 1,
            "px": 1156.7894010040302,
            "py": 236.90851828206573,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img14.jpg'> </img>",
                "id": 20,
                "likes": 0,
                "pin": false,
                "parrentIdx": 19,
                "x": 960,
                "y": 497,
                "index": 17,
                "weight": 1,
                "px": 960,
                "py": 497
              },
              {
                "name": "Case A 2",
                "level": 3,
                "text": "<img src='data/img15.jpg'> </img>",
                "id": 21,
                "likes": 0,
                "pin": false,
                "parrentIdx": 19,
                "x": 960,
                "y": 497,
                "index": 18,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ]
          }
        ],
        "sx": 1056,
        "sy": 364,
        "selected": true
      },
      "target": {
        "name": "analyse",
        "level": 1,
        "fixed": 1,
        "x": 760,
        "y": 497,
        "text": "Analyse",
        "children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "<img src='data/img10.jpg'> </img>",
            "children": null,
            "id": 39,
            "likes": 0,
            "pin": false,
            "parrentIdx": 38,
            "x": 605.9969957631151,
            "y": 500.55459989810237,
            "index": 14,
            "weight": 1,
            "px": 606.1371320534034,
            "py": 500.550768781651,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img2.jpg'> </img>",
                "id": 40,
                "likes": 0,
                "pin": false,
                "parrentIdx": 39,
                "x": 960,
                "y": 497,
                "index": 37,
                "weight": 1,
                "px": 960,
                "py": 497
              },
              {
                "name": "Case A 2",
                "level": 3,
                "text": "<img src='data/img3.jpg'> </img>",
                "id": 41,
                "likes": 0,
                "pin": false,
                "parrentIdx": 39,
                "x": 960,
                "y": 497,
                "index": 38,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ],
            "fixed": 0
          }
        ],
        "id": 38,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 15,
        "weight": 2,
        "px": 760,
        "py": 497,
        "_children": null,
        "sx": 767,
        "sy": 510,
        "selected": true
      },
      "count": 0,
      "timeStamp": 1698146594703
    },
    {
      "user": 0,
      "source": {
        "name": "analyse",
        "level": 1,
        "fixed": 1,
        "x": 760,
        "y": 497,
        "text": "Analyse",
        "children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "<img src='data/img10.jpg'> </img>",
            "children": null,
            "id": 39,
            "likes": 0,
            "pin": false,
            "parrentIdx": 38,
            "x": 605.9969957631151,
            "y": 500.55459989810237,
            "index": 14,
            "weight": 1,
            "px": 606.1371320534034,
            "py": 500.550768781651,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img2.jpg'> </img>",
                "id": 40,
                "likes": 0,
                "pin": false,
                "parrentIdx": 39,
                "x": 960,
                "y": 497,
                "index": 37,
                "weight": 1,
                "px": 960,
                "py": 497
              },
              {
                "name": "Case A 2",
                "level": 3,
                "text": "<img src='data/img3.jpg'> </img>",
                "id": 41,
                "likes": 0,
                "pin": false,
                "parrentIdx": 39,
                "x": 960,
                "y": 497,
                "index": 38,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ],
            "fixed": 0
          }
        ],
        "id": 38,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 15,
        "weight": 2,
        "px": 760,
        "py": 497,
        "_children": null,
        "sx": 767,
        "sy": 510,
        "selected": true
      },
      "target": {
        "name": "potentials",
        "level": 1,
        "fixed": 1,
        "x": 860,
        "y": 572,
        "text": "Potentials",
        "children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "<img src='data/img9.jpg'> </img>",
            "children": null,
            "id": 59,
            "likes": 0,
            "pin": false,
            "parrentIdx": 58,
            "x": 807.9004291112057,
            "y": 701.4522517176038,
            "index": 22,
            "weight": 1,
            "px": 807.9468625053245,
            "py": 701.3431662933303,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img2.jpg'> </img>",
                "id": 60,
                "likes": 0,
                "pin": false,
                "parrentIdx": 59,
                "x": 960,
                "y": 497,
                "index": 57,
                "weight": 1,
                "px": 960,
                "py": 497
              },
              {
                "name": "Case A 2",
                "level": 3,
                "text": "<img src='data/img3.jpg'> </img>",
                "id": 61,
                "likes": 0,
                "pin": false,
                "parrentIdx": 59,
                "x": 960,
                "y": 497,
                "index": 58,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ],
            "fixed": 0
          }
        ],
        "id": 58,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 23,
        "weight": 2,
        "px": 860,
        "py": 572,
        "_children": null,
        "sx": 847,
        "sy": 582,
        "selected": true
      },
      "count": 1,
      "timeStamp": 1698146595369
    },
    {
      "user": 0,
      "source": {
        "name": "potentials",
        "level": 1,
        "fixed": 1,
        "x": 860,
        "y": 572,
        "text": "Potentials",
        "children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "<img src='data/img9.jpg'> </img>",
            "children": null,
            "id": 59,
            "likes": 0,
            "pin": false,
            "parrentIdx": 58,
            "x": 807.9004291112057,
            "y": 701.4522517176038,
            "index": 22,
            "weight": 1,
            "px": 807.9468625053245,
            "py": 701.3431662933303,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img2.jpg'> </img>",
                "id": 60,
                "likes": 0,
                "pin": false,
                "parrentIdx": 59,
                "x": 960,
                "y": 497,
                "index": 57,
                "weight": 1,
                "px": 960,
                "py": 497
              },
              {
                "name": "Case A 2",
                "level": 3,
                "text": "<img src='data/img3.jpg'> </img>",
                "id": 61,
                "likes": 0,
                "pin": false,
                "parrentIdx": 59,
                "x": 960,
                "y": 497,
                "index": 58,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ],
            "fixed": 0
          }
        ],
        "id": 58,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 23,
        "weight": 2,
        "px": 860,
        "py": 572,
        "_children": null,
        "sx": 847,
        "sy": 582,
        "selected": true
      },
      "target": {
        "name": "to test",
        "level": 1,
        "fixed": 1,
        "x": 960,
        "y": 497,
        "text": "To test",
        "children": null,
        "id": 46,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 18,
        "weight": 1,
        "px": 960,
        "py": 497,
        "_children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "<img src='data/img11.jpg'> </img>",
            "children": null,
            "id": 47,
            "likes": 0,
            "pin": false,
            "parrentIdx": 46,
            "x": 1127.3311623587708,
            "y": 509.95833418566065,
            "index": 20,
            "weight": 1,
            "px": 1125.208242199742,
            "py": 509.78242092647474,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img2.jpg'> </img>",
                "id": 48,
                "likes": 0,
                "pin": false,
                "parrentIdx": 47,
                "x": 960,
                "y": 497,
                "index": 45,
                "weight": 1,
                "px": 960,
                "py": 497
              },
              {
                "name": "Case A 2",
                "level": 3,
                "text": "<img src='data/img3.jpg'> </img>",
                "id": 49,
                "likes": 0,
                "pin": false,
                "parrentIdx": 47,
                "x": 960,
                "y": 497,
                "index": 46,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ],
            "fixed": 0
          }
        ],
        "sx": 949,
        "sy": 484,
        "selected": true
      },
      "count": 2,
      "timeStamp": 1698146595886
    },
    {
      "user": 0,
      "source": {
        "name": "to test",
        "level": 1,
        "fixed": 1,
        "x": 960,
        "y": 497,
        "text": "To test",
        "children": null,
        "id": 46,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 18,
        "weight": 1,
        "px": 960,
        "py": 497,
        "_children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "<img src='data/img11.jpg'> </img>",
            "children": null,
            "id": 47,
            "likes": 0,
            "pin": false,
            "parrentIdx": 46,
            "x": 1127.3311623587708,
            "y": 509.95833418566065,
            "index": 20,
            "weight": 1,
            "px": 1125.208242199742,
            "py": 509.78242092647474,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img2.jpg'> </img>",
                "id": 48,
                "likes": 0,
                "pin": false,
                "parrentIdx": 47,
                "x": 960,
                "y": 497,
                "index": 45,
                "weight": 1,
                "px": 960,
                "py": 497
              },
              {
                "name": "Case A 2",
                "level": 3,
                "text": "<img src='data/img3.jpg'> </img>",
                "id": 49,
                "likes": 0,
                "pin": false,
                "parrentIdx": 47,
                "x": 960,
                "y": 497,
                "index": 46,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ],
            "fixed": 0
          }
        ],
        "sx": 949,
        "sy": 484,
        "selected": true
      },
      "target": {
        "name": "ideas",
        "level": 1,
        "fixed": 1,
        "x": 1060,
        "y": 572,
        "text": "Ideas",
        "children": null,
        "id": 67,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 25,
        "weight": 1,
        "px": 1060,
        "py": 572,
        "_children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "Something <img src='data/img2.jpg'> </img>",
            "children": null,
            "id": 68,
            "likes": 0,
            "pin": false,
            "parrentIdx": 67,
            "x": 1202.6738378263458,
            "y": 614.5210005728721,
            "index": 22,
            "weight": 1,
            "px": 1201.0258573485842,
            "py": 614.0563983561958,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img2.jpg'> </img>",
                "id": 69,
                "likes": 0,
                "pin": false,
                "parrentIdx": 68,
                "x": 960,
                "y": 497,
                "index": 66,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ]
          }
        ],
        "sx": 1062,
        "sy": 586,
        "selected": true
      },
      "count": 3,
      "timeStamp": 1698146596604
    },
    {
      "user": 1,
      "source": {
        "name": "ideas",
        "level": 1,
        "fixed": 1,
        "x": 1060,
        "y": 572,
        "text": "Ideas",
        "children": null,
        "id": 67,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 25,
        "weight": 1,
        "px": 1060,
        "py": 572,
        "_children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "Something <img src='data/img2.jpg'> </img>",
            "children": null,
            "id": 68,
            "likes": 0,
            "pin": false,
            "parrentIdx": 67,
            "x": 1202.6738378263458,
            "y": 614.5210005728721,
            "index": 22,
            "weight": 1,
            "px": 1201.0258573485842,
            "py": 614.0563983561958,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img2.jpg'> </img>",
                "id": 69,
                "likes": 0,
                "pin": false,
                "parrentIdx": 68,
                "x": 960,
                "y": 497,
                "index": 66,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ]
          }
        ],
        "sx": 1062,
        "sy": 586,
        "selected": true
      },
      "target": {
        "name": "empower",
        "level": 1,
        "fixed": 1,
        "x": 760,
        "y": 722,
        "text": "Empower",
        "children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "Something <img src='data/img10.jpg'> </img>",
            "children": null,
            "id": 83,
            "likes": 0,
            "pin": false,
            "parrentIdx": 82,
            "x": 691.0860516391654,
            "y": 850.6939181767142,
            "index": 32,
            "weight": 1,
            "px": 691.1471715896378,
            "py": 850.5791518359277,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img2.jpg'> </img>",
                "children": null,
                "id": 84,
                "likes": 0,
                "pin": false,
                "parrentIdx": 83,
                "x": 960,
                "y": 497,
                "index": 82,
                "weight": 2,
                "px": 960,
                "py": 497,
                "_children": [
                  {
                    "name": "Case A 1",
                    "level": 4,
                    "text": "<img src='data/img3.jpg'> </img>",
                    "id": 85,
                    "likes": 0,
                    "pin": false,
                    "parrentIdx": 84,
                    "x": 960,
                    "y": 497,
                    "index": 81,
                    "weight": 1,
                    "px": 960,
                    "py": 497
                  }
                ]
              }
            ]
          }
        ],
        "id": 82,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 33,
        "weight": 2,
        "px": 760,
        "py": 722,
        "_children": null,
        "sx": 766,
        "sy": 726,
        "selected": true
      },
      "count": 0,
      "timeStamp": 1698146599569
    },
    {
      "user": 1,
      "source": {
        "name": "empower",
        "level": 1,
        "fixed": 1,
        "x": 760,
        "y": 722,
        "text": "Empower",
        "children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "Something <img src='data/img10.jpg'> </img>",
            "children": null,
            "id": 83,
            "likes": 0,
            "pin": false,
            "parrentIdx": 82,
            "x": 691.0860516391654,
            "y": 850.6939181767142,
            "index": 32,
            "weight": 1,
            "px": 691.1471715896378,
            "py": 850.5791518359277,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img2.jpg'> </img>",
                "children": null,
                "id": 84,
                "likes": 0,
                "pin": false,
                "parrentIdx": 83,
                "x": 960,
                "y": 497,
                "index": 82,
                "weight": 2,
                "px": 960,
                "py": 497,
                "_children": [
                  {
                    "name": "Case A 1",
                    "level": 4,
                    "text": "<img src='data/img3.jpg'> </img>",
                    "id": 85,
                    "likes": 0,
                    "pin": false,
                    "parrentIdx": 84,
                    "x": 960,
                    "y": 497,
                    "index": 81,
                    "weight": 1,
                    "px": 960,
                    "py": 497
                  }
                ]
              }
            ]
          }
        ],
        "id": 82,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 33,
        "weight": 2,
        "px": 760,
        "py": 722,
        "_children": null,
        "sx": 766,
        "sy": 726,
        "selected": true
      },
      "target": {
        "name": "potentials",
        "level": 1,
        "fixed": 1,
        "x": 860,
        "y": 572,
        "text": "Potentials",
        "children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "<img src='data/img9.jpg'> </img>",
            "children": null,
            "id": 59,
            "likes": 0,
            "pin": false,
            "parrentIdx": 58,
            "x": 807.9004291112057,
            "y": 701.4522517176038,
            "index": 22,
            "weight": 1,
            "px": 807.9468625053245,
            "py": 701.3431662933303,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img2.jpg'> </img>",
                "id": 60,
                "likes": 0,
                "pin": false,
                "parrentIdx": 59,
                "x": 960,
                "y": 497,
                "index": 57,
                "weight": 1,
                "px": 960,
                "py": 497
              },
              {
                "name": "Case A 2",
                "level": 3,
                "text": "<img src='data/img3.jpg'> </img>",
                "id": 61,
                "likes": 0,
                "pin": false,
                "parrentIdx": 59,
                "x": 960,
                "y": 497,
                "index": 58,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ],
            "fixed": 0
          }
        ],
        "id": 58,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 23,
        "weight": 2,
        "px": 860,
        "py": 572,
        "_children": null,
        "sx": 847,
        "sy": 582,
        "selected": true
      },
      "count": 1,
      "timeStamp": 1698146600657
    },
    {
      "user": 1,
      "source": {
        "name": "potentials",
        "level": 1,
        "fixed": 1,
        "x": 860,
        "y": 572,
        "text": "Potentials",
        "children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "<img src='data/img9.jpg'> </img>",
            "children": null,
            "id": 59,
            "likes": 0,
            "pin": false,
            "parrentIdx": 58,
            "x": 807.9004291112057,
            "y": 701.4522517176038,
            "index": 22,
            "weight": 1,
            "px": 807.9468625053245,
            "py": 701.3431662933303,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img2.jpg'> </img>",
                "id": 60,
                "likes": 0,
                "pin": false,
                "parrentIdx": 59,
                "x": 960,
                "y": 497,
                "index": 57,
                "weight": 1,
                "px": 960,
                "py": 497
              },
              {
                "name": "Case A 2",
                "level": 3,
                "text": "<img src='data/img3.jpg'> </img>",
                "id": 61,
                "likes": 0,
                "pin": false,
                "parrentIdx": 59,
                "x": 960,
                "y": 497,
                "index": 58,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ],
            "fixed": 0
          }
        ],
        "id": 58,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 23,
        "weight": 2,
        "px": 860,
        "py": 572,
        "_children": null,
        "sx": 847,
        "sy": 582,
        "selected": true
      },
      "target": {
        "name": "to adapt",
        "level": 1,
        "fixed": 1,
        "x": 960,
        "y": 647,
        "text": "To adapt",
        "children": null,
        "id": 76,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 29,
        "weight": 1,
        "px": 960,
        "py": 647,
        "_children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "Something <img src='data/img6.jpg'> </img>",
            "children": null,
            "id": 77,
            "likes": 0,
            "pin": false,
            "parrentIdx": 76,
            "x": 1013.4126605834361,
            "y": 806.0783731360282,
            "index": 31,
            "weight": 1,
            "px": 1012.9210012693403,
            "py": 804.6297118044675,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img2.jpg'> </img>",
                "id": 78,
                "likes": 0,
                "pin": false,
                "parrentIdx": 77,
                "x": 960,
                "y": 497,
                "index": 75,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ]
          }
        ],
        "sx": 949,
        "sy": 656,
        "selected": true
      },
      "count": 2,
      "timeStamp": 1698146601352
    },
    {
      "user": 1,
      "source": {
        "name": "to adapt",
        "level": 1,
        "fixed": 1,
        "x": 960,
        "y": 647,
        "text": "To adapt",
        "children": null,
        "id": 76,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 29,
        "weight": 1,
        "px": 960,
        "py": 647,
        "_children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "Something <img src='data/img6.jpg'> </img>",
            "children": null,
            "id": 77,
            "likes": 0,
            "pin": false,
            "parrentIdx": 76,
            "x": 1013.4126605834361,
            "y": 806.0783731360282,
            "index": 31,
            "weight": 1,
            "px": 1012.9210012693403,
            "py": 804.6297118044675,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img2.jpg'> </img>",
                "id": 78,
                "likes": 0,
                "pin": false,
                "parrentIdx": 77,
                "x": 960,
                "y": 497,
                "index": 75,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ]
          }
        ],
        "sx": 949,
        "sy": 656,
        "selected": true
      },
      "target": {
        "name": "ideas",
        "level": 1,
        "fixed": 1,
        "x": 1060,
        "y": 572,
        "text": "Ideas",
        "children": null,
        "id": 67,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 25,
        "weight": 1,
        "px": 1060,
        "py": 572,
        "_children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "Something <img src='data/img2.jpg'> </img>",
            "children": null,
            "id": 68,
            "likes": 0,
            "pin": false,
            "parrentIdx": 67,
            "x": 1202.6738378263458,
            "y": 614.5210005728721,
            "index": 22,
            "weight": 1,
            "px": 1201.0258573485842,
            "py": 614.0563983561958,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img2.jpg'> </img>",
                "id": 69,
                "likes": 0,
                "pin": false,
                "parrentIdx": 68,
                "x": 960,
                "y": 497,
                "index": 66,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ]
          }
        ],
        "sx": 1062,
        "sy": 586,
        "selected": true
      },
      "count": 3,
      "timeStamp": 1698146602139
    },
    {
      "user": 3,
      "source": {
        "name": "ideas",
        "level": 1,
        "fixed": 1,
        "x": 1060,
        "y": 572,
        "text": "Ideas",
        "children": null,
        "id": 67,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 25,
        "weight": 1,
        "px": 1060,
        "py": 572,
        "_children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "Something <img src='data/img2.jpg'> </img>",
            "children": null,
            "id": 68,
            "likes": 0,
            "pin": false,
            "parrentIdx": 67,
            "x": 1202.6738378263458,
            "y": 614.5210005728721,
            "index": 22,
            "weight": 1,
            "px": 1201.0258573485842,
            "py": 614.0563983561958,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img2.jpg'> </img>",
                "id": 69,
                "likes": 0,
                "pin": false,
                "parrentIdx": 68,
                "x": 960,
                "y": 497,
                "index": 66,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ]
          }
        ],
        "sx": 1062,
        "sy": 586,
        "selected": true
      },
      "target": {
        "name": "formulate",
        "level": 1,
        "fixed": 1,
        "x": 760,
        "y": 422,
        "text": "Formulate",
        "children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "<img src='data/img16.jpg'> </img>",
            "children": null,
            "id": 23,
            "likes": 0,
            "pin": false,
            "parrentIdx": 22,
            "x": 624.0440613415683,
            "y": 359.91133253064345,
            "index": 6,
            "weight": 1,
            "px": 624.1665402317723,
            "py": 359.9667940484017,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img17.jpg'> </img>",
                "id": 24,
                "likes": 0,
                "pin": false,
                "parrentIdx": 23,
                "x": 960,
                "y": 497,
                "index": 21,
                "weight": 1,
                "px": 960,
                "py": 497
              },
              {
                "name": "Case A 2",
                "level": 3,
                "text": "<img src='data/img3.jpg'> </img>",
                "id": 25,
                "likes": 0,
                "pin": false,
                "parrentIdx": 23,
                "x": 960,
                "y": 497,
                "index": 22,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ]
          }
        ],
        "id": 22,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 7,
        "weight": 2,
        "px": 760,
        "py": 422,
        "_children": null,
        "sx": 768,
        "sy": 427,
        "selected": true
      },
      "count": 0,
      "timeStamp": 1698146605941
    },
    {
      "user": 3,
      "source": {
        "name": "formulate",
        "level": 1,
        "fixed": 1,
        "x": 760,
        "y": 422,
        "text": "Formulate",
        "children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "<img src='data/img16.jpg'> </img>",
            "children": null,
            "id": 23,
            "likes": 0,
            "pin": false,
            "parrentIdx": 22,
            "x": 624.0440613415683,
            "y": 359.91133253064345,
            "index": 6,
            "weight": 1,
            "px": 624.1665402317723,
            "py": 359.9667940484017,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img17.jpg'> </img>",
                "id": 24,
                "likes": 0,
                "pin": false,
                "parrentIdx": 23,
                "x": 960,
                "y": 497,
                "index": 21,
                "weight": 1,
                "px": 960,
                "py": 497
              },
              {
                "name": "Case A 2",
                "level": 3,
                "text": "<img src='data/img3.jpg'> </img>",
                "id": 25,
                "likes": 0,
                "pin": false,
                "parrentIdx": 23,
                "x": 960,
                "y": 497,
                "index": 22,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ]
          }
        ],
        "id": 22,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 7,
        "weight": 2,
        "px": 760,
        "py": 422,
        "_children": null,
        "sx": 768,
        "sy": 427,
        "selected": true
      },
      "target": {
        "name": "concepts",
        "level": 1,
        "fixed": 1,
        "x": 860,
        "y": 422,
        "text": "Concepts",
        "children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "<img src='data/img4.jpg'> </img>",
            "children": null,
            "id": 27,
            "likes": 0,
            "pin": false,
            "parrentIdx": 26,
            "x": 849.2375958164781,
            "y": 265.79974459953496,
            "index": 8,
            "weight": 1,
            "px": 849.2468246028924,
            "py": 265.9427420751518,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img2.jpg'> </img>",
                "id": 28,
                "likes": 0,
                "pin": false,
                "parrentIdx": 27,
                "x": 960,
                "y": 497,
                "index": 25,
                "weight": 1,
                "px": 960,
                "py": 497
              },
              {
                "name": "Case A 2",
                "level": 3,
                "text": "<img src='data/img3.jpg'> </img>",
                "id": 29,
                "likes": 0,
                "pin": false,
                "parrentIdx": 27,
                "x": 960,
                "y": 497,
                "index": 26,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ]
          }
        ],
        "id": 26,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 9,
        "weight": 2,
        "px": 860,
        "py": 422,
        "_children": null,
        "sx": 862,
        "sy": 406,
        "selected": true
      },
      "count": 1,
      "timeStamp": 1698146606741
    },
    {
      "user": 3,
      "source": {
        "name": "concepts",
        "level": 1,
        "fixed": 1,
        "x": 860,
        "y": 422,
        "text": "Concepts",
        "children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "<img src='data/img4.jpg'> </img>",
            "children": null,
            "id": 27,
            "likes": 0,
            "pin": false,
            "parrentIdx": 26,
            "x": 849.2375958164781,
            "y": 265.79974459953496,
            "index": 8,
            "weight": 1,
            "px": 849.2468246028924,
            "py": 265.9427420751518,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img2.jpg'> </img>",
                "id": 28,
                "likes": 0,
                "pin": false,
                "parrentIdx": 27,
                "x": 960,
                "y": 497,
                "index": 25,
                "weight": 1,
                "px": 960,
                "py": 497
              },
              {
                "name": "Case A 2",
                "level": 3,
                "text": "<img src='data/img3.jpg'> </img>",
                "id": 29,
                "likes": 0,
                "pin": false,
                "parrentIdx": 27,
                "x": 960,
                "y": 497,
                "index": 26,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ]
          }
        ],
        "id": 26,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 9,
        "weight": 2,
        "px": 860,
        "py": 422,
        "_children": null,
        "sx": 862,
        "sy": 406,
        "selected": true
      },
      "target": {
        "name": "to frame",
        "level": 1,
        "fixed": 1,
        "x": 960,
        "y": 422,
        "text": "To frame",
        "children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "<img src='data/img8.jpg'> </img>",
            "children": null,
            "id": 31,
            "likes": 0,
            "pin": false,
            "parrentIdx": 30,
            "x": 1026.4112422843148,
            "y": 275.79441370063444,
            "index": 10,
            "weight": 1,
            "px": 1026.3499349725173,
            "py": 275.92936634030366,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img2.jpg'> </img>",
                "id": 32,
                "likes": 0,
                "pin": false,
                "parrentIdx": 31,
                "x": 960,
                "y": 497,
                "index": 29,
                "weight": 1,
                "px": 960,
                "py": 497
              },
              {
                "name": "Case A 2",
                "level": 3,
                "text": "<img src='data/img3.jpg'> </img>",
                "id": 33,
                "likes": 0,
                "pin": false,
                "parrentIdx": 31,
                "x": 960,
                "y": 497,
                "index": 30,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ]
          }
        ],
        "id": 30,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 11,
        "weight": 2,
        "px": 960,
        "py": 422,
        "_children": null,
        "sx": 969,
        "sy": 411,
        "selected": true
      },
      "count": 2,
      "timeStamp": 1698146607541
    },
    {
      "user": 3,
      "source": {
        "name": "to frame",
        "level": 1,
        "fixed": 1,
        "x": 960,
        "y": 422,
        "text": "To frame",
        "children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "<img src='data/img8.jpg'> </img>",
            "children": null,
            "id": 31,
            "likes": 0,
            "pin": false,
            "parrentIdx": 30,
            "x": 1026.4112422843148,
            "y": 275.79441370063444,
            "index": 10,
            "weight": 1,
            "px": 1026.3499349725173,
            "py": 275.92936634030366,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img2.jpg'> </img>",
                "id": 32,
                "likes": 0,
                "pin": false,
                "parrentIdx": 31,
                "x": 960,
                "y": 497,
                "index": 29,
                "weight": 1,
                "px": 960,
                "py": 497
              },
              {
                "name": "Case A 2",
                "level": 3,
                "text": "<img src='data/img3.jpg'> </img>",
                "id": 33,
                "likes": 0,
                "pin": false,
                "parrentIdx": 31,
                "x": 960,
                "y": 497,
                "index": 30,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ]
          }
        ],
        "id": 30,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 11,
        "weight": 2,
        "px": 960,
        "py": 422,
        "_children": null,
        "sx": 969,
        "sy": 411,
        "selected": true
      },
      "target": {
        "name": "problems",
        "level": 1,
        "fixed": 1,
        "x": 1060,
        "y": 422,
        "text": "Problems",
        "children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "<img src='data/img9.jpg'> </img>",
            "children": null,
            "id": 35,
            "likes": 0,
            "pin": false,
            "parrentIdx": 34,
            "x": 1191.183833116277,
            "y": 347.6716939791181,
            "index": 12,
            "weight": 1,
            "px": 1191.0659647070534,
            "py": 347.73841185611894,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img2.jpg'> </img>",
                "id": 36,
                "likes": 0,
                "pin": false,
                "parrentIdx": 35,
                "x": 960,
                "y": 497,
                "index": 33,
                "weight": 1,
                "px": 960,
                "py": 497
              },
              {
                "name": "Case A 2",
                "level": 3,
                "text": "<img src='data/img3.jpg'> </img>",
                "id": 37,
                "likes": 0,
                "pin": false,
                "parrentIdx": 35,
                "x": 960,
                "y": 497,
                "index": 34,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ],
            "fixed": 0
          }
        ],
        "id": 34,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 13,
        "weight": 2,
        "px": 1060,
        "py": 422,
        "_children": null,
        "sx": 1061,
        "sy": 412,
        "selected": true
      },
      "count": 3,
      "timeStamp": 1698146608226
    },
    {
      "user": 3,
      "source": {
        "name": "problems",
        "level": 1,
        "fixed": 1,
        "x": 1060,
        "y": 422,
        "text": "Problems",
        "children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "<img src='data/img9.jpg'> </img>",
            "children": null,
            "id": 35,
            "likes": 0,
            "pin": false,
            "parrentIdx": 34,
            "x": 1191.183833116277,
            "y": 347.6716939791181,
            "index": 12,
            "weight": 1,
            "px": 1191.0659647070534,
            "py": 347.73841185611894,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img2.jpg'> </img>",
                "id": 36,
                "likes": 0,
                "pin": false,
                "parrentIdx": 35,
                "x": 960,
                "y": 497,
                "index": 33,
                "weight": 1,
                "px": 960,
                "py": 497
              },
              {
                "name": "Case A 2",
                "level": 3,
                "text": "<img src='data/img3.jpg'> </img>",
                "id": 37,
                "likes": 0,
                "pin": false,
                "parrentIdx": 35,
                "x": 960,
                "y": 497,
                "index": 34,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ],
            "fixed": 0
          }
        ],
        "id": 34,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 13,
        "weight": 2,
        "px": 1060,
        "py": 422,
        "_children": null,
        "sx": 1061,
        "sy": 412,
        "selected": true
      },
      "target": {
        "name": "analyse",
        "level": 1,
        "fixed": 1,
        "x": 760,
        "y": 497,
        "text": "Analyse",
        "children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "<img src='data/img10.jpg'> </img>",
            "children": null,
            "id": 39,
            "likes": 0,
            "pin": false,
            "parrentIdx": 38,
            "x": 605.9969957631151,
            "y": 500.55459989810237,
            "index": 14,
            "weight": 1,
            "px": 606.1371320534034,
            "py": 500.550768781651,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img2.jpg'> </img>",
                "id": 40,
                "likes": 0,
                "pin": false,
                "parrentIdx": 39,
                "x": 960,
                "y": 497,
                "index": 37,
                "weight": 1,
                "px": 960,
                "py": 497
              },
              {
                "name": "Case A 2",
                "level": 3,
                "text": "<img src='data/img3.jpg'> </img>",
                "id": 41,
                "likes": 0,
                "pin": false,
                "parrentIdx": 39,
                "x": 960,
                "y": 497,
                "index": 38,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ],
            "fixed": 0
          }
        ],
        "id": 38,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 15,
        "weight": 2,
        "px": 760,
        "py": 497,
        "_children": null,
        "sx": 767,
        "sy": 510,
        "selected": true
      },
      "count": 0,
      "timeStamp": 1698146609959
    },
    {
      "user": 3,
      "source": {
        "name": "analyse",
        "level": 1,
        "fixed": 1,
        "x": 760,
        "y": 497,
        "text": "Analyse",
        "children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "<img src='data/img10.jpg'> </img>",
            "children": null,
            "id": 39,
            "likes": 0,
            "pin": false,
            "parrentIdx": 38,
            "x": 605.9969957631151,
            "y": 500.55459989810237,
            "index": 14,
            "weight": 1,
            "px": 606.1371320534034,
            "py": 500.550768781651,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img2.jpg'> </img>",
                "id": 40,
                "likes": 0,
                "pin": false,
                "parrentIdx": 39,
                "x": 960,
                "y": 497,
                "index": 37,
                "weight": 1,
                "px": 960,
                "py": 497
              },
              {
                "name": "Case A 2",
                "level": 3,
                "text": "<img src='data/img3.jpg'> </img>",
                "id": 41,
                "likes": 0,
                "pin": false,
                "parrentIdx": 39,
                "x": 960,
                "y": 497,
                "index": 38,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ],
            "fixed": 0
          }
        ],
        "id": 38,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 15,
        "weight": 2,
        "px": 760,
        "py": 497,
        "_children": null,
        "sx": 767,
        "sy": 510,
        "selected": true
      },
      "target": {
        "name": "data",
        "level": 1,
        "fixed": 1,
        "x": 860,
        "y": 497,
        "text": "Data",
        "children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "<img src='data/img18.jpg'> </img>",
            "children": null,
            "id": 43,
            "likes": 0,
            "pin": false,
            "parrentIdx": 42,
            "x": 710.2333409903225,
            "y": 476.614803819511,
            "index": 16,
            "weight": 1,
            "px": 710.3675801960011,
            "py": 476.63406798105297,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img2.jpg'> </img>",
                "id": 44,
                "likes": 0,
                "pin": false,
                "parrentIdx": 43,
                "x": 960,
                "y": 497,
                "index": 41,
                "weight": 1,
                "px": 960,
                "py": 497
              },
              {
                "name": "Case A 2",
                "level": 3,
                "text": "<img src='data/img3.jpg'> </img>",
                "id": 45,
                "likes": 0,
                "pin": false,
                "parrentIdx": 43,
                "x": 960,
                "y": 497,
                "index": 42,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ]
          }
        ],
        "id": 42,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 17,
        "weight": 2,
        "px": 860,
        "py": 497,
        "_children": null,
        "sx": 858,
        "sy": 481,
        "selected": true
      },
      "count": 1,
      "timeStamp": 1698146610554
    },
    {
      "user": 3,
      "source": {
        "name": "data",
        "level": 1,
        "fixed": 1,
        "x": 860,
        "y": 497,
        "text": "Data",
        "children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "<img src='data/img18.jpg'> </img>",
            "children": null,
            "id": 43,
            "likes": 0,
            "pin": false,
            "parrentIdx": 42,
            "x": 710.2333409903225,
            "y": 476.614803819511,
            "index": 16,
            "weight": 1,
            "px": 710.3675801960011,
            "py": 476.63406798105297,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img2.jpg'> </img>",
                "id": 44,
                "likes": 0,
                "pin": false,
                "parrentIdx": 43,
                "x": 960,
                "y": 497,
                "index": 41,
                "weight": 1,
                "px": 960,
                "py": 497
              },
              {
                "name": "Case A 2",
                "level": 3,
                "text": "<img src='data/img3.jpg'> </img>",
                "id": 45,
                "likes": 0,
                "pin": false,
                "parrentIdx": 43,
                "x": 960,
                "y": 497,
                "index": 42,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ]
          }
        ],
        "id": 42,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 17,
        "weight": 2,
        "px": 860,
        "py": 497,
        "_children": null,
        "sx": 858,
        "sy": 481,
        "selected": true
      },
      "target": {
        "name": "to test",
        "level": 1,
        "fixed": 1,
        "x": 960,
        "y": 497,
        "text": "To test",
        "children": null,
        "id": 46,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 18,
        "weight": 1,
        "px": 960,
        "py": 497,
        "_children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "<img src='data/img11.jpg'> </img>",
            "children": null,
            "id": 47,
            "likes": 0,
            "pin": false,
            "parrentIdx": 46,
            "x": 1127.3311623587708,
            "y": 509.95833418566065,
            "index": 20,
            "weight": 1,
            "px": 1125.208242199742,
            "py": 509.78242092647474,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img2.jpg'> </img>",
                "id": 48,
                "likes": 0,
                "pin": false,
                "parrentIdx": 47,
                "x": 960,
                "y": 497,
                "index": 45,
                "weight": 1,
                "px": 960,
                "py": 497
              },
              {
                "name": "Case A 2",
                "level": 3,
                "text": "<img src='data/img3.jpg'> </img>",
                "id": 49,
                "likes": 0,
                "pin": false,
                "parrentIdx": 47,
                "x": 960,
                "y": 497,
                "index": 46,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ],
            "fixed": 0
          }
        ],
        "sx": 949,
        "sy": 484,
        "selected": true
      },
      "count": 2,
      "timeStamp": 1698146611274
    },
    {
      "user": 3,
      "source": {
        "name": "to test",
        "level": 1,
        "fixed": 1,
        "x": 960,
        "y": 497,
        "text": "To test",
        "children": null,
        "id": 46,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 18,
        "weight": 1,
        "px": 960,
        "py": 497,
        "_children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "<img src='data/img11.jpg'> </img>",
            "children": null,
            "id": 47,
            "likes": 0,
            "pin": false,
            "parrentIdx": 46,
            "x": 1127.3311623587708,
            "y": 509.95833418566065,
            "index": 20,
            "weight": 1,
            "px": 1125.208242199742,
            "py": 509.78242092647474,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img2.jpg'> </img>",
                "id": 48,
                "likes": 0,
                "pin": false,
                "parrentIdx": 47,
                "x": 960,
                "y": 497,
                "index": 45,
                "weight": 1,
                "px": 960,
                "py": 497
              },
              {
                "name": "Case A 2",
                "level": 3,
                "text": "<img src='data/img3.jpg'> </img>",
                "id": 49,
                "likes": 0,
                "pin": false,
                "parrentIdx": 47,
                "x": 960,
                "y": 497,
                "index": 46,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ],
            "fixed": 0
          }
        ],
        "sx": 949,
        "sy": 484,
        "selected": true
      },
      "target": {
        "name": "limits",
        "level": 1,
        "fixed": 1,
        "x": 1060,
        "y": 497,
        "text": "Limits",
        "children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "<img src='data/img12.jpg'> </img>",
            "children": null,
            "id": 51,
            "likes": 0,
            "pin": false,
            "parrentIdx": 50,
            "x": 1209.8317580929258,
            "y": 491.38423971043625,
            "index": 19,
            "weight": 1,
            "px": 1209.6978304921458,
            "py": 491.3892880568534,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img2.jpg'> </img>",
                "id": 52,
                "likes": 0,
                "pin": false,
                "parrentIdx": 51,
                "x": 960,
                "y": 497,
                "index": 49,
                "weight": 1,
                "px": 960,
                "py": 497
              },
              {
                "name": "Case A 2",
                "level": 3,
                "text": "<img src='data/img3.jpg'> </img>",
                "id": 53,
                "likes": 0,
                "pin": false,
                "parrentIdx": 51,
                "x": 960,
                "y": 497,
                "index": 50,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ]
          }
        ],
        "id": 50,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 20,
        "weight": 2,
        "px": 1060,
        "py": 497,
        "_children": null,
        "sx": 1061,
        "sy": 487,
        "selected": true
      },
      "count": 3,
      "timeStamp": 1698146611859
    },
    {
      "user": 3,
      "source": {
        "name": "limits",
        "level": 1,
        "fixed": 1,
        "x": 1060,
        "y": 497,
        "text": "Limits",
        "children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "<img src='data/img12.jpg'> </img>",
            "children": null,
            "id": 51,
            "likes": 0,
            "pin": false,
            "parrentIdx": 50,
            "x": 1209.8317580929258,
            "y": 491.38423971043625,
            "index": 19,
            "weight": 1,
            "px": 1209.6978304921458,
            "py": 491.3892880568534,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img2.jpg'> </img>",
                "id": 52,
                "likes": 0,
                "pin": false,
                "parrentIdx": 51,
                "x": 960,
                "y": 497,
                "index": 49,
                "weight": 1,
                "px": 960,
                "py": 497
              },
              {
                "name": "Case A 2",
                "level": 3,
                "text": "<img src='data/img3.jpg'> </img>",
                "id": 53,
                "likes": 0,
                "pin": false,
                "parrentIdx": 51,
                "x": 960,
                "y": 497,
                "index": 50,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ]
          }
        ],
        "id": 50,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 20,
        "weight": 2,
        "px": 1060,
        "py": 497,
        "_children": null,
        "sx": 1061,
        "sy": 487,
        "selected": true
      },
      "target": {
        "name": "craft",
        "level": 1,
        "fixed": 1,
        "x": 760,
        "y": 647,
        "text": "Craft",
        "children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "Something <img src='data/img3.jpg'> </img>",
            "children": null,
            "id": 71,
            "likes": 0,
            "pin": false,
            "parrentIdx": 70,
            "x": 634.5128140819808,
            "y": 728.0675806691648,
            "index": 26,
            "weight": 1,
            "px": 634.625628259025,
            "py": 727.9944216666283,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img2.jpg'> </img>",
                "id": 72,
                "likes": 0,
                "pin": false,
                "parrentIdx": 71,
                "x": 960,
                "y": 497,
                "index": 69,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ]
          }
        ],
        "id": 70,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 27,
        "weight": 2,
        "px": 760,
        "py": 647,
        "_children": null,
        "sx": 753,
        "sy": 632,
        "selected": true
      },
      "count": 0,
      "timeStamp": 1698146618057
    },
    {
      "user": 3,
      "source": {
        "name": "craft",
        "level": 1,
        "fixed": 1,
        "x": 760,
        "y": 647,
        "text": "Craft",
        "children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "Something <img src='data/img3.jpg'> </img>",
            "children": null,
            "id": 71,
            "likes": 0,
            "pin": false,
            "parrentIdx": 70,
            "x": 634.5128140819808,
            "y": 728.0675806691648,
            "index": 26,
            "weight": 1,
            "px": 634.625628259025,
            "py": 727.9944216666283,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img2.jpg'> </img>",
                "id": 72,
                "likes": 0,
                "pin": false,
                "parrentIdx": 71,
                "x": 960,
                "y": 497,
                "index": 69,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ]
          }
        ],
        "id": 70,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 27,
        "weight": 2,
        "px": 760,
        "py": 647,
        "_children": null,
        "sx": 753,
        "sy": 632,
        "selected": true
      },
      "target": {
        "name": "potentials",
        "level": 1,
        "fixed": 1,
        "x": 860,
        "y": 572,
        "text": "Potentials",
        "children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "<img src='data/img9.jpg'> </img>",
            "children": null,
            "id": 59,
            "likes": 0,
            "pin": false,
            "parrentIdx": 58,
            "x": 807.9004291112057,
            "y": 701.4522517176038,
            "index": 22,
            "weight": 1,
            "px": 807.9468625053245,
            "py": 701.3431662933303,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img2.jpg'> </img>",
                "id": 60,
                "likes": 0,
                "pin": false,
                "parrentIdx": 59,
                "x": 960,
                "y": 497,
                "index": 57,
                "weight": 1,
                "px": 960,
                "py": 497
              },
              {
                "name": "Case A 2",
                "level": 3,
                "text": "<img src='data/img3.jpg'> </img>",
                "id": 61,
                "likes": 0,
                "pin": false,
                "parrentIdx": 59,
                "x": 960,
                "y": 497,
                "index": 58,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ],
            "fixed": 0
          }
        ],
        "id": 58,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 23,
        "weight": 2,
        "px": 860,
        "py": 572,
        "_children": null,
        "sx": 847,
        "sy": 582,
        "selected": true
      },
      "count": 1,
      "timeStamp": 1698146619489
    },
    {
      "user": 3,
      "source": {
        "name": "potentials",
        "level": 1,
        "fixed": 1,
        "x": 860,
        "y": 572,
        "text": "Potentials",
        "children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "<img src='data/img9.jpg'> </img>",
            "children": null,
            "id": 59,
            "likes": 0,
            "pin": false,
            "parrentIdx": 58,
            "x": 807.9004291112057,
            "y": 701.4522517176038,
            "index": 22,
            "weight": 1,
            "px": 807.9468625053245,
            "py": 701.3431662933303,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img2.jpg'> </img>",
                "id": 60,
                "likes": 0,
                "pin": false,
                "parrentIdx": 59,
                "x": 960,
                "y": 497,
                "index": 57,
                "weight": 1,
                "px": 960,
                "py": 497
              },
              {
                "name": "Case A 2",
                "level": 3,
                "text": "<img src='data/img3.jpg'> </img>",
                "id": 61,
                "likes": 0,
                "pin": false,
                "parrentIdx": 59,
                "x": 960,
                "y": 497,
                "index": 58,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ],
            "fixed": 0
          }
        ],
        "id": 58,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 23,
        "weight": 2,
        "px": 860,
        "py": 572,
        "_children": null,
        "sx": 847,
        "sy": 582,
        "selected": true
      },
      "target": {
        "name": "to adapt",
        "level": 1,
        "fixed": 1,
        "x": 960,
        "y": 647,
        "text": "To adapt",
        "children": null,
        "id": 76,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 29,
        "weight": 1,
        "px": 960,
        "py": 647,
        "_children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "Something <img src='data/img6.jpg'> </img>",
            "children": null,
            "id": 77,
            "likes": 0,
            "pin": false,
            "parrentIdx": 76,
            "x": 1013.4126605834361,
            "y": 806.0783731360282,
            "index": 31,
            "weight": 1,
            "px": 1012.9210012693403,
            "py": 804.6297118044675,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img2.jpg'> </img>",
                "id": 78,
                "likes": 0,
                "pin": false,
                "parrentIdx": 77,
                "x": 960,
                "y": 497,
                "index": 75,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ]
          }
        ],
        "sx": 949,
        "sy": 656,
        "selected": true
      },
      "count": 2,
      "timeStamp": 1698146620792
    },
    {
      "user": 3,
      "source": {
        "name": "to adapt",
        "level": 1,
        "fixed": 1,
        "x": 960,
        "y": 647,
        "text": "To adapt",
        "children": null,
        "id": 76,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 29,
        "weight": 1,
        "px": 960,
        "py": 647,
        "_children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "Something <img src='data/img6.jpg'> </img>",
            "children": null,
            "id": 77,
            "likes": 0,
            "pin": false,
            "parrentIdx": 76,
            "x": 1013.4126605834361,
            "y": 806.0783731360282,
            "index": 31,
            "weight": 1,
            "px": 1012.9210012693403,
            "py": 804.6297118044675,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img2.jpg'> </img>",
                "id": 78,
                "likes": 0,
                "pin": false,
                "parrentIdx": 77,
                "x": 960,
                "y": 497,
                "index": 75,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ]
          }
        ],
        "sx": 949,
        "sy": 656,
        "selected": true
      },
      "target": {
        "name": "solutions",
        "level": 1,
        "fixed": 1,
        "x": 1060,
        "y": 647,
        "text": "Solutions",
        "children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "Something <img src='data/img8.jpg'> </img>",
            "children": null,
            "id": 80,
            "likes": 0,
            "pin": false,
            "parrentIdx": 79,
            "x": 1182.5204401787344,
            "y": 732.8521929185071,
            "index": 30,
            "weight": 1,
            "px": 1182.4105402784337,
            "py": 732.7755075840292,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img2.jpg'> </img>",
                "id": 81,
                "likes": 0,
                "pin": false,
                "parrentIdx": 80,
                "x": 960,
                "y": 497,
                "index": 78,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ]
          }
        ],
        "id": 79,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 31,
        "weight": 2,
        "px": 1060,
        "py": 647,
        "_children": null,
        "sx": 1063,
        "sy": 659,
        "selected": true
      },
      "count": 3,
      "timeStamp": 1698146621656
    },
    {
      "user": 2,
      "source": {
        "name": "solutions",
        "level": 1,
        "fixed": 1,
        "x": 1060,
        "y": 647,
        "text": "Solutions",
        "children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "Something <img src='data/img8.jpg'> </img>",
            "children": null,
            "id": 80,
            "likes": 0,
            "pin": false,
            "parrentIdx": 79,
            "x": 1182.5204401787344,
            "y": 732.8521929185071,
            "index": 30,
            "weight": 1,
            "px": 1182.4105402784337,
            "py": 732.7755075840292,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img2.jpg'> </img>",
                "id": 81,
                "likes": 0,
                "pin": false,
                "parrentIdx": 80,
                "x": 960,
                "y": 497,
                "index": 78,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ]
          }
        ],
        "id": 79,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 31,
        "weight": 2,
        "px": 1060,
        "py": 647,
        "_children": null,
        "sx": 1063,
        "sy": 659,
        "selected": true
      },
      "target": {
        "name": "analyse",
        "level": 1,
        "fixed": 1,
        "x": 760,
        "y": 497,
        "text": "Analyse",
        "children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "<img src='data/img10.jpg'> </img>",
            "children": null,
            "id": 39,
            "likes": 0,
            "pin": false,
            "parrentIdx": 38,
            "x": 605.9969957631151,
            "y": 500.55459989810237,
            "index": 14,
            "weight": 1,
            "px": 606.1371320534034,
            "py": 500.550768781651,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img2.jpg'> </img>",
                "id": 40,
                "likes": 0,
                "pin": false,
                "parrentIdx": 39,
                "x": 960,
                "y": 497,
                "index": 37,
                "weight": 1,
                "px": 960,
                "py": 497
              },
              {
                "name": "Case A 2",
                "level": 3,
                "text": "<img src='data/img3.jpg'> </img>",
                "id": 41,
                "likes": 0,
                "pin": false,
                "parrentIdx": 39,
                "x": 960,
                "y": 497,
                "index": 38,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ],
            "fixed": 0
          }
        ],
        "id": 38,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 15,
        "weight": 2,
        "px": 760,
        "py": 497,
        "_children": null,
        "sx": 767,
        "sy": 510,
        "selected": true
      },
      "count": 0,
      "timeStamp": 1698146625573
    },
    {
      "user": 2,
      "source": {
        "name": "analyse",
        "level": 1,
        "fixed": 1,
        "x": 760,
        "y": 497,
        "text": "Analyse",
        "children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "<img src='data/img10.jpg'> </img>",
            "children": null,
            "id": 39,
            "likes": 0,
            "pin": false,
            "parrentIdx": 38,
            "x": 605.9969957631151,
            "y": 500.55459989810237,
            "index": 14,
            "weight": 1,
            "px": 606.1371320534034,
            "py": 500.550768781651,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img2.jpg'> </img>",
                "id": 40,
                "likes": 0,
                "pin": false,
                "parrentIdx": 39,
                "x": 960,
                "y": 497,
                "index": 37,
                "weight": 1,
                "px": 960,
                "py": 497
              },
              {
                "name": "Case A 2",
                "level": 3,
                "text": "<img src='data/img3.jpg'> </img>",
                "id": 41,
                "likes": 0,
                "pin": false,
                "parrentIdx": 39,
                "x": 960,
                "y": 497,
                "index": 38,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ],
            "fixed": 0
          }
        ],
        "id": 38,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 15,
        "weight": 2,
        "px": 760,
        "py": 497,
        "_children": null,
        "sx": 767,
        "sy": 510,
        "selected": true
      },
      "target": {
        "name": "lifeworlds",
        "level": 1,
        "fixed": 1,
        "x": 860,
        "y": 347,
        "text": "Lifeworlds",
        "children": null,
        "id": 9,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 3,
        "weight": 1,
        "px": 860,
        "py": 347,
        "_children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "Lifeworld A <img src='data/img8.jpg'> </img>",
            "children": null,
            "id": 10,
            "likes": 0,
            "pin": false,
            "parrentIdx": 9,
            "x": 839.6208477859166,
            "y": 189.989546503114,
            "index": 3,
            "weight": 1,
            "px": 839.6993920964356,
            "py": 190.82508215426475,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "This has more<img src='data/img9.jpg'> </img>",
                "children": null,
                "id": 11,
                "likes": 0,
                "pin": false,
                "parrentIdx": 10,
                "x": 960,
                "y": 497,
                "index": 10,
                "weight": 3,
                "px": 960,
                "py": 497,
                "_children": [
                  {
                    "name": "Case A 1",
                    "level": 4,
                    "text": "Some detailed text",
                    "id": 12,
                    "likes": 0,
                    "pin": false,
                    "parrentIdx": 11,
                    "x": 960,
                    "y": 497,
                    "index": 8,
                    "weight": 1,
                    "px": 960,
                    "py": 497
                  },
                  {
                    "name": "Case A 2",
                    "level": 4,
                    "text": "Very down to sensing",
                    "id": 13,
                    "likes": 0,
                    "pin": false,
                    "parrentIdx": 11,
                    "x": 960,
                    "y": 497,
                    "index": 9,
                    "weight": 1,
                    "px": 960,
                    "py": 497
                  }
                ]
              },
              {
                "name": "Case A 2",
                "level": 3,
                "text": "<img src='data/img10.jpg'> </img>",
                "id": 14,
                "likes": 0,
                "pin": false,
                "parrentIdx": 10,
                "x": 960,
                "y": 497,
                "index": 11,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ]
          }
        ],
        "sx": 861,
        "sy": 363,
        "selected": true
      },
      "count": 1,
      "timeStamp": 1698146627789
    },
    {
      "user": 2,
      "source": {
        "name": "lifeworlds",
        "level": 1,
        "fixed": 1,
        "x": 860,
        "y": 347,
        "text": "Lifeworlds",
        "children": null,
        "id": 9,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 3,
        "weight": 1,
        "px": 860,
        "py": 347,
        "_children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "Lifeworld A <img src='data/img8.jpg'> </img>",
            "children": null,
            "id": 10,
            "likes": 0,
            "pin": false,
            "parrentIdx": 9,
            "x": 839.6208477859166,
            "y": 189.989546503114,
            "index": 3,
            "weight": 1,
            "px": 839.6993920964356,
            "py": 190.82508215426475,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "This has more<img src='data/img9.jpg'> </img>",
                "children": null,
                "id": 11,
                "likes": 0,
                "pin": false,
                "parrentIdx": 10,
                "x": 960,
                "y": 497,
                "index": 10,
                "weight": 3,
                "px": 960,
                "py": 497,
                "_children": [
                  {
                    "name": "Case A 1",
                    "level": 4,
                    "text": "Some detailed text",
                    "id": 12,
                    "likes": 0,
                    "pin": false,
                    "parrentIdx": 11,
                    "x": 960,
                    "y": 497,
                    "index": 8,
                    "weight": 1,
                    "px": 960,
                    "py": 497
                  },
                  {
                    "name": "Case A 2",
                    "level": 4,
                    "text": "Very down to sensing",
                    "id": 13,
                    "likes": 0,
                    "pin": false,
                    "parrentIdx": 11,
                    "x": 960,
                    "y": 497,
                    "index": 9,
                    "weight": 1,
                    "px": 960,
                    "py": 497
                  }
                ]
              },
              {
                "name": "Case A 2",
                "level": 3,
                "text": "<img src='data/img10.jpg'> </img>",
                "id": 14,
                "likes": 0,
                "pin": false,
                "parrentIdx": 10,
                "x": 960,
                "y": 497,
                "index": 11,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ]
          }
        ],
        "sx": 861,
        "sy": 363,
        "selected": true
      },
      "target": {
        "name": "to describe",
        "level": 1,
        "fixed": 1,
        "x": 950,
        "y": 350,
        "text": "To describe",
        "children": null,
        "id": 15,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 4,
        "weight": 1,
        "px": 950,
        "py": 350,
        "_children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "Describe <img src='data/img11.jpg'> </img>",
            "children": null,
            "id": 16,
            "likes": 0,
            "pin": false,
            "parrentIdx": 15,
            "x": 979.6727116391756,
            "y": 197.12407437715325,
            "index": 4,
            "weight": 1,
            "px": 979.4275265274324,
            "py": 198.64013357507199,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "What<img src='data/img12.jpg'> </img>",
                "id": 17,
                "likes": 0,
                "pin": false,
                "parrentIdx": 16,
                "x": 960,
                "y": 497,
                "index": 14,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ]
          }
        ],
        "sx": 942,
        "sy": 365,
        "selected": true
      },
      "count": 2,
      "timeStamp": 1698146629695
    },
    {
      "user": 2,
      "source": {
        "name": "to describe",
        "level": 1,
        "fixed": 1,
        "x": 950,
        "y": 350,
        "text": "To describe",
        "children": null,
        "id": 15,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 4,
        "weight": 1,
        "px": 950,
        "py": 350,
        "_children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "Describe <img src='data/img11.jpg'> </img>",
            "children": null,
            "id": 16,
            "likes": 0,
            "pin": false,
            "parrentIdx": 15,
            "x": 979.6727116391756,
            "y": 197.12407437715325,
            "index": 4,
            "weight": 1,
            "px": 979.4275265274324,
            "py": 198.64013357507199,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "What<img src='data/img12.jpg'> </img>",
                "id": 17,
                "likes": 0,
                "pin": false,
                "parrentIdx": 16,
                "x": 960,
                "y": 497,
                "index": 14,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ]
          }
        ],
        "sx": 942,
        "sy": 365,
        "selected": true
      },
      "target": {
        "name": "needs & aspirations",
        "level": 1,
        "fixed": 1,
        "x": 1060,
        "y": 347,
        "text": "Needs & aspirations",
        "children": null,
        "id": 18,
        "likes": 0,
        "pin": false,
        "parrentIdx": 0,
        "index": 5,
        "weight": 1,
        "px": 1060,
        "py": 347,
        "_children": [
          {
            "name": "Case A",
            "level": 2,
            "text": "<img src='data/img13.jpg'> </img>",
            "children": null,
            "id": 19,
            "likes": 0,
            "pin": false,
            "parrentIdx": 18,
            "x": 1157.7616402071035,
            "y": 235.739187417692,
            "index": 5,
            "weight": 1,
            "px": 1156.7894010040302,
            "py": 236.90851828206573,
            "_children": [
              {
                "name": "Case A 1",
                "level": 3,
                "text": "<img src='data/img14.jpg'> </img>",
                "id": 20,
                "likes": 0,
                "pin": false,
                "parrentIdx": 19,
                "x": 960,
                "y": 497,
                "index": 17,
                "weight": 1,
                "px": 960,
                "py": 497
              },
              {
                "name": "Case A 2",
                "level": 3,
                "text": "<img src='data/img15.jpg'> </img>",
                "id": 21,
                "likes": 0,
                "pin": false,
                "parrentIdx": 19,
                "x": 960,
                "y": 497,
                "index": 18,
                "weight": 1,
                "px": 960,
                "py": 497
              }
            ]
          }
        ],
        "sx": 1056,
        "sy": 364,
        "selected": true
      },
      "count": 3,
      "timeStamp": 1698146630673
    }
  ]