# GitHub Pages 部署指南

## 自动部署步骤

### 1. 推送代码到GitHub

```bash
git add .
git commit -m "配置GitHub Pages部署"
git push origin main
```

### 2. 在GitHub仓库中启用GitHub Pages

1. 进入你的GitHub仓库页面
2. 点击 **Settings** (设置)
3. 在左侧菜单找到 **Pages**
4. 在 **Source** (源) 下拉菜单中选择 **GitHub Actions**
5. 保存设置

### 3. 等待自动部署

- 推送代码后，GitHub Actions会自动运行
- 可以在仓库的 **Actions** 标签页查看部署进度
- 部署成功后，网站将在以下地址访问：
  - `https://<你的用户名>.github.io/campus-food-safety/`

## 手动部署（备选方案）

如果不想使用GitHub Actions，可以手动部署：

### 1. 安装gh-pages

```bash
npm install -D gh-pages
```

### 2. 在package.json中添加部署脚本

```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

### 3. 运行部署命令

```bash
npm run deploy
```

## 注意事项

1. **仓库名称**：确保 `vite.config.ts` 中的 `base` 路径与你的仓库名称一致
   - 当前配置：`/campus-food-safety/`
   - 如果仓库名不同，需要修改这个值

2. **分支**：默认从 `main` 分支部署，如果使用其他分支，需修改 `.github/workflows/deploy.yml`

3. **Node版本**：确保本地和GitHub Actions使用相同的Node版本（当前为20）

4. **路由模式**：如果使用Vue Router的history模式，需要在GitHub Pages上配置404重定向
   - 可以在 `public` 目录添加 `404.html` 文件，内容与 `index.html` 相同

## 故障排查

### 页面显示404
- 检查仓库的GitHub Pages设置是否正确
- 确认 `base` 路径配置正确
- 查看Actions运行日志

### 资源加载失败
- 检查 `vite.config.ts` 中的 `base` 配置
- 确保路径以 `/` 开头和结尾

### 路由不工作
- 添加 `404.html` 处理客户端路由
- 或考虑使用hash模式路由

## 更新网站

每次推送到main分支，网站会自动重新部署。
