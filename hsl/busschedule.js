angular.module('busschedule',[])
  .value('hslScheduleURL', 'http://www.pubtrans.it/hsl/reittiopas/departure-api?')
  .controller('ListController', ['$scope', '$http', '$attrs', 'hslScheduleURL',
      function($scope, $http, $attrs, baseUrl) {
          moment.locale('fi');

          $scope.setStop = function(stopnumber, maxresults) {
            var now = moment().format('YYYY-MM-DDTHH:mm:ss'),
                url = baseUrl
                       + 'stops[]=' + stopnumber
                       + '&time=' + now
                       + '&max=' + (maxresults || 10);

            $scope.code = null;
            $scope.response = null;

            $http.get(url)
              .success(function(data, status) {
                $scope.status = status;
                $scope.data = processData(data);
              })
              .error(function(data, status) {
                $scope.data = data || "Request failed";
                $scope.status = status;
            });
          }
          
          // http://www.pubtrans.it
          // pääskyskujan pysäkki 2133210, turuntien 2133204
          // Häiriöt: http://www.pubtrans.it/hsl/reittiopas/disruption-api?dt=2015-01-10T16:42:15
          $scope.setStop($attrs.stopnumber);

          var processData = function(data) {

              var result = [];
              angular.forEach(data, function(value) {
                  var date = moment(new Date((value.rtime || value.time) * 1000));
                  result.push({
                    line : value.line,
                    info : value.info,
                    time : date.format('H:mm'),
                    until : date.fromNow()
                  });
              });
              return result;
          };
      }
  ]);
/*
{"dest":"Leppävaara",
"id":"1964271699",
"info":"",
"line":"26",
"route":"2026  2",
"rtime":"",
"stop":"2133210",
"stopname":"Pääskyskuja",
"time":1420908540}
}
*/