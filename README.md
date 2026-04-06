# 招投标静态网站

本项目为纯静态站点（无后端），用于发布：

- 公司新闻
- 项目对外邀请信息
- 可公开的管理制度

## 本地预览

直接双击 `index.html` 即可打开。  
如需更接近线上环境，建议使用本地静态服务器：

```bash
python3 -m http.server 8080
```

然后访问：`http://localhost:8080`

## 内容维护

主要维护文件：

- `app.js`：三大模块的数据内容（标题、日期、分类、正文）
- `index.html`：页面结构和文案
- `styles.css`：页面样式

## 部署到指定域名

以下给出两种常见方式。

### 方案 A：部署到 Linux + Nginx（企业常用）

1. 服务器安装 Nginx。
2. 将本目录文件上传到服务器，例如：`/var/www/bidding-site`。
3. 配置 Nginx：

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    root /var/www/bidding-site;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

4. 检查并重载配置：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

5. 域名解析：在域名控制台将 `A` 记录指向服务器公网 IP。
6. HTTPS（推荐）：使用 `certbot` 申请并自动配置证书。

### 方案 B：部署到静态托管平台（更省运维）

可用平台：Vercel、Netlify、Cloudflare Pages、GitHub Pages（配合自定义域名）。

通用流程：

1. 将项目上传到 Git 仓库。
2. 在托管平台导入仓库，构建类型选择 `Static`（无需构建命令）。
3. 发布目录设为项目根目录。
4. 在平台绑定自定义域名（如 `bid.your-domain.com`）。
5. 按平台提示在 DNS 配置 `CNAME` 或 `A` 记录。

## 上线检查清单

- 页面在手机与桌面端显示正常
- 三类数据均可正常筛选
- 域名访问与 HTTPS 正常
- 联系方式与公司信息为最终正式版本
