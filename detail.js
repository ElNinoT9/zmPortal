function formatDate(dateText) {
  const date = new Date(dateText);
  return date.toLocaleDateString("zh-CN");
}

function getModuleTitle(moduleType) {
  const titleMap = {
    news: "公司新闻详情",
    invites: "招标信息详情",
    policies: "管理制度详情"
  };
  return titleMap[moduleType] || "信息详情";
}

function getRecordsByType(moduleType) {
  const dataMap = {
    news: siteData.news,
    invites: siteData.invites,
    policies: siteData.policies
  };
  return dataMap[moduleType] || [];
}

function initDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const moduleType = params.get("type") || "news";
  const id = Number(params.get("id"));
  const records = getRecordsByType(moduleType);
  const item = records.find((record) => record.id === id);

  document.getElementById("back-to-list").setAttribute("href", `list.html?type=${moduleType}`);

  const box = document.getElementById("detail-box");
  if (!item) {
    box.innerHTML = `
      <h2>未找到该条信息</h2>
      <p>请返回列表页重新选择。</p>
    `;
    return;
  }

  const imageHtml =
    moduleType === "news" && item.image
      ? `<img class="detail-cover" src="${item.image}" alt="${item.title}" />`
      : "";

  const externalHtml =
    moduleType === "news" && item.externalUrl
      ? `<p><a class="text-link" href="${item.externalUrl}" target="_blank" rel="noopener noreferrer">查看原文 / View original</a></p>`
      : "";

  box.innerHTML = `
    <div class="meta">
      <span>${formatDate(item.date)}</span>
      <span>${item.type}</span>
    </div>
    <h2>${item.title}</h2>
    ${imageHtml}
    ${externalHtml}
    <p>${item.content}</p>
  `;
}

initDetailPage();
