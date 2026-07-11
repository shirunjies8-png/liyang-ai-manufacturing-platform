(function () {
  const HUMAN_NOTICE = 'AI 生成，仅供参考，需人工确认。正式价格、交期、付款方式和合同条款必须由负责人确认。';
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  function escapeHtml(value) {
    return String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function textLines(value) {
    return String(value || '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  }

  function safeFileName(value) {
    return String(value || '工厂办公导出').replace(/[\\/:*?"<>|]+/g, '-');
  }

  function setResult(targetId, title, text, options = {}) {
    const target = document.getElementById(targetId);
    if (!target) return;
    const actions = options.actions || `
      <div class="button-row wrap">
        <button class="btn secondary" type="button" data-export-target="${targetId}" data-export-name="${escapeHtml(title)}" data-format="txt">导出 TXT</button>
        <button class="btn secondary" type="button" data-export-target="${targetId}" data-export-name="${escapeHtml(title)}" data-format="word">导出 Word</button>
        <button class="btn ghost" type="button" data-export-target="${targetId}" data-export-name="${escapeHtml(title)}" data-format="excel">导出 Excel</button>
      </div>
    `;
    target.innerHTML = `
      <p class="eyebrow">${escapeHtml(options.eyebrow || 'Demo 结果')}</p>
      <h3>${escapeHtml(title)}</h3>
      <div class="ai-note">${HUMAN_NOTICE}</div>
      <pre>${escapeHtml(text)}</pre>
      ${actions}
    `;
  }

  function downloadFile(filename, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function exportElement(targetId, fileName, format) {
    const target = document.getElementById(targetId);
    if (!target) return;
    const name = safeFileName(fileName || targetId);
    const text = target.innerText.trim() || '暂无可导出内容';
    if (format === 'excel') {
      const rows = text.split('\n').filter(Boolean).map((line) => `<tr><td>${escapeHtml(line)}</td></tr>`).join('');
      downloadFile(`${name}.xls`, `<meta charset="UTF-8"><table>${rows}</table>`, 'application/vnd.ms-excel;charset=utf-8');
      return;
    }
    if (format === 'word') {
      downloadFile(`${name}.doc`, `<meta charset="UTF-8"><h1>${escapeHtml(name)}</h1><pre>${escapeHtml(text)}</pre>`, 'application/msword;charset=utf-8');
      return;
    }
    downloadFile(`${name}.txt`, text, 'text/plain;charset=utf-8');
  }

  function initNav() {
    const toggle = $('.nav-toggle');
    const links = $('.nav-links');
    if (!toggle || !links) return;
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    links.addEventListener('click', (event) => {
      if (event.target.closest('a')) links.classList.remove('open');
    });
  }

  function initQuote() {
    const form = $('#quoteForm');
    if (!form) return;
    const fill = $('#fillQuoteExample');
    const result = $('#quoteResult');

    fill?.addEventListener('click', () => {
      $('#material').value = '304 不锈钢';
      $('#quantity').value = '500';
      $('#process').value = 'CNC 加工';
      $('#delivery').value = '15 天内';
      $('#notes').value = '有图纸，需核对孔位公差，表面无明显划伤，独立包装。';
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const material = $('#material').value;
      const quantity = Number($('#quantity').value || 0);
      const process = $('#process').value;
      const delivery = $('#delivery').value;
      const notes = $('#notes').value.trim();
      const materialFactor = material.includes('316') ? 1.28 : material.includes('304') ? 1 : 1.15;
      const processFactor = process.includes('复合') ? 1.45 : process.includes('CNC') ? 1.18 : 1;
      const deliveryFactor = delivery.includes('7') ? 1.25 : delivery.includes('15') ? 1.1 : 1;
      const base = Math.max(18, Math.round((32 * materialFactor * processFactor * deliveryFactor) - Math.min(quantity / 120, 10)));
      const low = Math.max(8, base - 5);
      const high = base + 9;
      const difficulty = process.includes('复合') || delivery.includes('7') ? '中高' : quantity > 800 ? '中等偏批量' : '常规';
      const text = [
        `材料：${material}`,
        `数量：${quantity} 件`,
        `工艺：${process}`,
        `客户期望交期：${delivery}`,
        `初步单价区间：${low} - ${high} 元 / 件`,
        `加工难度：${difficulty}`,
        `交期建议：先确认图纸版本、关键公差、表面处理和包装方式，再给正式交期。`,
        `风险提醒：材料价格、图纸复杂度、检验标准和延期责任会影响正式报价。`,
        `微信回复建议：您好，需求已收到。我们可以先按 ${material}、${process}、${quantity} 件做初步评估，建议您补充图纸版本和关键尺寸要求。初步报价区间仅供参考，正式价格和交期需技术与生产确认后回复。`,
        notes ? `补充说明：${notes}` : '',
        HUMAN_NOTICE
      ].filter(Boolean).join('\n');

      result.innerHTML = `
        <p class="eyebrow">AI 报价分析</p>
        <h2>初步报价分析已生成</h2>
        <div class="ai-note">${HUMAN_NOTICE}</div>
        <pre>${escapeHtml(text)}</pre>
        <div class="button-row wrap">
          <button class="btn primary" type="button" onclick="window.print()">导出报价单（打印）</button>
          <button class="btn secondary" type="button" data-export-target="quoteResult" data-export-name="工厂AI报价分析" data-format="word">导出 Word</button>
          <button class="btn ghost" type="button" data-export-target="quoteResult" data-export-name="工厂AI报价分析" data-format="excel">导出 Excel</button>
        </div>
      `;
      saveLeadFromQuote({ material, quantity, process, price: `${low}-${high} 元/件` });
    });
  }

  function saveLeadFromQuote(data) {
    const leads = JSON.parse(localStorage.getItem('factoryLeads') || '[]');
    leads.unshift({
      id: Date.now(),
      customer: '网站客户',
      product: data.material,
      quantity: `${data.quantity} 件`,
      process: data.process,
      price: data.price,
      status: '待联系'
    });
    localStorage.setItem('factoryLeads', JSON.stringify(leads.slice(0, 20)));
  }

  function initAdmin() {
    const form = $('#adminForm');
    if (!form) return;
    const fields = ['companyName', 'mainProduct', 'equipment', 'serviceIndustry', 'advantages', 'phone', 'wechat', 'address'];
    const saved = JSON.parse(localStorage.getItem('factoryAdminData') || '{}');
    fields.forEach((id) => {
      if (saved[id] && document.getElementById(id)) document.getElementById(id).value = saved[id];
    });

    $('#saveAdminData')?.addEventListener('click', () => {
      localStorage.setItem('factoryAdminData', JSON.stringify(readAdminFields(fields)));
      alert('企业信息已保存到本地浏览器 Demo 数据。');
    });

    $('#clearAdminData')?.addEventListener('click', () => {
      localStorage.removeItem('factoryAdminData');
      fields.forEach((id) => {
        const field = document.getElementById(id);
        if (field) field.value = '';
      });
      $('#adminResult').innerHTML = '<p class="eyebrow">生成结果</p><h2>已清空示例数据</h2><p>可重新录入企业信息。</p>';
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = readAdminFields(fields);
      localStorage.setItem('factoryAdminData', JSON.stringify(data));
      const text = [
        `企业简介：${data.companyName || '本地制造企业'}专注 ${data.mainProduct || '制造加工'}，设备配置为 ${data.equipment || '待补充'}，主要服务 ${data.serviceIndustry || '制造业客户'}。`,
        `产品介绍：围绕 ${data.mainProduct || '核心产品'} 提供来图加工、样件试制、批量生产和质量追溯服务。`,
        `招聘文案：因业务发展招聘 CNC、数控车、质检、销售跟单等岗位，重视责任心、稳定交付和现场协作。`,
        `客户沟通话术：您好，我们可以先根据图纸、材料、数量、表面处理和交期要求做初步评估，正式报价需技术和生产确认。`,
        `联系方式：电话 ${data.phone || '待补充'}；微信 ${data.wechat || '待补充'}；地址 ${data.address || '待补充'}。`,
        HUMAN_NOTICE
      ].join('\n\n');
      setResult('adminResult', '企业介绍与工厂办公文案已生成', text, { eyebrow: '管理后台 Demo' });
    });
  }

  function readAdminFields(fields) {
    return fields.reduce((data, id) => {
      data[id] = document.getElementById(id)?.value.trim() || '';
      return data;
    }, {});
  }

  function updateLeadStats() {
    const rows = $$('#leadsTable tbody tr');
    if (!rows.length) return;
    const statuses = rows.map((row) => row.querySelector('.lead-status')?.textContent.trim());
    const set = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };
    set('totalLeads', rows.length);
    set('pendingLeads', statuses.filter((item) => item === '待联系').length);
    set('quotedLeads', statuses.filter((item) => item === '已报价').length);
    set('wonLeads', statuses.filter((item) => item === '已成交').length);
  }

  window.updateStatus = function updateStatus(id) {
    const row = document.querySelector(`#leadsTable tbody tr[data-id="${id}"]`);
    if (!row) return;
    const status = row.querySelector('.lead-status');
    const states = [
      { text: '待联系', className: 'lead-status status-pending' },
      { text: '已报价', className: 'lead-status status-quoted' },
      { text: '已成交', className: 'lead-status status-won' }
    ];
    const current = states.findIndex((item) => item.text === status.textContent.trim());
    const next = states[(current + 1) % states.length];
    status.textContent = next.text;
    status.className = next.className;
    updateLeadStats();
  };

  function initOffice() {
    initOcr();
    initDocAssistant();
    initFactoryChat();
    initCustomerReply();
    initPdfParser();
    initSecurity();
    initStatusCenter();
  }

  function initOcr() {
    const form = $('#ocrDemoForm');
    if (!form) return;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const type = $('#ocrDocType').value;
      const input = $('#ocrInput').value;
      const lines = textLines(input);
      const text = [
        `单据类型：${type}`,
        `识别字段：${lines.length} 行`,
        `结构化结果：`,
        ...lines.map((line, index) => `${index + 1}. ${line}`),
        `AI 建议：核对客户、数量、交期、图纸版本、包装要求和盖章签字项。`,
        HUMAN_NOTICE
      ].join('\n');
      setResult('ocrResult', `${type} OCR 识别完成`, text, { eyebrow: '工厂单据 OCR 中心' });
    });
  }

  function initDocAssistant() {
    const form = $('#docAssistantForm');
    if (!form) return;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const scene = $('#docScene').value;
      const input = $('#docInput').value;
      const question = $('#docQuestion').value;
      setResult('docResult', scene, buildDocAnalysis(scene, input, question), { eyebrow: 'AI 文档助手' });
    });
  }

  function buildDocAnalysis(scene, input, question) {
    const summary = textLines(input).join(' ').slice(0, 180);
    const risks = [];
    if (/赔偿|延期|违约|合同|承诺/.test(input)) risks.push('发现合同或承诺风险：涉及延期、赔偿、违约或签约条件。');
    if (/上次价格|最低价|价格/.test(input)) risks.push('发现报价风险：客户提到历史价格或价格要求，需核对材料成本。');
    if (/交付|交期|日期|天/.test(input)) risks.push('发现交期风险：需确认产能、材料到货和图纸版本。');
    return [
      `场景：${scene}`,
      `摘要：${summary || '暂无内容'}`,
      `问题：${question || '无'}`,
      `回答：建议先拆分客户需求、报价条件、交期条件和合同责任，再由销售、技术、生产共同确认。`,
      `风险提示：${risks.length ? risks.join(' ') : '暂未发现明显高风险表达，但仍需人工复核。'}`,
      `下一步：补齐图纸、材料牌号、数量、检验标准、包装方式和收款条件后，再对外回复。`,
      HUMAN_NOTICE
    ].join('\n');
  }

  function initFactoryChat() {
    const form = $('#factoryChatForm');
    const input = $('#factoryChatInput');
    const result = $('#factoryChatResult');
    if (!form || !input || !result) return;

    $$('[data-chat-prompt]').forEach((button) => {
      button.addEventListener('click', () => {
        input.value = button.dataset.chatPrompt;
        input.focus();
      });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const question = input.value.trim();
      if (!question) return;
      result.insertAdjacentHTML('beforeend', `<div class="message user">${escapeHtml(question)}</div>`);
      result.insertAdjacentHTML('beforeend', `<div class="message ai">${escapeHtml(factoryChatAnswer(question))}</div>`);
      input.value = '';
      result.scrollIntoView({ block: 'nearest' });
    });
  }

  function factoryChatAnswer(question) {
    if (/招聘/.test(question)) {
      return `建议写清岗位、设备类型、班次、经验要求和薪资面议方式。不要夸大待遇，面试和录用条件以人工确认为准。${HUMAN_NOTICE}`;
    }
    if (/合同|风险|赔偿/.test(question)) {
      return `请重点检查交期、验收标准、延期赔偿、付款节点、图纸版本、保密条款和争议处理。高风险条款需负责人或法务确认。${HUMAN_NOTICE}`;
    }
    if (/维修|设备/.test(question)) {
      return `可按设备名称、故障现象、停机时间、处理措施、备件更换、责任人、复发预防来整理维修记录。建议同步到质检和生产计划。${HUMAN_NOTICE}`;
    }
    return `建议把客户需求拆成材料、数量、工艺、图纸、表面处理、包装、交期、检验标准和付款条件，再生成初步回复。${HUMAN_NOTICE}`;
  }

  function initCustomerReply() {
    const form = $('#customerReplyForm');
    if (!form) return;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const inquiry = $('#replyInput').value.trim();
      const tone = $('#replyTone').value;
      const english = tone.includes('英文');
      const text = english
        ? `Dear customer, thank you for your inquiry. We have received your drawing and quantity request. We will review material, tolerance, process, surface finish and delivery requirements first. The preliminary suggestion is for discussion only; final price, lead time and contract terms must be confirmed by our responsible team.`
        : `您好，您的询盘已收到。我们会先根据材料、数量、图纸、公差、表面处理和交期要求做初步评估。若方便，请补充图纸版本、检验标准和包装要求。初步建议仅供沟通，正式价格、最快交期和合同承诺需负责人确认后回复。`;
      setResult('replyResult', `${tone}客服回复建议`, [`客户询盘：${inquiry}`, `回复建议：${text}`, HUMAN_NOTICE].join('\n\n'), { eyebrow: 'AI 客服回复' });
    });
  }

  function initPdfParser() {
    const form = $('#pdfParserForm');
    if (!form) return;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const type = $('#pdfType').value;
      const input = $('#pdfInput').value;
      const text = [
        `PDF 类型：${type}`,
        `提取摘要：${textLines(input).join(' ').slice(0, 220)}`,
        `关键字段：客户/供应商、产品、数量、材料、交期、验收标准、付款条件、违约责任。`,
        `风险提示：如出现延期赔偿、全额承担、直接签署、未明确图纸版本等表达，必须人工确认。`,
        `建议动作：转交报价 Agent、销售 Agent 和安全 Agent 共同复核。`,
        HUMAN_NOTICE
      ].join('\n');
      setResult('pdfResult', `${type}解析完成`, text, { eyebrow: 'PDF 合同 / 订单解析' });
    });
  }

  function initSecurity() {
    const form = $('#securityForm');
    if (!form) return;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = $('#securityInput').value;
      const masked = input.replace(/1[3-9]\d{9}/g, (phone) => `${phone.slice(0, 3)}****${phone.slice(-4)}`);
      const issues = [];
      if (/承诺|正式|最快|一定|保证/.test(input)) issues.push('AI 回复存在承诺风险，需改为“待确认”。');
      if (/赔偿|全额|违约/.test(input)) issues.push('合同责任风险较高，需负责人审核。');
      if (/手机号|1[3-9]\d{9}/.test(input)) issues.push('检测到手机号，已执行脱敏。');
      const text = [
        `脱敏后内容：${masked}`,
        `审核结论：${issues.length ? issues.join(' ') : '暂未发现明显风险。'}`,
        `安全动作：阻止 AI 自动发送，进入人工确认队列。`,
        HUMAN_NOTICE
      ].join('\n\n');
      setResult('securityResult', '安全审核完成', text, { eyebrow: 'AI 安全中心' });
      $('#securityLog').innerHTML = `<span>操作日志：${new Date().toLocaleString('zh-CN')} 完成一次 AI 回复审核与敏感信息脱敏。</span>`;
    });
  }

  function initStatusCenter() {
    const build = $('#buildTimeText');
    const latency = $('#latencyText');
    if (build) build.textContent = `构建时间：${new Date().toLocaleDateString('zh-CN')}`;
    if (latency) latency.textContent = `${Math.floor(90 + Math.random() * 90)}ms`;
  }

  function selectedExportItems() {
    return $$('.export-options input:checked').map((input) => input.value);
  }

  function exportCenter(format) {
    const items = selectedExportItems();
    const rows = [
      ['数据类型', 'Demo 内容', '人工确认'],
      ...items.map((item) => [item, `${item} 已加入办公导出中心`, '需要'])
    ];
    const text = rows.map((row) => row.join('\t')).join('\n');
    const name = 'AI工厂办公导出中心';
    setResult('exportResult', '导出任务已生成', `${text}\n\n${HUMAN_NOTICE}`, { eyebrow: '办公导出中心' });
    if (format === 'excel') {
      const table = rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('');
      downloadFile(`${name}.xls`, `<meta charset="UTF-8"><table>${table}</table>`, 'application/vnd.ms-excel;charset=utf-8');
      return;
    }
    if (format === 'word') {
      downloadFile(`${name}.doc`, `<meta charset="UTF-8"><h1>${name}</h1><pre>${escapeHtml(text)}</pre><p>${HUMAN_NOTICE}</p>`, 'application/msword;charset=utf-8');
      return;
    }
    downloadFile(`${name}.txt`, `${text}\n\n${HUMAN_NOTICE}`, 'text/plain;charset=utf-8');
  }

  function runAgent(button) {
    const card = button.closest('.agent-card');
    const agent = card?.dataset.agent || '工厂 Agent';
    const text = [
      `Agent：${agent}`,
      `状态：Demo 已完成`,
      `执行步骤：读取任务 -> 提取工厂字段 -> 生成建议 -> 进入人工确认。`,
      `输出：${agent} 已生成处理建议，禁止自动对外承诺价格、交期和合同条款。`,
      HUMAN_NOTICE
    ].join('\n');
    setResult('agentResult', `${agent}运行结果`, text, { eyebrow: '多 Agent 协同工作台' });
  }

  function cycleBugStatus(button) {
    const row = button.closest('.bug-row');
    if (!row) return;
    const statuses = ['待处理', '已解决', '已忽略'];
    const current = statuses.indexOf(row.dataset.status);
    const next = statuses[(current + 1) % statuses.length];
    row.dataset.status = next;
    row.querySelector('em').textContent = next;
  }

  function handleDemoAction(action, button) {
    if (action === 'ocr-correct') {
      const text = $('#ocrInput')?.value || '';
      setResult('ocrResult', 'AI 纠错结果', `已检查单据错别字、日期、数量和图纸版本字段。\n\n修正建议：${text.replace(/V2/g, 'V2（请确认最新版图纸）')}\n\n${HUMAN_NOTICE}`, { eyebrow: '工厂单据 OCR 中心' });
    }
    if (action === 'ocr-summary') {
      setResult('ocrResult', 'AI 总结结果', `该单据涉及客户、产品、数量、工艺、交期和包装要求。建议重点核对数量、交期、图纸版本、签字盖章和异常备注。\n\n${HUMAN_NOTICE}`, { eyebrow: '工厂单据 OCR 中心' });
    }
    if (action === 'ocr-translate') {
      setResult('ocrResult', 'AI 翻译结果', `Delivery note / purchase document summary: stainless steel parts, CNC machining, quantity and delivery date need confirmation. Drawing version and packaging requirements should be checked before formal reply.\n\n${HUMAN_NOTICE}`, { eyebrow: '工厂单据 OCR 中心' });
    }
    if (action === 'ocr-qa') {
      setResult('ocrResult', 'AI 问答结果', `问：这张单据最需要确认什么？\n答：客户名称、产品规格、数量、图纸版本、交期、包装方式和签字盖章项。\n\n${HUMAN_NOTICE}`, { eyebrow: '工厂单据 OCR 中心' });
    }
    if (action === 'doc-translate') {
      const input = $('#docInput')?.value || '';
      setResult('docResult', '外贸消息翻译', `Business English draft:\n${input}\n\nWe need to confirm material, drawing version, tolerance, delivery schedule and liability terms before making any formal commitment.\n\n${HUMAN_NOTICE}`, { eyebrow: 'AI 文档助手' });
    }
    if (action === 'agent-run') runAgent(button);
    if (action === 'export-excel') exportCenter('excel');
    if (action === 'export-word') exportCenter('word');
    if (action === 'export-txt') exportCenter('txt');
    if (action === 'bug-next') cycleBugStatus(button);
  }

  document.addEventListener('click', (event) => {
    const exportButton = event.target.closest('[data-export-target]');
    if (exportButton) {
      exportElement(exportButton.dataset.exportTarget, exportButton.dataset.exportName, exportButton.dataset.format || 'txt');
      return;
    }
    const actionButton = event.target.closest('[data-demo-action]');
    if (actionButton) {
      handleDemoAction(actionButton.dataset.demoAction, actionButton);
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initQuote();
    initAdmin();
    initOffice();
    updateLeadStats();
  });
})();
