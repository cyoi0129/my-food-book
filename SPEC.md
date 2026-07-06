# My Food Book — 仕様書

食事・栄養素・体重を記録する、完全クライアント完結型の PWA。API 通信は行わず、全データを
**IndexedDB (Dexie) + localStorage** に保持する。本書を実装の単一の基準（Single Source of Truth）とする。

概要・セットアップは [README.md](./README.md) を参照。

---

## 1. 方針・スコープ

- 完全クライアントアプリ。静的書き出し（`output: 'export'`）で任意の静的ホスティングへ配置する。
- 動的ルート・API Routes は使わない。DB / localStorage アクセスは client component + `useEffect` / `useLiveQuery` に閉じる。
- 外部依存は最小限：`recharts`（チャート）・`react-icons`（アイコン）・`dexie` / `dexie-react-hooks`（IndexedDB）。
- プッシュ通知・Firebase・GA・アプリバージョン表示は**非搭載**。

### 技術スタック

- pnpm / Next.js 15 (App Router) / TypeScript (strict)
- 出力: `output: 'export'`（静的書き出し）
- スタイル: SCSS Modules（`sass`）。共有 mixin は `src/styles/_mixins.scss`（`@use 'styles/mixins' as *;` で参照。`next.config.mjs` の `sassOptions.includePaths` に `src` を登録済み）。
- フォント: システムフォントスタック（`next/font` は不使用。オフライン静的書き出しの安定性と日本語表示を優先）。

---

## 2. データモデル（**現行ユーザーのデータ継続のため互換を維持**）

### IndexedDB（DB 名: `myDatabase`）

Dexie のスキーマは **version 2**。糖質の名称を旧 `sugar` から `carbohydrate` へ是正済み。

- `master`: `++id, name, category, protein, carbohydrate, fat, calorie`
- `task`: `++id, date, master, volume`
- `history`: `++id, date, weight, protein, carbohydrate, fat, calorie`

**バージョン移行（`lib/db.ts`）**
- v1: 旧スキーマ（栄養素名 `sugar`）。既存ユーザーの DB はこの版で作られている。
- v2: 索引名を `carbohydrate` に変更し、`upgrade()` で `master` / `history` の既存レコードのプロパティ
  `sugar` を `carbohydrate` へ移し替える（値を保持）。

> **既知の差異**: `task` の索引は `master` と定義されているが、実プロパティ名は `masterID`。
> 索引 `master` 経由のクエリは行っていない（JS 側で `find` / `filter`）ため実害なし。スキーマ互換のため索引文字列は現状維持。

### localStorage（`user` プロフィール）

- キー: `user`（初期化フラグ `'1'`）, `age`, `gender`, `term`, `height`, `weight`, `protein`, `carbohydrate`, `fat`, `calorie`
- `gender`: `'male' | 'female'` / `term`: `'diet' | 'normal'`
- 目標値 `protein / carbohydrate / fat / calorie` は基本情報から算出して保存
- 移行フラグ: `dateMigrated`（`'1'` で日付正規化済み）

### 起動時の移行処理（`components/AppInit.tsx`）

`AppInit` は DOM を描画せず、起動時に以下の副作用を実行する（`layout.tsx` にマウント）。

1. **localStorage 糖質キー移行**: 旧 `sugar` キーがあれば `carbohydrate` へ移し替え（`initUserStorage` より前に実行）。
2. **プロフィール初期化**: `initUserStorage()`。
3. **日付正規化**: 旧ロケール依存日付（例 `2026/7/6`）を ISO へ正規化。フラグ `dateMigrated` で二重実行を防止。
4. **Service Worker 登録**: `/sw.js`。

### 型（`types/index.ts`）

`UserType` / `MasterType` / `TaskType` / `HistoryType` / `FoodNutrientType` / `Nutrient` と各 Props。
`Nutrient = 'protein' | 'carbohydrate' | 'fat' | 'calorie'`。

### 初期マスタ

`assets/nutrient.json` の `data` を `master` に一括インポート（サンプル食品）。

---

## 3. 純粋ロジック（`lib/nutrition.ts`）

- `calc4day(age, gender, term, height, weight)` — 1 日の目標算出
  - タンパク質 `= weight * 2`、炭水化物 `= weight * 4`
  - 基礎代謝（Harris-Benedict）:
    - 男性 `13.397*W + 4.799*H − 5.677*age + 88.362`
    - 女性 `9.247*W + 3.098*H − 4.33*age + 447.593`
  - 総カロリー `= base * (term==='diet' ? 1.375 : 1.55)`
  - 脂質 `= (calorie − protein*4 − carbohydrate*4) / 9`
  - すべて `Math.floor`
- `calcCalorie(protein, carbohydrate, fat) = P*4 + C*4 + F*9`
- `getFoodNutrient` / `getFoodListNutrient` — `master.値 * volume / 100` で摂取量を算出・合算
- `float2Int(n) = Math.floor(n ?? 0)`
- `convert2Int(str, max?)` — 数字以外を除去、`max` 超過は空文字（入力バリデーション）
- `calc4sports(weight, time)` — 未使用だが維持

## 4. 日付（`lib/date.ts`）

- 正準形式は **`YYYY-MM-DD`（ローカルタイム基準 ISO）**。`<input type="date">` の value と一致。
- `todayISO / toISODate / fromISODate / addDaysISO / createDateList / weekdayIndex / normalizeDateString / isISODate`
- 旧データ移行: 起動時に一度だけ `task.date` / `history.date` を ISO へ正規化（`normalizeDateString`、フラグ `dateMigrated`）。

## 5. 文言（`lib/text.ts`）

`navigator.language === 'ja'` で日本語、他は英語。SSR 時は `ja` 既定。キー一覧は同ファイル参照
（siteName, protein/carbohydrate/fat/calorie, weekdays 等）。日本語の糖質ラベルは「糖質」を維持。

---

## 6. 画面・機能（4 タブ構成）

フッターのタブナビゲーション（`next/link` + `usePathname`）で
`/`（レポート）・`/task`（食事）・`/master`（食品）・`/user`（ユーザー）を切替。

### `/` Home（レポート）
- 期間選択：開始・終了の 2 つの `<input type="date">`（既定は「今日−7 日 〜 今日」）。入力欄全体をタップでピッカーを起動。
- 期間内の各日について `history` を引き当て（無ければ 0 埋め）。派生値は `useMemo` で算出。
- **WeightChart**: recharts `ComposedChart`（カロリーの棒 + 体重の折れ線）。
- **NutrientChart**: recharts `BarChart`（P/C/F の棒）。
- 開始 > 終了 のときは空表示。

### `/task` 食事
- 日付選択（既定＝今日、曜日表示付き。前日/翌日ボタン + `<input type="date">`）。
- 当日の体重入力（`convert2Int` で 0–200 に制限）。
- 当日の `task`（食事）一覧：カード表示。**タップで編集**。
- 目標比較：当日の摂取 P/C/F/カロリー を `float2Int` 表示し、`userData` の目標を超過した項目を強調（`over`）。
- 「保存」で当日の `history` を add/update（体重＋栄養素合算）。
- FAB（＋）で食事追加モーダル。
- **TaskModal**: カテゴリ絞込 → 食品選択 → 量(0〜300% を 10 刻み) → 栄養素プレビュー → 保存。既存編集時は削除ボタンを表示。
- 派生値（tasks / history / nutrient）は `useMemo` で算出（stale state を避ける）。

### `/master` 食品マスタ
- カテゴリ絞込（`すべて` + 既存カテゴリ）。
- 一覧：カード表示。**タップで編集**。
- FAB（＋）で追加モーダル。
- **MasterModal**: 名前・カテゴリ・P/C/F 入力 → カロリー自動算出（`calcCalorie`）→ 保存。既存編集時は削除ボタンを表示。

### `/user` ユーザー
- 入力：性別（radio）・期間 diet/normal（radio）・年齢・身長・体重。
- 基本情報の変更で目標 P/C/F/カロリーを自動再計算（`calc4day`、`useMemo`）。
- 「保存」で localStorage に保存。
- 「サンプルインポート」で `nutrient.json` を master に一括追加。
- 「リセット」で全 IndexedDB ストア + localStorage を消去（確認モーダル経由）。

---

## 7. 共通 UI・インタラクション

- **削除操作**: 長押しは廃止。**タップで編集モーダルを開き、既存項目の場合のみモーダル内に「削除」ボタン**を表示。
  押下で編集モーダルを閉じ、確認モーダル（`RemoveModal`）を表示してから削除する。
  （長押しの iOS 実機での不具合＝callout メニュー競合・スクロール誤爆・低い発見性を回避）
- **共通フィードバック**: `FeedbackProvider`（`layout.tsx` にマウント）が `run()` / `notify()` を提供。
  - `run(async task)` … 実行中はローディングオーバーレイを表示し、成功で完了トースト、例外時はエラートーストへ切り替え（エラーを Notice に集約）。
  - `notify(message?, type?)` … トーストを表示（既定 1.5s で自動消去）。
  - ハードコードの `setTimeout` 演出は廃止し、この共通制御に集約。
- **モーダル**（`components/Modal.tsx`）:
  - **`document.body` への Portal で描画**し、`main` の `max-width` / レイアウトの影響を受けない。
  - **オーバーレイは全画面（幅 100% / `100dvh`）**。**コンテンツ最大幅は 480px**。内容が高い場合はスクロール。
  - 閉じるボタンは content の右上。`Escape` キー / オーバーレイクリックで閉じる。表示中は body スクロールをロック。
- **ローディング**（`Loading`）: 全画面オーバーレイ + スピナー。
- **通知**（`Notice`）: 画面下部のトースト（success / error）。

---

## 8. UI / デザイン方針

- モバイルファースト。**`main` の中央カラム最大幅 = 480px**（モーダルを除いた本文領域に適用）。
- デザイントークン（色・角丸・影・余白・イージング）を CSS 変数で一元管理（`app/globals.scss`）。
- SCSS Modules を各コンポーネントにコロケーション、共有パターンは `styles/_mixins.scss` に mixin 化。
- アクセシビリティ：フォーカス可視化、適切なラベル / role、`aria-*`。
- **テーマ**: トークンはライト/ダーク両対応（`prefers-color-scheme`）。実装・検証はライト先行。
- アイコンは `react-icons`（lucide `lu`）。

### 再構築で解消した既知の課題
1. グローバルセレクタ依存の無効化 → SCSS Modules でスコープを閉じた設計へ。
2. モーダルが `main` 配下でレイアウト制約を受ける → Portal 化。
3. `setTimeout` によるハードコードのローディング / 通知演出 → `FeedbackProvider` の共通制御へ。
4. エラーハンドリングが `console.error` 止まり → Notice（エラートースト）へ集約。
5. Task 画面の重複 useEffect / stale state → 派生値は `useMemo`。
6. 長押し削除の iOS 実機不具合 → タップ → 編集モーダル内の削除ボタン方式へ置換。

---

## 9. PWA

- `public/manifest.webmanifest` + `layout.tsx` の metadata / viewport（theme-color）。
- 軽量な自前 Service Worker（`public/sw.js`、workbox 不使用）をクライアントで登録。
  - App Shell をプリキャッシュ。ナビゲーションはネットワーク優先＋オフラインフォールバック、静的アセットはキャッシュ優先。
  - 非 http(s)（`chrome-extension://` 等）・クロスオリジンは介入しない。キャッシュ書き込みは例外を握りつぶす。
  - `install` は App Shell を個別追加し、一部 404 でも登録全体を失敗させない。キャッシュ名 `my-food-book-v2`。

---

## 10. 非対象（廃止）

プッシュ通知 / Firebase / GA(react-ga4) / アプリバージョン表示 / react-datepicker / 長押しライブラリ /
chart.js / fontawesome / workbox / emotion / js-cookie 等の重量級・不要ライブラリ。
