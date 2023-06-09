// 獲取今天的日期
var endDate = moment().format('YYYY-MM-DD');
var startDate = moment().startOf('year').format('YYYY-MM-DD');

// 發出網絡請求獲取比特幣歷史價格數據
axios.get('https://api.coindesk.com/v1/bpi/historical/close.json?start=' + startDate + '&end=' + endDate)
    .then(function (response) {
        console.log(response); // 將整個 response 對象打印到控制台
        var data = response.data.bpi;
        console.log(data); // 檢查數據格式
        if (!data) {
            console.log('No data received');
            return;
        }
        var prices = Object.keys(data).map(function(key) {
            return {
                date: new Date(key),
                value: data[key]
            };
        });

        // 在網頁中顯示價格線性圖表
        var svg = d3.select('#chart')
            .append('svg')
            .attr('class', 'chart')
            .attr('width', 800)
            .attr('height', 600);

        var xScale = d3.scaleTime().range([50, 750]);
        var yScale = d3.scaleLinear().range([550, 50]);
        var line = d3.line()
            .x(function(d) { return xScale(d.date); })
            .y(function(d) { return yScale(d.value); });

        xScale.domain(d3.extent(prices, function(d) { return d.date; }));
        yScale.domain(d3.extent(prices, function(d) { return d.value; }));

        svg.append('path')
            .datum(prices)
            .attr('class', 'line')
            .attr('d', line);
                    
        var xAxis = d3.axisBottom(xScale).ticks(d3.timeMonth).tickFormat(d3.timeFormat("%m/%Y"));
        var yAxis = d3.axisLeft(yScale).ticks(6);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + 550 + ")")
            .call(xAxis);
                
        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(50,0)")
            .call(yAxis);
    })
    .catch(function (error) {
        console.log('獲取比特幣價格失敗：', error);
    });
