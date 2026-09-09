// ===== Chart 0-1: README改造前后Star增长对比 =====
(function () {
  var dom = document.getElementById('chart-readme-case');
  if (!dom) return;
  var chart = echarts.init(dom, null, { renderer: 'canvas' });

  // 模拟数据：改造前3年缓慢增长，改造后1个月爆发
  var beforeLabels = ['第1月', '第6月', '第12月', '第18月', '第24月', '第30月', '第36月'];
  var beforeData = [10, 40, 70, 100, 130, 150, 160];

  var afterLabels = ['第1天', '第3天', '第7天', '第14天', '第21天', '第28天', '第35天'];
  var afterData = [160, 800, 3000, 4200, 4800, 5200, 5500];

  var option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(13,17,23,0.95)',
      borderColor: '#30363d',
      textStyle: { color: '#e6edf3' }
    },
    legend: {
      data: ['改造前（3年累计）', '改造后（1个月）'],
      top: 0,
      textStyle: { fontSize: 12, color: '#5b6472' }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '15%', containLabel: true },
    xAxis: [
      {
        type: 'category',
        data: beforeLabels,
        axisLine: { lineStyle: { color: '#dbe1e8' } },
        axisLabel: { color: '#5b6472', fontSize: 11 }
      },
      {
        type: 'category',
        data: afterLabels,
        axisLine: { lineStyle: { color: '#dbe1e8' } },
        axisLabel: { color: '#5b6472', fontSize: 11 },
        show: false
      }
    ],
    yAxis: {
      type: 'value',
      name: 'Stars',
      nameTextStyle: { color: '#5b6472', fontSize: 11 },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#eef2f7' } },
      axisLabel: { color: '#5b6472', fontSize: 11 }
    },
    series: [
      {
        name: '改造前（3年累计）',
        type: 'line',
        xAxisIndex: 0,
        smooth: true,
        data: beforeData,
        lineStyle: { color: '#975a16', width: 2 },
        itemStyle: { color: '#975a16' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(151,90,22,0.25)' },
            { offset: 1, color: 'rgba(151,90,22,0.02)' }
          ])
        },
        symbol: 'circle',
        symbolSize: 6
      },
      {
        name: '改造后（1个月）',
        type: 'line',
        xAxisIndex: 1,
        smooth: true,
        data: afterData,
        lineStyle: { color: '#0b5fd0', width: 3 },
        itemStyle: { color: '#0b5fd0' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(11,95,208,0.3)' },
            { offset: 1, color: 'rgba(11,95,208,0.02)' }
          ])
        },
        symbol: 'circle',
        symbolSize: 6
      }
    ]
  };
  chart.setOption(option);
  window.addEventListener('resize', function () { chart.resize(); });
})();

// ===== Chart 4-1: 发布时机热力图（太平洋时间） =====
(function () {
  var dom = document.getElementById('chart-launch-heatmap');
  if (!dom) return;
  var chart = echarts.init(dom, null, { renderer: 'canvas' });

  var days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  var hours = ['0', '3', '6', '9', '12', '15', '18', '21'];

  // 热度值：0-5分制（综合经验值）
  // 行：小时 列：星期
  var data = [
    // 周一
    [0, 0, 1], [0, 1, 1], [0, 2, 2], [0, 3, 4], [0, 4, 3], [0, 5, 2], [0, 6, 1], [0, 7, 1],
    // 周二
    [1, 0, 1], [1, 1, 2], [1, 2, 3], [1, 3, 5], [1, 4, 5], [1, 5, 4], [1, 6, 2], [1, 7, 2],
    // 周三
    [2, 0, 1], [2, 1, 2], [2, 2, 3], [2, 3, 5], [2, 4, 5], [2, 5, 4], [2, 6, 2], [2, 7, 2],
    // 周四
    [3, 0, 1], [3, 1, 2], [3, 2, 3], [3, 3, 5], [3, 4, 4], [3, 5, 3], [3, 6, 2], [3, 7, 1],
    // 周五
    [4, 0, 1], [4, 1, 1], [4, 2, 2], [4, 3, 3], [4, 4, 2], [4, 5, 2], [4, 6, 1], [4, 7, 1],
    // 周六
    [5, 0, 1], [5, 1, 1], [5, 2, 1], [5, 3, 2], [5, 4, 2], [5, 5, 2], [5, 6, 2], [5, 7, 1],
    // 周日
    [6, 0, 1], [6, 1, 1], [6, 2, 1], [6, 3, 2], [6, 4, 2], [6, 5, 2], [6, 6, 2], [6, 7, 1]
  ];
  // 修正：data格式应为 [[hourIndex, dayIndex, value], ...]
  data = [
    // 周一（列0）
    [0, 0, 1], [1, 0, 1], [2, 0, 2], [3, 0, 3], [4, 0, 4], [5, 0, 3], [6, 0, 2], [7, 0, 1],
    // 周二（列1）
    [0, 1, 1], [1, 1, 2], [2, 1, 3], [3, 1, 5], [4, 1, 5], [5, 1, 4], [6, 1, 3], [7, 1, 2],
    // 周三（列2）
    [0, 2, 1], [1, 2, 2], [2, 2, 3], [3, 2, 5], [4, 2, 5], [5, 2, 4], [6, 2, 3], [7, 2, 2],
    // 周四（列3）
    [0, 3, 1], [1, 3, 2], [2, 3, 3], [3, 3, 5], [4, 3, 4], [5, 3, 3], [6, 3, 2], [7, 3, 1],
    // 周五（列4）
    [0, 4, 1], [1, 4, 1], [2, 4, 2], [3, 4, 3], [4, 4, 2], [5, 4, 2], [6, 4, 1], [7, 4, 1],
    // 周六（列5）
    [0, 5, 1], [1, 5, 1], [2, 5, 1], [3, 5, 2], [4, 5, 2], [5, 5, 2], [6, 5, 2], [7, 5, 1],
    // 周日（列6）
    [0, 6, 1], [1, 6, 1], [2, 6, 1], [3, 6, 2], [4, 6, 2], [5, 6, 2], [6, 6, 2], [7, 6, 1]
  ];

  var option = {
    tooltip: {
      position: 'top',
      backgroundColor: 'rgba(13,17,23,0.95)',
      borderColor: '#30363d',
      textStyle: { color: '#e6edf3' },
      formatter: function (p) {
        return days[p.data[1]] + ' ' + hours[p.data[0]] + ':00 PT<br/>推荐指数：' + p.data[2] + ' / 5';
      }
    },
    grid: { left: '8%', right: '12%', top: '5%', bottom: '10%' },
    xAxis: {
      type: 'category',
      data: days,
      splitArea: { show: true },
      axisLabel: { color: '#5b6472', fontSize: 12 }
    },
    yAxis: {
      type: 'category',
      data: hours,
      name: '太平洋时间 (PT)',
      nameTextStyle: { color: '#5b6472', fontSize: 11, padding: [0, 0, 0, -20] },
      splitArea: { show: true },
      axisLabel: { color: '#5b6472', fontSize: 11 }
    },
    visualMap: {
      min: 0,
      max: 5,
      calculable: false,
      orient: 'vertical',
      left: 'right',
      top: 'center',
      inRange: {
        color: ['#f6f8fa', '#e3a008', '#975a16']
      },
      textStyle: { color: '#5b6472', fontSize: 11 },
      text: ['高', '低']
    },
    series: [
      {
        name: '推荐指数',
        type: 'heatmap',
        data: data,
        label: {
          show: true,
          fontSize: 11,
          color: '#1a1f27',
          formatter: function (p) { return p.data[2]; }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        }
      }
    ]
  };
  chart.setOption(option);
  window.addEventListener('resize', function () { chart.resize(); });
})();

// ===== Chart 5-1: 渠道特性雷达图 =====
(function () {
  var dom = document.getElementById('chart-channel-radar');
  if (!dom) return;
  var chart = echarts.init(dom, null, { renderer: 'canvas' });

  var option = {
    tooltip: {
      backgroundColor: 'rgba(13,17,23,0.95)',
      borderColor: '#30363d',
      textStyle: { color: '#e6edf3' }
    },
    legend: {
      data: ['Hacker News', 'Reddit', '中文社区', '博客/Newsletter', 'Product Hunt', 'X/Twitter'],
      bottom: 0,
      textStyle: { fontSize: 11, color: '#5b6472' },
      type: 'scroll'
    },
    radar: {
      indicator: [
        { name: '曝光量', max: 5 },
        { name: '转化质量', max: 5 },
        { name: '门槛友好度', max: 5 },
        { name: '长尾价值', max: 5 },
        { name: '爆发速度', max: 5 }
      ],
      center: ['50%', '45%'],
      radius: '60%',
      axisName: { color: '#5b6472', fontSize: 12 },
      splitLine: { lineStyle: { color: '#dbe1e8' } },
      splitArea: { areaStyle: { color: ['#ffffff', '#fafbfc'] } },
      axisLine: { lineStyle: { color: '#dbe1e8' } }
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: [5, 5, 1, 3, 5],
            name: 'Hacker News',
            lineStyle: { color: '#ff6600', width: 2 },
            itemStyle: { color: '#ff6600' },
            areaStyle: { color: 'rgba(255,102,0,0.15)' }
          },
          {
            value: [4, 4, 3, 2, 4],
            name: 'Reddit',
            lineStyle: { color: '#ff4500', width: 2 },
            itemStyle: { color: '#ff4500' },
            areaStyle: { color: 'rgba(255,69,0,0.12)' }
          },
          {
            value: [3, 3, 5, 3, 3],
            name: '中文社区',
            lineStyle: { color: '#0b5fd0', width: 2 },
            itemStyle: { color: '#0b5fd0' },
            areaStyle: { color: 'rgba(11,95,208,0.12)' }
          },
          {
            value: [2, 4, 3, 5, 1],
            name: '博客/Newsletter',
            lineStyle: { color: '#975a16', width: 2 },
            itemStyle: { color: '#975a16' },
            areaStyle: { color: 'rgba(151,90,22,0.12)' }
          },
          {
            value: [3, 4, 2, 2, 4],
            name: 'Product Hunt',
            lineStyle: { color: '#da552f', width: 2 },
            itemStyle: { color: '#da552f' },
            areaStyle: { color: 'rgba(218,85,47,0.12)' }
          },
          {
            value: [4, 3, 4, 2, 4],
            name: 'X/Twitter',
            lineStyle: { color: '#1da1f2', width: 2 },
            itemStyle: { color: '#1da1f2' },
            areaStyle: { color: 'rgba(29,161,242,0.12)' }
          }
        ]
      }
    ]
  };
  chart.setOption(option);
  window.addEventListener('resize', function () { chart.resize(); });
})();
