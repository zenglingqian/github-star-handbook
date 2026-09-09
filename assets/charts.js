(function() {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var star = style.getPropertyValue('--star').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();

  // --- Chart: README case ---
  var c1 = echarts.init(document.getElementById('chart-readme-case'), null, { renderer: 'svg' });
  c1.setOption({
    animation: false,
    tooltip: { trigger: 'axis', appendToBody: true,
      formatter: function(p) { var d = p[0]; return d.name + '<br/>累计 Star：<b>' + d.value + '</b>'; } },
    grid: { left: 70, right: 30, top: 40, bottom: 60 },
    xAxis: { type: 'category',
      data: ['改造前 · 3 年累计', '改造后 · 第 1 周', '改造后 · 第 1 个月'],
      axisLabel: { color: ink, interval: 0, fontSize: 12 },
      axisLine: { lineStyle: { color: rule } } },
    yAxis: { type: 'value', name: '累计 Star',
      nameTextStyle: { color: muted },
      axisLabel: { color: muted },
      splitLine: { lineStyle: { color: rule } } },
    series: [{
      type: 'bar', barWidth: '46%',
      data: [
        { value: 160, itemStyle: { color: muted } },
        { value: 3000, itemStyle: { color: accent2 } },
        { value: 5500, itemStyle: { color: star } }
      ],
      label: { show: true, position: 'top', color: ink, fontWeight: 'bold',
        formatter: function(p) { return p.value + ' ⭐'; } },
      itemStyle: { borderRadius: [6, 6, 0, 0] }
    }]
  });
  window.addEventListener('resize', function() { c1.resize(); });

  // --- Chart: launch heatmap (Mon-Sun x PT slots) ---
  var days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  var slots = ['0-3时', '3-6时', '6-9时', '9-12时', '12-15时', '15-18时', '18-21时', '21-24时'];
  // qualitative score 0-100, based on cited guidance
  var scores = [
    [55, 40, 65, 78, 70, 55, 45, 50],  // Mon: catch-up day, harder to stand out
    [60, 45, 78, 100, 85, 65, 50, 55], // Tue: prime
    [60, 45, 80, 100, 88, 68, 52, 55], // Wed: prime
    [60, 45, 78, 96, 85, 65, 50, 55],  // Thu: prime
    [45, 35, 60, 72, 62, 48, 40, 42],  // Fri: decent morning, fades
    [30, 25, 40, 48, 45, 38, 35, 32],  // Sat: low traffic, low competition
    [32, 26, 42, 50, 47, 40, 38, 35]   // Sun: low traffic, low competition
  ];
  var heatData = [];
  for (var d = 0; d < days.length; d++) {
    for (var s = 0; s < slots.length; s++) heatData.push([s, d, scores[d][s]]);
  }
  var c2 = echarts.init(document.getElementById('chart-launch-heatmap'), null, { renderer: 'svg' });
  c2.setOption({
    animation: false,
    tooltip: { appendToBody: true,
      formatter: function(p) {
        return days[p.value[1]] + ' ' + slots[p.value[0]] + '（太平洋时间）<br/>推荐指数：<b>' + p.value[2] + '</b>/100';
      } },
    grid: { left: 60, right: 20, top: 40, bottom: 90 },
    xAxis: { type: 'category', data: slots, position: 'top',
      axisLabel: { color: ink, fontSize: 11 },
      axisLine: { show: false }, axisTick: { show: false }, splitArea: { show: false } },
    yAxis: { type: 'category', data: days, inverse: true,
      axisLabel: { color: ink },
      axisLine: { show: false }, axisTick: { show: false }, splitArea: { show: false } },
    visualMap: {
      min: 0, max: 100, calculable: false, orient: 'horizontal',
      left: 'center', bottom: 0,
      textStyle: { color: muted },
      inRange: { color: [bg2, accent2, accent] },
      outOfRange: { color: 'transparent' }
    },
    series: [{
      type: 'heatmap', data: heatData,
      label: { show: true, fontSize: 10, color: ink,
        formatter: function(p) { return p.value[2]; } },
      itemStyle: { borderColor: bg2, borderWidth: 2, borderRadius: 4 },
      emphasis: { disabled: true }
    }]
  });
  window.addEventListener('resize', function() { c2.resize(); });

  // --- Chart: channel radar ---
  var c3 = echarts.init(document.getElementById('chart-channel-radar'), null, { renderer: 'svg' });
  c3.setOption({
    animation: false,
    color: [accent, accent2, muted, star, accent + '99', accent2 + '99'],
    tooltip: { appendToBody: true },
    legend: { bottom: 0, textStyle: { color: ink, fontSize: 11 }, itemWidth: 14, itemHeight: 8 },
    radar: {
      indicator: [
        { name: '流量规模', max: 5 },
        { name: '转化质量', max: 5 },
        { name: '长尾价值', max: 5 },
        { name: '冲榜爆发力', max: 5 },
        { name: '门槛友好度', max: 5 }
      ],
      radius: '62%', center: ['50%', '48%'],
      axisName: { color: ink, fontSize: 12 },
      splitLine: { lineStyle: { color: rule } },
      splitArea: { show: false },
      axisLine: { lineStyle: { color: rule } }
    },
    series: [{
      type: 'radar', symbolSize: 4,
      data: [
        { name: 'Hacker News', value: [5, 4, 2, 5, 2] },
        { name: 'Reddit', value: [5, 3, 2, 4, 3] },
        { name: 'Product Hunt', value: [3, 3, 2, 4, 3] },
        { name: '中文社区(掘金/知乎/V2EX)', value: [3, 3, 3, 3, 5] },
        { name: 'X / Twitter', value: [4, 2, 2, 3, 4] },
        { name: '博客 / Newsletter / awesome 列表', value: [2, 4, 5, 1, 4] }
      ],
      areaStyle: { opacity: 0.06 },
      lineStyle: { width: 2 }
    }]
  });
  window.addEventListener('resize', function() { c3.resize(); });
})();
