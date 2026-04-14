function formatDate(dateText) {
  const date = new Date(dateText);
  return date.toLocaleDateString("zh-CN");
}

function getModuleConfig(moduleType) {
  const map = {
    news: { title: "公司新闻列表", desc: "公司新闻与最新动态", data: siteData.news },
    invites: { title: "采购信息披露", desc: "项目招标、询价与比选信息", data: siteData.invites },
    policies: { title: "管理制度列表", desc: "管理制度文件", data: siteData.policies }
  };
  return map[moduleType] || map.news;
}

function getItemLink(moduleType, item) {
  if (moduleType === "news" && item.externalUrl) {
    return { href: item.externalUrl, target: "_blank" };
  }
  const from = encodeURIComponent(`${window.location.pathname.split("/").pop()}${window.location.search}`);
  return { href: `detail.html?type=${moduleType}&id=${item.id}&from=${from}`, target: "_self" };
}

function initListPage() {
  const params = new URLSearchParams(window.location.search);
  const moduleType = params.get("type") || "news";
  const config = getModuleConfig(moduleType);

  document.getElementById("list-page-title").textContent = config.title;
  document.getElementById("list-page-desc").textContent = config.desc;

  const rows = document.getElementById("list-rows");
  if (!config.data.length) {
    rows.innerHTML = '<div class="list-row"><span>暂无数据</span></div>';
    return;
  }

  rows.innerHTML = config.data
    .map(
      (item) => {
        const link = getItemLink(moduleType, item);
        return `
      <a class="list-row card-link" href="${link.href}" target="${link.target}" rel="noopener noreferrer">
        <span>${item.title}</span>
        <span>${formatDate(item.date)}</span>
      </a>
    `;
      }
    )
    .join("");
}

initListPage();
