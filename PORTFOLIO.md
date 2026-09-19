# 待辦清單 Web App 作品集

這是一個在 GitHub Copilot 實戰工作坊中完成的待辦清單 Web App。專案以純前端方式實作，從基本的待辦新增與狀態切換，到深色模式、篩選與批次清除已完成項目，逐步透過 GitHub Copilot 的 Agent Mode、MCP 與 repo 內的 agentic workflow 完成。

## 線上展示

https://teemontuh.github.io/my-copilot-workshop/

## 功能

- 新增待辦事項，空白內容不會加入清單
- 勾選或取消勾選待辦項目，已完成項目會顯示刪除線並淡化
- 刪除單筆待辦事項
- 顯示未完成項目數量，且數字會隨操作即時更新
- 支援全部、未完成、已完成三種篩選模式
- 篩選結果為空時，顯示對應提示文字
- 支援淺色與深色模式切換
- 深色模式偏好會儲存在 localStorage，重新整理後仍會保留
- 若使用者未手動切換主題，會跟隨作業系統的 prefers-color-scheme 設定
- 提供「清除已完成」按鈕，可一次刪除所有已完成項目
- 清除已完成項目前會顯示確認對話框，避免誤刪
- 待辦資料會存入 localStorage，重新整理頁面後仍可保留
- 採用卡片式版面，支援手機螢幕顯示

## 技術

這個專案使用純 HTML、CSS 與原生 JavaScript 製作，沒有使用任何框架或第三方套件，也沒有建立 package.json 或執行 npm install。畫面樣式以 CSS 變數管理配色，互動邏輯與資料更新由原生 JavaScript 處理，資料則儲存在瀏覽器的 localStorage，因此可以離線運作。

## 開發方式

這個專案不是單純手動寫出來，而是結合 GitHub Copilot 的多種能力逐步完成：

- 透過 GitHub Copilot Agent Mode，根據需求直接建立並修改 [index.html](index.html)、[styles.css](styles.css)、[app.js](app.js)
- 透過 MCP 連接 Microsoft Learn，查詢 prefers-color-scheme 與深色模式無障礙的官方文件建議
- 透過 MCP 讀取 GitHub repo 的 issue，整理需求與確認目前待處理問題
- 在 repo 中建立 [.github/copilot-instructions.md](.github/copilot-instructions.md)，把專案限制與協作規則明確寫下來
- 在 repo 中建立 [.github/prompts/fix-issue.prompt.md](.github/prompts/fix-issue.prompt.md)，把「讀 issue、提出計畫、修改、驗證、開 PR」流程寫成可重複使用的 agentic workflow

## 我學到什麼

- 把需求描述清楚，Agent Mode 才能更穩定地一次完成多檔案修改
- MCP 的價值在於讓 AI 不只看本機檔案，還能即時查官方文件與 GitHub 上的內容
- 專案規則寫進 [.github/copilot-instructions.md](.github/copilot-instructions.md) 後，協作方式會更一致
- 把修 issue 的流程寫成 prompt 檔後，後續處理新的 issue 會更有一致性與可重複性
- 即使是小型前端專案，也能透過 issue、分支、PR 與驗證步驟建立清楚的開發流程