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

function getParagraphs(item) {
  if (Array.isArray(item.paragraphs) && item.paragraphs.length) {
    return item.paragraphs;
  }
  return item.content ? [item.content] : [];
}

function getImages(item) {
  const images = [];
  if (item.image) {
    images.push({ src: item.image, alt: item.title, afterParagraph: 1 });
  }
  if (Array.isArray(item.images)) {
    item.images.forEach((img, index) => {
      if (typeof img === "string") {
        images.push({
          src: img,
          alt: `${item.title} 图片${index + 1}`,
          afterParagraph: index + 1
        });
      } else if (img && img.src) {
        images.push({
          src: img.src,
          alt: img.alt || `${item.title} 图片${index + 1}`,
          afterParagraph:
            Number.isInteger(img.afterParagraph) && img.afterParagraph > 0
              ? img.afterParagraph
              : index + 1
        });
      }
    });
  }
  return images;
}

function renderBodyBlocks(item) {
  const paragraphs = getParagraphs(item);
  const images = getImages(item);
  const blocks = [];
  const imageMap = {};

  images.forEach((img) => {
    const key = img.afterParagraph;
    if (!imageMap[key]) {
      imageMap[key] = [];
    }
    imageMap[key].push(img);
  });

  for (let i = 0; i < paragraphs.length; i += 1) {
    const paragraphNo = i + 1;
    blocks.push(`<p class="detail-paragraph">${paragraphs[i]}</p>`);
    const imagesAfterCurrent = imageMap[paragraphNo] || [];
    imagesAfterCurrent.forEach((img) => {
      blocks.push(`
        <div class="detail-image-wrap">
          <img class="detail-cover" src="${img.src}" alt="${img.alt}" />
        </div>
      `);
    });
  }

  if (!paragraphs.length && images.length) {
    images.forEach((img) => {
      blocks.push(`
        <div class="detail-image-wrap">
          <img class="detail-cover" src="${img.src}" alt="${img.alt}" />
        </div>
      `);
    });
  }

  return blocks.join("");
}

function renderAttachments(item) {
  if (!Array.isArray(item.attachments) || !item.attachments.length) {
    return "";
  }

  function getAttachmentExt(url = "") {
    const cleanUrl = url.split("?")[0].split("#")[0];
    const parts = cleanUrl.split(".");
    return parts.length > 1 ? parts.pop().toLowerCase() : "";
  }

  function getAttachmentAttrs(file) {
    const ext = getAttachmentExt(file.url);
    if (ext === "pdf") {
      return 'target="_blank" rel="noopener noreferrer"';
    }
    return `download="${file.name}"`;
  }

  return `
    <section class="detail-attachments">
      <h4>附件 / Attachments</h4>
      <ul>
        ${item.attachments
          .map(
            (file) => `
          <li>
            <a class="text-link" href="${file.url}" ${getAttachmentAttrs(file)}>${file.name}</a>
          </li>
        `
          )
          .join("")}
      </ul>
    </section>
  `;
}

function getBackHref(moduleType, params) {
  const from = params.get("from");
  if (!from) {
    return `list.html?type=${moduleType}`;
  }

  const decodedFrom = decodeURIComponent(from).trim();
  if (!decodedFrom || /^(https?:)?\/\//i.test(decodedFrom)) {
    return `list.html?type=${moduleType}`;
  }

  return decodedFrom;
}

function initDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const moduleType = params.get("type") || "news";
  const id = Number(params.get("id"));
  const records = getRecordsByType(moduleType);
  const item = records.find((record) => record.id === id);

  document.getElementById("back-to-list").setAttribute("href", getBackHref(moduleType, params));

  const box = document.getElementById("detail-box");
  if (!item) {
    box.innerHTML = `
      <h2>未找到该条信息</h2>
      <p>请返回列表页重新选择。</p>
    `;
    return;
  }

  const externalHtml =
    moduleType === "news" && item.externalUrl
      ? `<p><a class="text-link" href="${item.externalUrl}" target="_blank" rel="noopener noreferrer">查看原文 / View original</a></p>`
      : "";

  const bodyHtml = renderBodyBlocks(item);
  const attachmentsHtml = renderAttachments(item);
  const publisher = item.publisher || "信息公开平台";
  const publishedAt = item.publishedAt || item.date;

  box.innerHTML = `
    <div class="meta">
      <span>${formatDate(item.date)}</span>
      <span>${item.type}</span>
    </div>
    <h2 class="detail-title">${item.title}</h2>
    <p class="detail-publish-info">
      发布时间 Release time：${formatDate(publishedAt)}
    </p>
    <div class="detail-body">
      ${bodyHtml}
    </div>
    ${externalHtml}
    ${attachmentsHtml}
  `;
}

initDetailPage();




// 发布人：${publisher} &nbsp;&nbsp;|&nbsp;&nbsp; 发布时间：${formatDate(publishedAt)}
