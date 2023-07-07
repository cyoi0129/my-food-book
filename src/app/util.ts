const lang = window.navigator.language;

const en_data = {
    siteName: 'My Food Book',
    height: 'Height',
    weight: 'Weight',
    nutrient: 'Nutrient',
    protein: 'Protein',
    sugar: 'Sugar',
    fat: 'Fat',
    calorie: 'Calorie',
    age: 'Age',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    master: 'Food',
    task: 'Meal',
    summary: 'Summary',
    user: 'User',
    save: 'Save',
    foods: 'Foods',
    weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    notice: 'Successed!',
    category: 'Category',
    name: 'Name',
    volume: 'Volume',
    warning: 'Warning',
    permission: 'Permission',
    confirm: 'Are you sure to remove?',
    push:'Do you need push notification?',
    ok:'OK',
    remove: 'Remove',
    cancel: 'Cancel',
    reset: 'Reset',
    import: 'Import sample',
    term: 'Term',
    diet: 'Diet',
    normal: 'Normal'
}

const ja_data = {
    siteName: 'My Food Book',
    height: '身長',
    weight: '体重',
    nutrient: '栄養素',
    protein: 'タンパク質',
    sugar: '糖質',
    fat: '脂質',
    calorie: 'カロリー',
    age: '年齢',
    gender: '性別',
    male: '男性',
    female: '女性',
    master: '食品',
    task: '食事',
    summary: 'レポート',
    user: 'ユーザー',
    save: '保存',
    foods: '食事',
    weekdays: ['日', '月', '火', '水', '木', '金', '土'],
    notice: '成功しました。',
    category: 'カテゴリ',
    name: '名前',
    volume: '量',
    warning: '注意',
    permission: '通知の確認',
    confirm: '本当に削除しますか？',
    push:'通知を受け取りますか？',
    ok:'OK',
    remove: '削除',
    cancel: 'キャンセル',
    reset: 'リセット',
    import: 'サンプルインポート',
    term: '期間',
    diet: '減量期',
    normal: '通常期'
}

const siteData = lang === 'ja'? ja_data : en_data;
export default siteData;