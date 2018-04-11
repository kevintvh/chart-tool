import React, { Component } from 'react';
import { TwitterPicker as ColorPicker } from 'react-color';
import { updateAndSave, dataParse } from '../../modules/utils';
import { app_settings } from '../../modules/settings';
import { parse } from '../../modules/chart-tool';
import Swal from 'sweetalert2';

export default class ChartAnnotations extends Component {

  constructor(props) {
    super(props);
    this.toggleCollapseExpand = this.toggleCollapseExpand.bind(this);
    this.resetAnnotations = this.resetAnnotations.bind(this);
    this.state = {
      expanded: false
    };
  }

  expandStatus() {
    return this.state.expanded ? 'expanded' : 'collapsed';
  }

  toggleCollapseExpand() {
    const expanded = !this.state.expanded;
    this.setState({ expanded });
    this.props.toggleAnnotationMode(expanded);
  }

  displayHighlight() {
    const { data } = dataParse(this.props.chart.data);

    let needsDates;

    if (this.props.chart.options.type !== 'bar') {
      needsDates = this.props.chart.x_axis.scale === 'ordinal' ? undefined : this.props.chart.date_format;
    }

    let dataObj, error;

    try {
      dataObj = parse(data, needsDates, this.props.chart.options.indexed);
    } catch(e) {
      error = e;
    }

    if (error) return;

    if (this.props.chart.options.type === 'bar' || this.props.chart.options.type === 'column') {
      return dataObj.seriesAmount === 1;
    } else {
      return false;
    }
  }

  highlightColors() {
    if (app_settings) { return app_settings.highlightOptions; }
  }

  currentHighlights() {
    const chart = this.props.chart;
    if (chart.annotations && chart.annotations.highlights && chart.annotations.highlights.length) {
      return true;
    } else {
      return false;
    }
  }

  resetAnnotations() {
    updateAndSave('charts.update.annotation.reset', this.props.chart._id);
  }

  helpHighlighting() {
    Swal({
      title: 'Highlighting?',
      text: "You can now highlight chosen bars and columns with a custom colour. Try it out by clicking on a colour, then clicking on the bar you'd like to recolour.",
      type: 'info'
    });
  }

  helpRanges() {

  }

  helpText() {

  }

  // RANGES
  // Should include a field where you can type the minimum and maximum value
  // How do I handle ordinal-time data?
  //
  // LINE OR AREA
  // column headings
  //
  // annotations = {
  //   highlight: [
  //     {
  //       key: 'Canada',
  //       color: '#HEX'
  //     }
  //   ],
  //   range: [
  //     {
  //       mode: 'xAxis',
  //       x1: 'DATE',
  //       x2: 'DATE' // optional
  //     },
  //     {
  //       mode: 'yAxis',
  //       y1: 'DATE',
  //       y2: 'DATE' // optional
  //     }
  //   ],
  //   text: [
  //     {
  //       type: 'point',
  //       x: '12%',
  //       y: '14%',
  //       alignment: 'tl'
  //     },
  //     {
  //       type: 'area',
  //       x1: '12%',
  //       y1: 'derp',
  //       x2: 'derp',
  //       y2: 'derp',
  //       alignment: 'tl'
  //     }
  //   ]
  // };

  render() {
    return (
      <div className='edit-box'>
        <h3 onClick={this.toggleCollapseExpand}>Annotations</h3>
        <div className={`unit-edit ${this.expandStatus()}`}>

          {this.props.annotationMode ?
            <p className='note'>Note: While the Annotation tab is open, previewed chart tips will be disabled.</p> : null
          }

          {this.displayHighlight() ?
            <div className='unit-edit anno-highlight-edit'>
              <h4>Highlighting <a onClick={this.helpHighlighting} className='help-toggle help-anno-higlight'>?</a></h4>
              <ColorPicker
                triangle={'hide'}
                colors={app_settings.highlightOptions}
                onChangeComplete={this.props.handleHighlightColor}
                width={'100%'}
              />
              {this.currentHighlights() ?
                <div>
                  <p>Currently highlighted</p>
                  {this.props.chart.annotations.highlights.map(d => {
                    return (
                      <li key={d.key}>
                        <span style={`background-color: ${d.color}`}></span>{d.key} &times;
                      </li>
                    );
                  })}
                </div>
              : null }
            </div> : null }

          <div className='unit-edit anno-text-edit' style={{ opacity: 0.2 }}>
            <h4>Ranges (coming soon) <a onClick={this.helpRanges} className='help-toggle help-anno-ranges'>?</a></h4>
            {/* Add line|range
            Current range elements */}
          </div>

          <div className='unit-edit anno-text-edit' style={{ opacity: 0.2 }}>
            <h4>Text annotations (coming soon) <a onClick={this.helpText} className='help-toggle help-anno-text'>?</a></h4>
            {/* Add point|area text
            Current text elements
            Alignment */}
          </div>

          <button className='annotation-reset' onClick={this.resetAnnotations}>Reset all annotations</button>

        </div>
      </div>
    );
  }

}