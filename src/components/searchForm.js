import React from 'react';

export default class SearchForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      city: props.defaultState.city || "Chicago",
      cityOptions: ["Chicago", "New York"],
      zipCode: props.defaultState.zipCode || "",
    }
  }

  render() {

    return (
      <form id="chartBuilderForm">
        <div className="chartBuilder--section">
          <h2>Market</h2>
          <div className="chartBuilder--section-select-market">
            <Select
              id="marketCity"
              className="chartBuilder--select"
              options={this.state.cityOptions}
              placeholder="-- City"
              key={this.state.stateCode}
              clearable={true}
              isSearchable={true}
              defaultValue="-- City"
              value={this.state.city && this.state.city !== 'undefined' ? { value: this.state.city, label: this.state.city } : ''}
              // onChange={this.updateCity}
            />

            <input
              className="chartBuilder--input"
              key="zipCode"
              type="number"
              placeholder="Zip code"
              value={this.state.zipCode ? this.state.zipCode : ''}
              aria-label="Chart Title"
              ref={chartTitle => this.chartTitle = chartTitle}
              onChange={this.updateChartTitle}
            />
          </div>
        </div>

        <div className="chartBuilder--section">
          <h2>Metric</h2>
          <div className="chartBuilder--section-select">
            <Select
              id="chartMetric"
              className="chartBuilder--select"
              options={REM_DATA_POINTS}
              key="metric"
              placeholder="-- Select a metric"
              defaultValue={REM_DATA_POINTS[0]}
              value={this.state.metric && this.state.metric !== 'undefined' ? { value: this.state.metric, label: this.state.metricLabel } : ''}
              // onChange={this.updateMetric}
            />
          </div>
        </div>

        <div className="chartBuilder--section">
          <h2>Chart type</h2>
          <fieldset id="groupChartType">
            <div className="chartBuilder--section-radio">
              <input
                id="lineChart"
                key="lineChart"
                type="radio"
                name="groupChartType"
                value="line"
                checked={this.state.chartType === 'line'}
                // onChange={this.updateChartType}
              />
              <label htmlFor="lineChart" className="form-label">Line</label>
            </div>

            <div className="chartBuilder--section-radio">
              <input
                id="barChart"
                key="barChart"
                type="radio"
                name="groupChartType"
                value="bar"
                checked={this.state.chartType === 'bar'}
                // onChange={this.updateChartType}
              />
              <label htmlFor="barChart" className="form-label">Bar</label>
            </div>

            <div className="chartBuilder--section-radio">
              <input

                id="pieChart"
                key="pieChart"
                type="radio"
                name="groupChartType"
                value="pie"
                checked={this.state.chartType === 'pie'}
                // onChange={this.updateChartType}
              />
              <label htmlFor="pieChart" className="form-label">Pie</label>
            </div>

            <div className="chartBuilder--section-radio">
              <input
                // disabled={(this.state.metric !== 'marital_status') || (this.state.metric !== 'sex_and_age')}
                id="donutChart"
                key="donutChart"
                type="radio"
                name="groupChartType"
                value="donut"
                checked={this.state.chartType === 'donut'}
                // onChange={this.updateChartType}
              />
              <label htmlFor="donutChart" className="form-label">Donut</label>
            </div>
          </fieldset>
        </div>

        <div className="chartBuilder--section">
          <h2>
            Chart title
            {this.state.chartTitle !== '' && <span className={(this.state.chartTitle.length > 40 ? 'counter error' : 'counter')}>{this.state.titleCounter}</span> }
          </h2>
          <div className="chartBuilder--section-input">
            <input
              className="chartBuilder--input"
              key="chartTitle"
              type="text"
              placeholder="Insert chart title"
              value={this.state.chartTitle ? this.state.chartTitle : ''}
              aria-label="Chart Title"
              ref={chartTitle => this.chartTitle = chartTitle}
              onChange={this.updateChartTitle}
            />
            {this.state.chartTitle !== '' && <button className="chartBuilder--button" type="button" onClick={this.clearTitle}><span className="fa fa-times" /></button> }
          </div>
        </div>

        <div className="chartBuilder--section">
          <h2>
            Chart notes
            {this.state.chartNotes !== '' && <span className={(this.state.chartNotes.length > 140 ? 'counter error' : 'counter')}> {this.state.notesCounter}</span> }
          </h2>
          <div className="chartBuilder--section-input">
            <textarea
              className="chartBuilder--input"
              key="chartNotes"
              type="text"
              placeholder="Insert chart notes"
              value={this.state.chartNotes ? this.state.chartNotes : ''}
              aria-label="Chart Notes"
              ref={chartNotes => this.chartNotes = chartNotes}
              onChange={this.updateChartNotes}
            />
            {this.state.chartNotes !== '' && <button className="chartBuilder--button" type="button" onClick={this.clearNotes}><span className="fa fa-times" /></button> }
          </div>
        </div>

        <div className="chartBuilder--section">
          <h2>Chart size</h2>
          <fieldset id="chartSizeGroup">
            <div className="chartBuilder--section-radio">
              <input
                id="mediumChart"
                key="chartSize-md"
                type="radio"
                name="chartSizeGroup"
                value="720"
                checked={this.state.chartSize === '720'}
                onChange={this.updateChartSize}
              />
              <label htmlFor="mediumChart" className="form-label">720px</label>
            </div>

            <div className="chartBuilder--section-radio">
              <input
                id="largeChart"
                key="chartSize-lg"
                type="radio"
                name="chartSizeGroup"
                value="1015"
                checked={this.state.chartSize === '1015'}
                onChange={this.updateChartSize}
              />
              <label htmlFor="largeChart" className="form-label">1015px</label>
            </div>
          </fieldset>
        </div>
      </form>
    )
  }


}