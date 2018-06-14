# Useful URLs

## Get all latest bus status by line# and head station
http://test.zhbuswx.com/RealTime/GetRealTime?id=K1&fromStation=%E5%9F%8E%E8%BD%A8%E7%8F%A0%E6%B5%B7%E5%8C%97%E7%AB%99

```json
{
  "flag":1002,
  "data":[
    {
      "BusNumber":"粤C00983D",
      "CurrentStation":"唐家",
      "LastPosition":"5"  // 只是表示状态, 5 = 已经离开车站, 8 = 在车站中停留
    },
    {
      "BusNumber":"粤C01739D",
      "CurrentStation":"柠溪",
      "LastPosition":"5"
    }
  ]
}
```

## Search Line and get its details by keyword
http://test.zhbuswx.com/Handlers/BusQuery.ashx?handlerName=GetLineListByLineName&key=K1

Note: 注意同一路车有正反两个方向的线路

```json
{
  "flag":1002,
  "data":[
    {
      "Id":"62cb5f6c-a3eb-40da-828f-78f34af99b20", <
      "Name":"K1",
      "LineNumber":"K1", <
      "Direction":0,
      "FromStation":"城轨珠海北站", <
      "ToStation":"拱北口岸总站", <
      "BeginTime":"06:05",
      "EndTime":"21:15",
      "Price":"3",
      "Interval":"17",
      "Description":"",
      "StationCount":18
    },
    {
      "Id":"cd013090-b695-4501-8a27-f3365d37cfb9",
      "Name":"K1",
      "LineNumber":"K1",
      "Direction":1,
      "FromStation":"拱北口岸总站",
      "ToStation":"城轨珠海北站",
      "BeginTime":"7:10",
      "EndTime":"22:25",
      "Price":"3",
      "Interval":"17",
      "Description":"",
      "StationCount":17
    }
  ]
}
```

## Get station list by LineId
http://test.zhbuswx.com/StationList/GetStationList?id=62cb5f6c-a3eb-40da-828f-78f34af99b20

注意参数是LineId而不是LineNumber

```json
{
  "flag":1002,
  "data":[
    {
      "Id":"ee5dd05e933248d1bb21b2e05391c35f",  <
      "Name":"城轨珠海北站",  <
      "Lng":"113.546275",
      "Lat":"22.405286",
      "Description":""
    },
    {
      "Id":"e32d190b672c4ae39dd6f12be31906c5",
      "Name":"罗西尼",
      "Lng":"113.547563",
      "Lat":"22.393576",
      "Description":""
    },
    {
      "Id":"8891bd56e6164c5ca32061187827fba0",
      "Name":"官塘",
      "Lng":"113.548082",
      "Lat":"22.380580",
      "Description":""
    },
    {
      "Id":"878050c46df3443cb8285bed974256f0",
      "Name":"南方软件园",
      "Lng":"113.569040",
      "Lat":"22.376513",
      "Description":""
    },
    {
      "Id":"497dd86a03b84b3e98941f4e921e5014",
      "Name":"海怡湾畔",
      "Lng":"113.587213",
      "Lat":"22.371210",
      "Description":""
    },
    {
      "Id":"4e66098018dc46ce82f8b5bdcd8cdbf9",
      "Name":"唐家市场",
      "Lng":"113.594163",
      "Lat":"22.361467",
      "Description":""
    },
    {
      "Id":"c79b96ca324e4609a9222450070e4fdc",
      "Name":"唐家",
      "Lng":"113.592342",
      "Lat":"22.358032",
      "Description":""
    },
    {
      "Id":"3a36a475daf74127a2584ea4dd34c223",
      "Name":"中山大学",
      "Lng":"113.587692",
      "Lat":"22.350598",
      "Description":""
    },
    {
      "Id":"40f98714310c45f083ee5b392bf1e4cd",
      "Name":"中大五院",
      "Lng":"113.568775",
      "Lat":"22.299097",
      "Description":""
    },
    {
      "Id":"8638c455a424445d8b5122b4a0628d9c",
      "Name":"香洲总站",
      "Lng":"113.561088",
      "Lat":"22.281890",
      "Description":""
    },
    {
      "Id":"986531bc5af04121a7a5bbbf27854cfb",
      "Name":"南坑",
      "Lng":"113.560798",
      "Lat":"22.278653",
      "Description":""
    },
    {
      "Id":"a12c061f76a24150b1f5cfe77f61858b",
      "Name":"香宁花园",
      "Lng":"113.552978",
      "Lat":"22.269285",
      "Description":""
    },
    {
      "Id":"fcfcde50c07e440ab044dbfae7b880c3",
      "Name":"柠溪",
      "Lng":"113.546385",
      "Lat":"22.263207",
      "Description":""
    },
    {
      "Id":"0d3d1f8a30044b689b87694dc65c1e36",
      "Name":"隧道南",
      "Lng":"113.545200",
      "Lat":"22.243733",
      "Description":""
    },
    {
      "Id":"d7db6ef4ddcb45b69f166e10751a2d44",
      "Name":"摩尔广场",
      "Lng":"113.546222",
      "Lat":"22.237328",
      "Description":""
    },
    {
      "Id":"c7a1c6413c8b44219dd1a4d8d265ac62",
      "Name":"华侨宾馆",
      "Lng":"113.546868",
      "Lat":"22.233377",
      "Description":""
    },
    {
      "Id":"57c5d2808dc74ebbb70e26d85368405f",
      "Name":"拱北",
      "Lng":"113.547950",
      "Lat":"22.224850",
      "Description":""
    },
    {
      "Id":"8b30950285a24e929bbbab85ce56ccd1",
      "Name":"拱北口岸总站",
      "Lng":"113.550592",
      "Lat":"22.220958",
      "Description":""
    }
  ]
}
```

## 每次用户键入巴士线路号时, 会调用两个webservice分别获取Bus line basic info和station list, 数据拼装之后结构如下:

是一个两层的结构, 第一层是一个数组, 数组中每个元素就是一条线路的基本信息加上这条线路的所有站点, 所有站点作为第2层的数组赋值给`stations`属性.
这个数据结构会存入Options的DataCache中, key为lineNumber, value为相应路线的这个数据结构。

```json
[
  {
    "uuid":"c72cd82b-be2f-4879-a4a2-f4c05ecf54fd",
    "lineNumber":"1",
    "fromStation":"香洲",
    "toStation":"城轨珠海站",
    "stations":[
      {
        "uuid":"09d3df05b61d4b57959762d9ed2f986c",
        "name":"香洲"
      },
      {
        "uuid":"986531bc5af04121a7a5bbbf27854cfb",
        "name":"南坑"
      },
      {
        "uuid":"583401abc31545abace9cd3f6c79b58c",
        "name":"拱北"
      },
      {
        "uuid":"83372752a25d4bbcbce138cfaf59bf31",
        "name":"城轨珠海站"
      }
    ]
  },
  {
    "uuid":"afec0bea-5532-4872-b06e-a1b5e97e4c3f",
    "lineNumber":"1",
    "fromStation":"城轨珠海站",
    "toStation":"香洲",
    "stations":[
      {
        "uuid":"83372752a25d4bbcbce138cfaf59bf31",
        "name":"城轨珠海站"
      },
      {
        "uuid":"3dd7a19e5f8c44ea8b69f84f508727bb",
        "name":"拱北口岸"
      },
      {
        "uuid":"d990386ef4bc457cb2c691512acce341",
        "name":"南坑"
      },
      {
        "uuid":"759cac0a7aed47aca0e7daf21e23c44e",
        "name":"香洲"
      }
    ]
  }
]
```

# Local storage中的watchedLines的数据结构如下:

watchedLines就是一个数组, 其中每个元素就是用户的一条关注, key属性由line#、fromStation、notifyStation组成。

```json
[  
  {  
    "fromStation":"城轨珠海站",
    "key":"10__城轨珠海站__城轨珠海站",
    "searchKey":"10__城轨珠海站",
    "lineNumber":"10",
    "lineUuid":"7e58c98a-89af-4293-8e01-4393ac5c9a09",
    "notifyStation":"城轨珠海站",
    "toStation":"下栅检查站"
  }
]
```

