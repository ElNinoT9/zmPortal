function formatDate(dateText) {
  const date = new Date(dateText);
  return date.toLocaleDateString("zh-CN");
}

function getDetailUrl(moduleType, id) {
  const from = encodeURIComponent(`${window.location.pathname.split("/").pop()}${window.location.search}`);
  return `detail.html?type=${moduleType}&id=${id}&from=${from}`;
}

function getItemHref(moduleType, item) {
  if (moduleType === "news" && item.externalUrl) {
    return item.externalUrl;
  }
  return getDetailUrl(moduleType, item.id);
}

function getItemTarget(moduleType, item) {
  if (moduleType === "news" && item.externalUrl) {
    return "_blank";
  }
  return "_self";
}

function renderHomeList(listId, data, moduleType) {
  const root = document.getElementById(listId);
  if (!root) {
    return;
  }
  const records = data.slice(0, 3);
  if (!records.length) {
    root.innerHTML = '<div class="card">暂无相关信息。</div>';
    return;
  }
  root.innerHTML = records
    .map(
      (item) => `
      <article class="card">
        <a class="card-link" href="${getItemHref(moduleType, item)}" target="${getItemTarget(
          moduleType,
          item
        )}" rel="noopener noreferrer">
          ${
            moduleType === "news"
              ? `<img class="news-cover" src="${item.image}" alt="${item.title}" />`
              : ""
          }
          <div class="meta">
            <span>${formatDate(item.date)}</span>
            <span>${item.type}</span>
          </div>
          <h4>${item.title}</h4>
          <p>${item.summary}</p>
        </a>
      </article>
    `
    )
    .join("");
}

function renderAll() {
  renderHomeList("news-list", siteData.news, "news");
  renderHomeList("invite-list", siteData.invites, "invites");
  renderHomeList("policy-list", siteData.policies, "policies");
}

function setToday() {
  const todayNode = document.getElementById("today");
  if (todayNode) {
    todayNode.textContent = new Date().toLocaleDateString("zh-CN");
  }
}

setToday();
renderAll();


{/* <span class="tag">${item.type}</span> */}
