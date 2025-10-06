import type { RootItem } from '.'

export const manualMaintainedData: RootItem[] = [
  // Officials
  {
    name: '同济大学门户网站',
    url: 'https://www.tongji.edu.cn/',
    alias: '官网 主页 首页',
    children: [
      { name: '校园地图', url: 'https://www.tongji.edu.cn/xglj/fk.htm' },
      { name: '学校章程', url: 'https://www.tongji.edu.cn/xxgk1/xxzc.htm' },
      { name: '学术期刊', url: 'https://www.tongji.edu.cn/kxyj1/xsqk.htm' },
      {
        name: '学校标识',
        url: 'https://www.tongji.edu.cn/xxgk1/xxzc.htm',
        alias: '校徽 校风 校训 校歌',
      },
    ],
  },
  { name: '同济大学浙江学院', url: 'https://www.tjzj.edu.cn/' },
  { name: '高程作业提交', url: 'http://192.168.174.220/', alias: '高级语言程序设计' },
  { name: '宿舍购电', url: 'http://goudian.tongji.edu.cn/', alias: '电费' },
  { name: '智慧教学媒体', url: 'https://look.tongji.edu.cn', alias: '录课 录播 回放 回看 媒资库' },
  { name: '云媒体平台 (旧)', url: 'http://v.tongji.edu.cn', alias: '录课 录播 回放 回看 媒资库' },
  { name: '第二课堂活动平台', url: 'https://itongjis.tongji.edu.cn/', alias: 'iTongji-S' },
  { name: '同济云盘', url: 'https://yunpan.tongji.edu.cn/', alias: '网盘' },
  { name: '同济同学', url: 'https://tjtx.tongji.edu.cn/', alias: 'AI 智能助手' },
  { name: '图书馆书目检索系统', url: 'https://webpac.tongji.edu.cn/', priority: 1 },
  { name: '卓越·星', url: 'https://star.tongji.edu.cn/app/', alias: '五育' },
  { name: '智慧团建', url: 'https://zhtj.youth.cn/zhtj/', alias: '网上共青团' },
  { name: '开发者平台', url: 'https://dev.tongji.edu.cn/' },
  { name: '校内 GitLab', url: 'https://git.tongji.edu.cn/' },
  { name: '体育场馆预约', url: 'https://stadium.tongji.edu.cn/', alias: '球场 健身房' },
  { name: '高数同步课堂', url: 'https://gaoshutongbu.tongji.edu.cn/', alias: '数学' },
  { name: '缴费平台', url: 'https://paycwc.tongji.edu.cn/payment', alias: '财务 学费' },
  { name: '物理实验中心', url: 'http://phyvr.tongji.edu.cn' },
  { name: 'Canvas', url: 'http://canvas.tongji.edu.cn/' },
  { name: 'AI 创新平台', url: 'http://agent.tongji.edu.cn/' },
  { name: '同济邮箱', url: 'https://mail.tongji.edu.cn/' },
  { name: '信息公开网', url: 'https://xxgk.tongji.edu.cn/' },
  { name: '党建e家', url: 'https://djyj.tongji.edu.cn/' },
  { name: '校友会', url: 'https://alumni.tongji.edu.cn/', alias: '校友之家' },
  { name: '本科招生网', url: 'https://bkzs.tongji.edu.cn/' },
  { name: '研究生招生网', url: 'https://yz.tongji.edu.cn/' },
  { name: '人才招聘网', url: 'https://zp.tongji.edu.cn/' },
  { name: '文明网', url: 'https://tjwm.tongji.edu.cn/', alias: '文明校园' },
  { name: '博物馆', url: 'https://museum.tongji.edu.cn/' },
  {
    name: '创新创业平台',
    url: 'https://cxcy.tongji.edu.cn/',
    alias: '双创 大创 大学生创新训练计划',
  },
  {
    name: '移动门户',
    url: 'https://all4u.tongji.edu.cn/tj-portal/page/mobile',
    alias: '同心云 微信小程序',
  },
  {
    name: '统一身份访问控制自助服务平台',
    url: 'https://iam.tongji.edu.cn/self-service/',
    alias: '认证 验证 密码修改 微信绑定',
    priority: 1,
  },
  {
    name: '图书馆空间预约系统',
    url: 'https://space.tongji.edu.cn/',
    children: [
      { name: '研习室预约', url: 'https://space.tongji.edu.cn/h5/#/SeatScreening/2' },
      { name: '座位预约', url: 'https://space.tongji.edu.cn/h5/#/SeatScreening/1' },
    ],
    priority: 2,
  },
  {
    name: '同济后勤',
    url: 'https://tjhq.tongji.edu.cn',
    children: [
      {
        name: '服务指南',
        url: 'https://tjhq.tongji.edu.cn/news.html?typeId=11',
        children: [
          {
            name: '餐饮服务',
            url: 'https://tjhq.tongji.edu.cn/news_detail.html?id=e0c573a602b3497084460d1d110233f9',
            alias: '食堂',
          },
          {
            name: '物业服务',
            url: 'https://tjhq.tongji.edu.cn/news_detail.html?id=3f5451f16910429580a80f0f3499c58a',
          },
          {
            name: '学生社区中心服务',
            url: 'https://tjhq.tongji.edu.cn/news_detail.html?id=38991097faf140c99d862ec080fb1b18',
          },
          {
            name: '会务服务',
            url: 'https://tjhq.tongji.edu.cn/news_detail.html?id=20d14051e7a7426e8bd8916bea43c3ba',
            alias: '会议',
          },
        ],
      },
      {
        name: '服务应用',
        children: [
          { name: '我要报修', url: 'https://tjhq.tongji.edu.cn/ihome/newRepair' },
          { name: '建议投诉', url: 'https://tjhq.tongji.edu.cn/ihome/service/catalogue' },
        ],
      },
    ],
  },
  {
    name: '勤工助学',
    url: 'http://myportal.tongji.edu.cn/xsfwdt/sys/qgzxapp/*default/index.do',
    alias: '勤工俭学',
  },
  {
    name: '一卡通综合管理平台',
    alias: '校园卡 充值 流水',
    url: 'https://yikatong.tongji.edu.cn/',
    priority: 3,
  },
  {
    name: '印象同济',
    url: 'https://photo.tongji.edu.cn/',
    alias: '素材库 图集 图库 宣传',
    children: [
      { name: '专题', url: 'https://photo.tongji.edu.cn/zt.htm' },
      { name: '图片', url: 'https://photo.tongji.edu.cn/tp.htm' },
      { name: '视频', url: 'https://photo.tongji.edu.cn/sp.htm' },
      { name: '声音', url: 'https://photo.tongji.edu.cn/sy.htm', alias: '广播台 同广要闻 新闻' },
      { name: '校报', url: 'https://photo.tongji.edu.cn/xb.htm', alias: '同济报 校刊 新闻' },
    ],
  },
  {
    name: '学生电子证明文件',
    url: 'https://zzfw.tongji.edu.cn/wec-self-print-app-console/mobile.html#/mobile/itemList',
    alias: '自助服务 自助打印',
    children: [
      {
        name: '本研校内奖学金',
        url: 'https://zzfw.tongji.edu.cn/wec-self-print-app-console/mobile.html#/mobile/orderDetail?id=1301787450619756546',
      },
      {
        name: '本科校外奖学金',
        url: 'https://zzfw.tongji.edu.cn/wec-self-print-app-console/mobile.html#/mobile/orderDetail?id=1301789030244974594',
      },
      {
        name: '本科生在读证明',
        url: 'https://zzfw.tongji.edu.cn/wec-self-print-app-console/mobile.html#/mobile/orderDetail?id=1511665017672437761',
      },
      {
        name: '本科成绩计算方式证明',
        url: 'https://zzfw.tongji.edu.cn/wec-self-print-app-console/mobile.html#/mobile/orderDetail?id=1511973850055708674',
        priority: -1,
      },
      {
        name: '本科生出入境证明',
        url: 'https://zzfw.tongji.edu.cn/wec-self-print-app-console/mobile.html#/mobile/orderDetail?id=1511975769566351361',
      },
      {
        name: '本科生英文成绩单',
        url: 'https://zzfw.tongji.edu.cn/wec-self-print-app-console/mobile.html#/mobile/orderDetail?id=1511981154608091137',
      },
      {
        name: '本科生中文成绩单',
        url: 'https://zzfw.tongji.edu.cn/wec-self-print-app-console/mobile.html#/mobile/orderDetail?id=1511982679250178049',
      },
      {
        name: '本科生进阶式培养成绩单',
        url: 'https://zzfw.tongji.edu.cn/wec-self-print-app-console/mobile.html#/mobile/orderDetail?id=1933477272036052993',
      },
      {
        name: '学籍专业排名',
        url: 'https://zzfw.tongji.edu.cn/wec-self-print-app-console/mobile.html#/mobile/orderDetail?id=1798312171055091713',
      },
    ],
  },

  // Students' creations
  { name: '乌龙茶选课社区', url: 'https://1.tongji.icu/', priority: 1 },
  { name: '济你太美网址导航', url: 'https://tongji.icu/', alias: '乌龙茶导航', priority: 1 },
  { name: '舟济社区', url: 'https://home.tongji.icu/', alias: '论坛', priority: 1 },
  { name: '一块钱', url: 'https://flowerblackg.github.io/onetj-webapp', alias: 'OneTJ' },
  { name: 'TJ 一起走', url: 'https://pinche.tj.hainuo.wang/', alias: '拼车 搭车' },
  { name: '同济排课助手', url: 'https://xk.xialing.icu/', alias: '第三方模拟选课系统' },
  { name: '通知公告备份站', url: 'https://1.xialing.icu/' },
  { name: '课程检索系统', url: 'https://tongji.xialing.icu/' },
  { name: '通济', url: 'https://course.f1justin.com/', alias: '第三方模拟选课系统' },
  { name: 'TJRun', url: 'https://tjrun.linho.cc/', alias: '站点搜索' },
  {
    name: '包子曰公众号',
    url: 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzI1MDEwMjU1Mw==&scene=124#wechat_redirect',
    alias: '出行 班车 交通',
  },

  // Third-party platforms
  { name: '中国大学 MOOC', url: 'https://www.icourse163.org/', alias: 'SPOC' },
  { name: '超星学习通', url: 'http://www.chaoxing.com/' },
  { name: '智慧树', url: 'http://online.zhihuishu.com/onlineSchool/student/index', alias: '知到' },
  { name: '课堂派', url: 'https://www.ketangpai.com/#/main' },
  { name: 'iLab-X 虚拟实验', url: 'https://www.ilab-x.com/' },
  { name: '中国知网', url: 'https://www.cnki.net/' },
  { name: '万方数据', url: 'https://www.wanfangdata.com.cn/' },
]
