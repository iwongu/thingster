var drawCharts = function(labels, temps, humis) {
  var tempsData = {
    labels: labels,
    datasets: [
      {
        label: "Temperature",
        fillColor: "rgba(220,220,220,0.2)",
        strokeColor: "rgba(220,220,220,1)",
        pointColor: "rgba(220,220,220,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: temps
      }
    ]
  };
  var humisData = {
    labels: labels,
    datasets: [
      {
        label: "Humidity",
        fillColor: "rgba(151,187,205,0.2)",
        strokeColor: "rgba(151,187,205,1)",
        pointColor: "rgba(151,187,205,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(151,187,205,1)",
        data: humis
      }
    ]
  };
  var options = {
    scaleShowVerticalLines: false,
    pointDotRadius: 3,
    datasetStroke: false,
    showTooltips: false,
    animation: false
  };

  var tempsCtx = $('#temps').get(0).getContext('2d');
  new Chart(tempsCtx).Line(tempsData, options);

  var humisCtx = $('#humis').get(0).getContext('2d');
  new Chart(humisCtx).Line(humisData, options);
};

var fetchData = function(page, callback) {
  $.ajax('/list?page=' + page, {
    success: function(obj) {
      var results = obj.results;
      callback.results(obj.results);
      if (results.length > 0) {
        console.log('page: ' + page + ', ' + results.length);
        fetchData(page + 1, callback);
      } else {
        callback.done();
      }
    }
  });
};

var fetchAllData = function(callback) {
  var data = [];
  fetchData(0, {
    results: function(results) {
      $.merge(data, results);
    },
    done: function() {
      callback(data);
    }
  });
};

$(function() {
  fetchAllData(function(results) {
    var old = 0;
    var labels = results.map(function(result) {
      var date = new Date(result.ts);
      if (date.valueOf() - old >= 10 * 60 * 1000) {
        old = date.valueOf();
        return date.getMonth() + '/' + date.getDate() + ' ' +
          date.getHours() + ':' + date.getMinutes();
      }
      return '';
    });
    var temps = results.map(function(result) {
      return result.temp;
    });
    var humis = results.map(function(result) {
      return result.humi;
    });

    drawCharts(labels, temps, humis);
  });
});
