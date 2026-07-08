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
  },
  {
    id: "n3_intermediate",
    title: "N3 中級単語",
    title_vi: "Từ vựng trung cấp N3",
    description: "日常的な場面で使われる、やや複雑な単語。",
    description_vi: "Những từ vựng phức tạp hơn, thường dùng trong các tình huống hàng ngày.",
    level: "N3",
    difficulty: 3,
    icon: "⭐⭐⭐",
    category: "jlpt",
    words: [
      { word: "影響", reading: "えいきょう", meaning_ja: "他の物事に働きかけて変化させること", meaning_vi: "Ảnh hưởng", example: "天候の影響で遅れる。" },
      { word: "確認", reading: "かくにん", meaning_ja: "はっきり認めること", meaning_vi: "Xác nhận", example: "スケジュールを確認する。" },
      { word: "関係", reading: "かんけい", meaning_ja: "かかわり合い", meaning_vi: "Quan hệ", example: "彼とは良い関係だ。" },
      { word: "目的", reading: "もくてき", meaning_ja: "目指す事柄", meaning_vi: "Mục đích", example: "旅行の目的を話す。" },
      { word: "種類", reading: "しゅるい", meaning_ja: "共通の性質を持つものの集まり", meaning_vi: "Chủng loại, loại", example: "たくさんの種類がある。" }
    ]
  },
  {
    id: "n2_upper_intermediate",
    title: "N2 中上級単語",
    title_vi: "Từ vựng trung cao cấp N2",
    description: "ニュースや新聞でよく見かける単語。",
    description_vi: "Những từ vựng thường thấy trên tin tức và báo chí.",
    level: "N2",
    difficulty: 4,
    icon: "⭐⭐⭐⭐",
    category: "jlpt",
    words: [
      { word: "現象", reading: "げんしょう", meaning_ja: "目に見える形で現れる物事", meaning_vi: "Hiện tượng", example: "不思議な現象が起きる。" },
      { word: "評価", reading: "ひょうか", meaning_ja: "価値を定めること", meaning_vi: "Đánh giá", example: "高い評価を受ける。" },
      { word: "傾向", reading: "けいこう", meaning_ja: "物事の偏った流れ", meaning_vi: "Khuynh hướng, xu hướng", example: "最近の若者の傾向。" },
      { word: "対策", reading: "たいさく", meaning_ja: "状況に合わせてとる手段", meaning_vi: "Biện pháp đối phó", example: "温暖化の対策を考える。" },
      { word: "条件", reading: "じょうけん", meaning_ja: "物事が成り立つための前提", meaning_vi: "Điều kiện", example: "良い条件で契約する。" }
    ]
  },
  {
    id: "n1_advanced",
    title: "N1 上級単語",
    title_vi: "Từ vựng cao cấp N1",
    description: "論理的で高度な内容を理解するための単語。",
    description_vi: "Những từ vựng để hiểu các nội dung mang tính logic và trình độ cao.",
    level: "N1",
    difficulty: 5,
    icon: "⭐⭐⭐⭐⭐",
    category: "jlpt",
    words: [
      { word: "妥協", reading: "だきょう", meaning_ja: "互いに譲り合って解決すること", meaning_vi: "Thỏa hiệp", example: "これ以上の妥協はできない。" },
      { word: "矛盾", reading: "むじゅん", meaning_ja: "つじつまが合わないこと", meaning_vi: "Mâu thuẫn", example: "彼の話は矛盾している。" },
      { word: "顕著", reading: "けんちょ", meaning_ja: "はっきりと目立つ様子", meaning_vi: "Rõ rệt, nổi bật", example: "顕著な成長が見られる。" },
      { word: "懸念", reading: "けねん", meaning_ja: "気にかかって不安に思うこと", meaning_vi: "Lo ngại, e ngại", example: "将来への懸念を抱く。" },
      { word: "促進", reading: "そくしん", meaning_ja: "物事が早く進むように促すこと", meaning_vi: "Thúc đẩy", example: "販売を促進するキャンペーン。" }
    ]
  },
  {
    id: "theme_travel",
    title: "✈️ 旅行",
    title_vi: "Du lịch",
    description: "空港、ホテル、観光地で役立つ言葉。",
    description_vi: "Những từ hữu ích tại sân bay, khách sạn và các điểm tham quan.",
    level: "おでかけ",
    difficulty: 2,
    icon: "✈️",
    category: "theme",
    words: [
      { word: "空港", reading: "くうこう", meaning_ja: "飛行機が発着する場所", meaning_vi: "Sân bay", example: "空港で友達を出迎える。" },
      { word: "宿泊", reading: "しゅくはく", meaning_ja: "ホテルなどに泊まること", meaning_vi: "Trọ lại, ngủ lại", example: "東京のホテルに宿泊する。" },
      { word: "観光", reading: "かんこう", meaning_ja: "名所などを見て回ること", meaning_vi: "Tham quan", example: "京都を観光する。" },
      { word: "予約", reading: "よやく", meaning_ja: "前もって約束すること", meaning_vi: "Đặt trước", example: "レストランを予約する。" },
      { word: "案内", reading: "あんない", meaning_ja: "事情を知らない人を導くこと", meaning_vi: "Hướng dẫn", example: "町を案内してもらう。" }
    ]
  },
  {
    id: "theme_school",
    title: "📚 学校・教育",
    title_vi: "Trường học",
    description: "授業や学校生活でよく使う言葉。",
    description_vi: "Những từ thường dùng trong giờ học và đời sống học đường.",
    level: "学校",
    difficulty: 1,
    icon: "📚",
    category: "theme",
    words: [
      { word: "宿題", reading: "しゅくだい", meaning_ja: "家でやってくる課題", meaning_vi: "Bài tập về nhà", example: "宿題を忘れてしまった。" },
      { word: "試験", reading: "しけん", meaning_ja: "実力などを試すこと", meaning_vi: "Kỳ thi, bài kiểm tra", example: "明日は日本語の試験だ。" },
      { word: "授業", reading: "じゅぎょう", meaning_ja: "学校で教えること", meaning_vi: "Giờ học, tiết học", example: "授業に集中する。" },
      { word: "成績", reading: "せいせき", meaning_ja: "仕事や勉強の出来具合", meaning_vi: "Thành tích", example: "成績が上がった。" },
      { word: "卒業", reading: "そつぎょう", meaning_ja: "学校の全課程を終えること", meaning_vi: "Tốt nghiệp", example: "来年、大学を卒業します。" }
    ]
  },
  {
    id: "theme_culture",
    title: "🎌 文化・伝統",
    title_vi: "Văn hóa",
    description: "日本の文化や習慣に関する言葉。",
    description_vi: "Những từ liên quan đến văn hóa và phong tục của Nhật Bản.",
    level: "文化",
    difficulty: 3,
    icon: "🎌",
    category: "theme",
    words: [
      { word: "温泉", reading: "おんせん", meaning_ja: "地中から湧き出る温水", meaning_vi: "Suối nước nóng", example: "休日は温泉に行きたい。" },
      { word: "着物", reading: "きもの", meaning_ja: "日本の伝統的な衣服", meaning_vi: "Kimono", example: "お正月には着物を着る。" },
      { word: "祭り", reading: "まつり", meaning_ja: "神仏を慰める行事", meaning_vi: "Lễ hội", example: "夏祭りで花火を見る。" },
      { word: "神社", reading: "じんじゃ", meaning_ja: "神を祭る場所", meaning_vi: "Đền thờ (Thần đạo)", example: "神社にお参りする。" },
      { word: "行儀", reading: "ぎょうぎ", meaning_ja: "立ち居振る舞いの作法", meaning_vi: "Cách cư xử", example: "行儀よく食べなさい。" }
    ]
  },
  {
    id: "theme_tech",
    title: "💻 テクノロジー",
    title_vi: "Công nghệ",
    description: "IT用語やネットでよく使う言葉。",
    description_vi: "Các thuật ngữ IT và những từ thường dùng trên mạng.",
    level: "IT",
    difficulty: 3,
    icon: "💻",
    category: "theme",
    words: [
      { word: "検索", reading: "けんさく", meaning_ja: "データの中から探し出すこと", meaning_vi: "Tìm kiếm", example: "インターネットで検索する。" },
      { word: "保存", reading: "ほぞん", meaning_ja: "そのままの状態にしておくこと", meaning_vi: "Lưu trữ", example: "ファイルを保存する。" },
      { word: "共有", reading: "きょうゆう", meaning_ja: "複数で一緒に持つこと", meaning_vi: "Chia sẻ", example: "画面を共有してください。" },
      { word: "設定", reading: "せってい", meaning_ja: "条件などを定めておくこと", meaning_vi: "Cài đặt", example: "スマホの設定を変更する。" },
      { word: "接続", reading: "せつぞく", meaning_ja: "つなぐこと", meaning_vi: "Kết nối", example: "Wi-Fiに接続する。" }
    ]
  },
  {
    id: "theme_health",
    title: "🏥 医療・健康",
    title_vi: "Y tế / Sức khỏe",
    description: "病院や体調不良のときに使う言葉。",
    description_vi: "Những từ dùng khi ở bệnh viện hoặc khi không khỏe.",
    level: "健康",
    difficulty: 2,
    icon: "🏥",
    category: "theme",
    words: [
      { word: "風邪", reading: "かぜ", meaning_ja: "呼吸器の軽い炎症", meaning_vi: "Cảm cúm", example: "風邪をひいて熱がある。" },
      { word: "薬", reading: "くすり", meaning_ja: "病気を治すためのもの", meaning_vi: "Thuốc", example: "食後に薬を飲む。" },
      { word: "症状", reading: "しょうじょう", meaning_ja: "病気やけがの具合", meaning_vi: "Triệu chứng", example: "風邪の症状が出る。" },
      { word: "予約", reading: "よやく", meaning_ja: "病院の診察時間をとること", meaning_vi: "Đặt lịch khám", example: "歯医者を予約する。" },
      { word: "注射", reading: "ちゅうしゃ", meaning_ja: "薬液を体内に入れること", meaning_vi: "Tiêm", example: "インフルエンザの注射をする。" }
    ]
  },
  {
    id: "theme_food",
    title: "🍔 飲食・レストラン",
    title_vi: "Ăn uống / Nhà hàng",
    description: "食事や外食のときに使う言葉。",
    description_vi: "Những từ dùng khi ăn uống và đi ăn ngoài.",
    level: "食事",
    difficulty: 1,
    icon: "🍔",
    category: "theme",
    words: [
      { word: "注文", reading: "ちゅうもん", meaning_ja: "店に品物や料理を頼むこと", meaning_vi: "Gọi món, đặt hàng", example: "料理を注文する。" },
      { word: "会計", reading: "かいけい", meaning_ja: "代金の支払い", meaning_vi: "Tính tiền", example: "お会計をお願いします。" },
      { word: "美味しい", reading: "おいしい", meaning_ja: "味が良い", meaning_vi: "Ngon", example: "このケーキは美味しい。" },
      { word: "お腹", reading: "おなか", meaning_ja: "腹部", meaning_vi: "Bụng", example: "お腹がすきました。" },
      { word: "定食", reading: "ていしょく", meaning_ja: "ご飯といくつかのおかずのセット", meaning_vi: "Cơm phần, set ăn", example: "ランチに定食を食べる。" }
    ]
  },
  {
    id: "theme_shopping",
    title: "💰 買い物・お金",
    title_vi: "Mua sắm / Tiền bạc",
    description: "買い物やお金に関する言葉。",
    description_vi: "Những từ liên quan đến mua sắm và tiền bạc.",
    level: "生活",
    difficulty: 2,
    icon: "💰",
    category: "theme",
    words: [
      { word: "値段", reading: "ねだん", meaning_ja: "品物の金額", meaning_vi: "Giá cả", example: "この服は値段が高い。" },
      { word: "割引", reading: "わりびき", meaning_ja: "定価から安くすること", meaning_vi: "Giảm giá", example: "セールで20％割引になる。" },
      { word: "現金", reading: "げんきん", meaning_ja: "お札や硬貨", meaning_vi: "Tiền mặt", example: "現金で支払う。" },
      { word: "無料", reading: "むりょう", meaning_ja: "お金がかからないこと", meaning_vi: "Miễn phí", example: "このアプリは無料です。" },
      { word: "領収書", reading: "りょうしゅうしょ", meaning_ja: "お金を受け取った証明", meaning_vi: "Biên lai, hóa đơn", example: "領収書をください。" }
    ]
  }
];
