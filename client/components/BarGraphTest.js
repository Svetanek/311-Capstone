import chroma from 'chroma-js'
import * as d3 from 'd3'
import React, {Component} from 'react'

const width = 650
const height = 400
const margin = {top: 20, right: 5, bottom: 20, left: 35}
const red = '#eb6a5b'
const green = '#b6e86f'
const blue = '#52b6ca'
const colors = chroma.scale([blue, green, red]).mode('hsl')

export default class BarGraphTest extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bars: [],
      xScale: d3.scaleBand().range([margin.left, width - margin.right]),
      yScale: d3.scaleLinear().range([height - margin.bottom, margin.top]),
      colorScale: d3.scaleLinear()
    }

    this.xAxis = d3.axisBottom().scale(this.state.xScale)
    this.yAxis = d3.axisLeft().scale(this.state.yScale)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.data) return null
    const {data} = nextProps
    const {xScale, yScale, colorScale} = prevState

    const quantityMax = d3.max(data, d => d.quantity)
    const complaintDomain = data.map(complaint => complaint.type)
    xScale.domain(complaintDomain)
    xScale.padding(0.6)
    yScale.domain([0, quantityMax])

    const bars = data.map(d => {
      return {
        x: xScale(d.type),
        y: yScale(d.quantity),
        width: 50,
        height: height - margin.bottom - yScale(d.quantity),
        fill: 'green'
      }
    })

    return {bars}
  }

  componentDidUpdate() {
    d3.select(this.refs.xAxis).call(this.xAxis)
    d3.select(this.refs.yAxis).call(this.yAxis)
  }

  render() {
    const {xScale} = this.props

    return (
      <svg width={width} height={height}>
        {this.state.bars.map((d, i) => (
          <rect
            key={i}
            x={d.x}
            y={d.y}
            width={d.width}
            height={d.height}
            fill={d.fill}
          />
        ))}
        <g>
          <g
            ref="xAxis"
            transform={`translate(0, ${height - margin.bottom})`}
          />
          <g ref="yAxis" transform={`translate(${margin.left}, 0)`} />
        </g>
      </svg>
    )
  }
}
