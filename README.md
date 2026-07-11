# AI 工厂办公系统 / AI Factory Office OS

面向中小工厂的纯前端 Demo，整合企业展示、产品展示、AI 报价、询盘管理、工厂单据 OCR、AI 文档助手、AI 客服回复、多 Agent 协同、AI 安全中心、系统稳定性监控和后台管理。

本项目是在原“溧阳制造企业 AI 获客平台”基础上继续整合，不是重新做一个无关办公软件。原有企业展示、产品展示、AI 报价助手、询盘管理、后台管理、招聘信息和联系页面继续保留。

## 新定位

- 中文名：AI 工厂办公系统
- 英文名：AI Factory Office OS
- 用户：中小工厂老板、业务员、跟单、采购、质检、办公室人员
- 部署：纯 HTML + CSS + JavaScript，可直接部署到 GitHub Pages
- 模式：当前为 Demo 模式，可后续接入真实 AI / OCR / PDF / Excel API
- 安全边界：AI 生成，仅供参考，需人工确认

## 已整合模块

- 工厂单据 OCR 中心：发货单、采购单、产品标签、生产日报、合同、报价单识别；保留 AI 纠错、AI 总结、AI 翻译、AI 问答、导出 Excel / Word / TXT。
- AI 文档助手：合同总结、客户需求总结、采购单解释、外贸消息翻译、文档问答和风险提示。
- 工厂 AI 助手：报价、客户回复、订单整理、招聘文案、产品介绍、合同风险、设备维修记录。
- 办公导出中心：OCR 结果、报价单、客户清单、询盘记录导出 Excel / Word / TXT。
- 系统稳定性中心：记录 AI 调用失败、OCR 识别失败、接口错误、页面错误、响应慢、卡顿问题，支持待处理、已解决、已忽略状态。
- 工厂系统状态中心：展示 AI、OCR、PDF、Excel、Demo/API 模式、模型名称、版本号、构建时间、响应耗时。
- PDF 合同 / 订单解析：解析合同 PDF、报价单 PDF、产品说明书 PDF、采购订单 PDF 和客户需求文档。
- AI 客服回复：根据客户询盘生成回复建议，正式报价、交期、合同承诺必须人工确认。
- 多 Agent 协同工作台：报价 Agent、客服 Agent、OCR Agent、销售 Agent、质检 Agent、安全 Agent。
- AI 安全中心：敏感信息脱敏、AI 回复审核、报价风险提醒、合同风险提示、操作日志、人工确认机制。

## 文件结构

```text
liyang-ai-manufacturing-platform/
├── index.html              # 首页：中小工厂 AI 办公系统定位与模块入口
├── factory-office.html     # AI 工厂办公系统工作台
├── enterprise.html         # 企业展示页：溧阳五四不锈钢
├── products.html           # 产品展示页：不锈钢零部件、CNC 加工、数控车加工
├── quote.html              # AI 报价助手
├── leads.html              # 询盘管理
├── admin.html              # 管理后台 + AI 工厂办公模块入口
├── jobs.html               # 招聘展示页
├── contact.html            # 联系我们页面
├── competition.html        # 项目说明
├── css/style.css           # 工业办公风格与响应式布局
└── js/app.js               # Demo 交互、报价、后台、OCR、导出、Agent、安全与状态逻辑
```

## 运行方法

直接打开 `index.html`，或在项目目录执行：

```bash
python3 -m http.server 8080
```

然后访问：

```text
http://localhost:8080
```

## 演示路线

1. 打开 `index.html`，查看“中小工厂 AI 办公系统”定位。
2. 进入 `admin.html`，录入企业资料并生成企业介绍与办公文案。
3. 进入 `quote.html`，生成初步报价分析和客户回复话术。
4. 进入 `leads.html`，查看询盘管理和跟进状态。
5. 进入 `factory-office.html`，体验 OCR、文档助手、客服回复、多 Agent、安全中心、稳定性中心、系统状态中心和导出中心。

## 安全说明

Demo 中所有 AI 生成内容均标注：

```text
AI 生成，仅供参考，需人工确认。
```

系统禁止 AI 自动承诺正式价格、交期和合同条款。正式报价、交期、付款方式、质量承诺和合同签署必须由工厂负责人确认。
