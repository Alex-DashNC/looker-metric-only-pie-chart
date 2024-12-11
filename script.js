// Use dscc to subscribe to data and transform
// Documentation: https://developers.google.com/looker-studio/visualizations

// Draw the visualization
function drawViz(data) {
  const container = document.getElementById('vizContainer');
  container.innerHTML = '';
  
  // Extract fields and rows
  const fields = data.fields;
  const rows = data.tables.DEFAULT;

  // We expect no dimensions and multiple metrics
  // Each row represents a single "record" of data.
  // Without dimensions, you generally have a single row of aggregated values.
  // rows[0].metric will be an array of metric values corresponding to fields.metric
  
  // If there's no data, show nothing
  if (!rows || rows.length === 0 || !fields.metric || fields.metric.length === 0) {
    container.innerHTML = '<div>No Data</div>';
    return;
  }

  const metrics = fields.metric;
  const values = rows[0].metric; // Single row of metric values

  // Build the data array for Google Charts
  const chartDataArray = [['Metric', 'Value']];
  for (let i = 0; i < metrics.length; i++) {
    chartDataArray.push([metrics[i].name, values[i]]);
  }

  google.charts.load('current', { packages: ['corechart'] });
  google.charts.setOnLoadCallback(() => {
    const chartData = new google.visualization.arrayToDataTable(chartDataArray);

    // Options to closely mimic the default look (adjust as needed)
    const options = {
      title: '',
      pieHole: 0,
      legend: { position: 'right', textStyle: { fontSize: 12 } },
      chartArea: { width: '80%', height: '80%' },
      slices: {}, // You can customize slice colors if desired
      fontName: 'Arial',
      fontSize: 12
    };

    const chart = new google.visualization.PieChart(container);
    chart.draw(chartData, options);
  });
}

// Subscribe to data
dscc.subscribeToData(drawViz, { transform: dscc.identityTransform });
