# TJRun

## 对于用户

一个同济校园信息系统检索工具，地址：<https://tjrun.linho.cc/>

索引内容包括但不限于：

- 官网上的导航链接，包括
  - [院部](https://www.tongji.edu.cn/yxjg111/ybshe_zhi/ybsz_.htm)
  - [党政部门](https://www.tongji.edu.cn/yxjg111/dzbm.htm)
  - [直属单位](https://www.tongji.edu.cn/yxjg111/zsdw1.htm)
  - [附属单位与直管企业](https://www.tongji.edu.cn/yxjg111/fsdwjzgqy.htm)
- [教学一体化系统](https://1.tongji.edu.cn/) 的侧边栏服务
- [一网通办系统](https://all.tongji.edu.cn/) 的全部服务
- [信息办网站](https://nic.tongji.edu.cn/) 的文档
- [正版化平台](https://software.tongji.edu.cn/) 的所有软件
- 其他常用学校平台，例如 [Canvas](http://canvas.tongji.edu.cn/)、[印象同济](https://photo.tongji.edu.cn/) 等等
- 一些学生搭建的平台，例如 [乌龙茶选课社区](https://1.tongji.icu/)、[TJ 一起走](https://pinche.tj.hainuo.wang/) 等

如果你觉得可以补充更多内容，欢迎 [提交 issue](https://github.com/Linho1219/tjrun/issues)。

### 相关网站

如果你更喜欢网址导航的形式，可以考虑 [济你太美网址导航](https://www.tongji.icu/) 或者他们的 [测试版](https://test.www.tongji.icu/)。

## 对于开发者

搜索工具本身为纯前端，基于 Vue 和 Vuetify 构建。请求 JSON 格式的数据后，使用 [fuse.js](https://www.fusejs.io/) 进行搜索。

数据集有两部分来源。大部分通过 Playwright 从各学校系统上批量抓取，小部分通过人工手动维护。

从学校系统批量抓取部分的代码位于 `data/workflows/`，做了一些后处理。人工维护部分位于 `data/manual.data.ts`。

索引后的结果存放在 `public/indexed.json`，索引文件的格式信息位于 `shared.d.ts` 中。JSON 可以在 <https://tjrun.linho.cc/indexed.json> 处获取到并用于二次开发。

如果你希望增加更多索引来源，无论是自动化获取还是手动维护，都欢迎 PR。
