// テーマ別・JLPT別 単語集ライブラリ
// Thư viện bộ từ vựng theo chủ đề và cấp độ JLPT
window.VOCAB_LIBRARY = [
  {
    id: "n5_basic",
    title: "N5 基礎単語",
    title_vi: "Từ vựng cơ bản N5",
    description: "日本語学習の第一歩。基本的な単語を学びましょう。",
    description_vi: "Bước đầu tiên trong việc học tiếng Nhật. Hãy học những từ cơ bản.",
    level: "N5",
    difficulty: 1,
    icon: "⭐",
    category: "jlpt",
    words: [
      { word: "私", reading: "わたし", meaning_ja: "自分自身", meaning_vi: "Tôi", example: "私は学生です。" },
      { word: "学生", reading: "がくせい", meaning_ja: "学校で学ぶ人", meaning_vi: "Học sinh, sinh viên", example: "彼は大学の学生です。" },
      { word: "先生", reading: "せんせい", meaning_ja: "教える人", meaning_vi: "Giáo viên", example: "先生に質問します。" },
      { word: "学校", reading: "がっこう", meaning_ja: "学ぶ場所", meaning_vi: "Trường học", example: "毎日学校へ行きます。" },
      { word: "本", reading: "ほん", meaning_ja: "書物", meaning_vi: "Sách", example: "図書館で本を借ります。" },
      { word: "食べる", reading: "たべる", meaning_ja: "食事をする", meaning_vi: "Ăn", example: "朝ごはんを食べる。" },
      { word: "飲む", reading: "のむ", meaning_ja: "液体を口に入れる", meaning_vi: "Uống", example: "水を飲む。" },
      { word: "行く", reading: "いく", meaning_ja: "目的地に向かう", meaning_vi: "Đi", example: "東京へ行く。" },
      { word: "来る", reading: "くる", meaning_ja: "こっちへ向かう", meaning_vi: "Đến", example: "友達が家に来る。" },
      { word: "見る", reading: "みる", meaning_ja: "目で確認する", meaning_vi: "Xem, nhìn", example: "テレビを見る。" }
    ]
  },
  {
    id: "n4_elementary",
    title: "N4 初中級単語",
    title_vi: "Từ vựng sơ trung cấp N4",
    description: "日常会話でよく使う便利な表現。",
    description_vi: "Những cách diễn đạt hữu ích thường dùng trong hội thoại hàng ngày.",
    level: "N4",
    difficulty: 2,
    icon: "⭐⭐",
    category: "jlpt",
    words: [
      { word: "説明", reading: "せつめい", meaning_ja: "内容を分かりやすく言う", meaning_vi: "Giải thích", example: "ルールを説明する。" },
      { word: "約束", reading: "やくそく", meaning_ja: "取り決め", meaning_vi: "Lời hứa, cuộc hẹn", example: "友達と約束がある。" },
      { word: "準備", reading: "じゅんび", meaning_ja: "用意", meaning_vi: "Chuẩn bị", example: "旅行の準備をする。" },
      { word: "連絡", reading: "れんらく", meaning_ja: "知らせる", meaning_vi: "Liên lạc", example: "後で連絡します。" },
      { word: "経験", reading: "けいけん", meaning_ja: "実際に見たりやったりする事", meaning_vi: "Kinh nghiệm", example: "いい経験になった。" }
    ]
  },
  {
    id: "theme_daily",
    title: "🏠 日常生活",
    title_vi: "Cuộc sống hàng ngày",
    description: "毎日の生活で欠かせない言葉を集めました。",
    description_vi: "Tổng hợp những từ vựng không thể thiếu trong cuộc sống mỗi ngày.",
    level: "生活",
    difficulty: 1,
    icon: "🏠",
    category: "theme",
    words: [
      { word: "天気", reading: "てんき", meaning_ja: "空の様子", meaning_vi: "Thời tiết", example: "今日はいい天気ですね。" },
      { word: "料理", reading: "りょうり", meaning_ja: "食べ物を作ること", meaning_vi: "Nấu ăn, món ăn", example: "ベトナム料理が好きです。" },
      { word: "掃除", reading: "そうじ", meaning_ja: "きれいにすること", meaning_vi: "Dọn dẹp", example: "週末は部屋を掃除します。" },
      { word: "洗濯", reading: "せんたく", meaning_ja: "服を洗うこと", meaning_vi: "Giặt giũ", example: "洗濯機で服を洗う。" },
      { word: "買い物", reading: "かいもの", meaning_ja: "品物を買うこと", meaning_vi: "Mua sắm", example: "スーパーへ買い物に行く。" }
    ]
  },
  {
    id: "theme_business",
    title: "🏢 ビジネス",
    title_vi: "Kinh doanh",
    description: "会社で使う言葉や基本的な敬語。",
    description_vi: "Từ vựng dùng trong công ty và kính ngữ cơ bản.",
    level: "仕事",
    difficulty: 3,
    icon: "🏢",
    category: "theme",
    words: [
      { word: "会議", reading: "かいぎ", meaning_ja: "集まって相談すること", meaning_vi: "Cuộc họp", example: "午後から会議があります。" },
      { word: "名刺", reading: "めいし", meaning_ja: "名前などが書いてあるカード", meaning_vi: "Danh thiếp", example: "名刺を交換する。" },
      { word: "残業", reading: "ざんぎょう", meaning_ja: "規定の時間外に働くこと", meaning_vi: "Làm thêm giờ", example: "今日は残業します。" },
      { word: "出張", reading: "しゅっちょう", meaning_ja: "仕事で別の場所へ行くこと", meaning_vi: "Đi công tác", example: "来週、大阪へ出張します。" },
      { word: "報告", reading: "ほうこく", meaning_ja: "結果などを知らせること", meaning_vi: "Báo cáo", example: "上司に結果を報告する。" }
    ]
  }
];
