# My Food Book

食事・栄養素・体重を記録する、**完全クライアント完結型**の PWA。
API 通信は行わず、全データを **IndexedDB (Dexie) + localStorage** に保持します。

- 詳細な仕様は [SPEC.md](./SPEC.md) を参照してください。

## 特長

- 📊 **レポート** — 期間を指定して、体重×カロリーの複合グラフと栄養素（P/C/F）の棒グラフを表示
- 🍚 **食事記録** — 日付ごとに食事・体重を記録し、当日の摂取量を目標値と比較
- 🥩 **食品マスタ** — 食品ごとの栄養素（タンパク質・炭水化物・脂質・カロリー）を登録・編集
- 👤 **ユーザー** — 基本情報から 1 日の目標栄養素を自動算出、サンプルデータのインポート、全リセット
- 📱 **PWA** — オフライン動作・ホーム画面追加に対応（自前の軽量 Service Worker）

## 技術スタック

| 区分 | 採用 |
| --- | --- |
| パッケージマネージャ | pnpm |
| フレームワーク | Next.js 15 (App Router) |
| 言語 | TypeScript (strict) |
| 出力 | 静的書き出し `output: 'export'`（`out/`） |
| スタイル | SCSS Modules（`sass`） |
| データ | IndexedDB (Dexie + dexie-react-hooks) + localStorage |
| チャート | recharts |
| アイコン | react-icons（lucide `lu`） |

外部依存は最小限（recharts / react-icons / dexie(+dexie-react-hooks)）。
プッシュ通知・Firebase・GA・アプリバージョン表示は搭載しません。

## セットアップ

```bash
pnpm install
```

## 開発・ビルド

```bash
pnpm dev      # 開発サーバー (http://localhost:3000)
pnpm build    # 本番ビルド → 静的書き出し (out/)
pnpm lint     # Lint
```

ビルド成果物 `out/` は任意の静的ホスティングへそのまま配置できます。

## ディレクトリ構成

```
src/
├─ app/                    # App Router（全ページ 'use client'）
│  ├─ layout.tsx           # ルートレイアウト（Header/Footer/Provider/AppInit）
│  ├─ globals.scss         # デザイントークン（CSS 変数）
│  ├─ page.tsx             # / レポート
│  ├─ task/page.tsx        # /task 食事
│  ├─ master/page.tsx      # /master 食品マスタ
│  └─ user/page.tsx        # /user ユーザー
├─ components/             # UI コンポーネント + *.module.scss
├─ lib/                    # 純粋ロジック・データ層（db / storage / nutrition / date / text）
├─ types/                  # 型定義
├─ styles/                 # 共有 SCSS mixin
└─ assets/nutrient.json    # 初期マスタ（サンプル食品）
public/                    # manifest / sw.js / アイコン
```

## データについて

- **IndexedDB (`myDatabase`)**: `master` / `task` / `history` の 3 ストア。
- **localStorage**: `user` プロフィール（基本情報＋算出した目標値）。
- 既存データとの互換のため、起動時に旧データを自動移行します（日付の ISO 正規化、糖質キーの `carbohydrate` への移し替え）。詳細は [SPEC.md](./SPEC.md) を参照。
