import fs from 'fs';
import path from 'path';

const data = {
  "it-IT": {
    "metadata.json": { "code": "it-IT", "name": "Italiano", "nativeName": "Italiano", "direction": "ltr", "voice": "it-IT", "flag": "🇮🇹", "createdAt": "2026-06-12T19:00:00-03:00" },
    "grammar/adjectives.json": [
      { "id": "big", "word": "grande" }, { "id": "small", "word": "piccolo" }, { "id": "beautiful", "word": "bello" }, { "id": "ugly", "word": "brutto" }, { "id": "fast", "word": "veloce" },
      { "id": "slow", "word": "lento" }, { "id": "happy", "word": "felice" }, { "id": "sad", "word": "triste" }, { "id": "hot", "word": "caldo" }, { "id": "cold", "word": "freddo" }
    ],
    "grammar/adverbs.json": [
      { "id": "always", "word": "sempre" }, { "id": "usually", "word": "di solito" }, { "id": "often", "word": "spesso" }, { "id": "sometimes", "word": "a volte" }, { "id": "rarely", "word": "raramente" },
      { "id": "never", "word": "mai" }, { "id": "already", "word": "già" }, { "id": "still", "word": "ancora" }, { "id": "yet", "word": "ancora" }, { "id": "just", "word": "appena" },
      { "id": "now", "word": "ora" }, { "id": "today", "word": "oggi" }, { "id": "tomorrow", "word": "domani" }, { "id": "yesterday", "word": "ieri" }, { "id": "here", "word": "qui" },
      { "id": "there", "word": "lì" }, { "id": "everywhere", "word": "ovunque" }, { "id": "very", "word": "molto" }, { "id": "quite", "word": "abbastanza" }, { "id": "really", "word": "davvero" },
      { "id": "too", "word": "troppo" }, { "id": "enough", "word": "abbastanza" }, { "id": "almost", "word": "quasi" }, { "id": "maybe", "word": "forse" }, { "id": "perhaps", "word": "probabilmente" },
      { "id": "certainly", "word": "certamente" }, { "id": "probably", "word": "probabilmente" }, { "id": "quickly", "word": "velocemente" }, { "id": "slowly", "word": "lentamente" }, { "id": "carefully", "word": "attentamente" }
    ],
    "grammar/articles.json": [
      { "id": "the", "word": "il/la" }, { "id": "the-m", "word": "il" }, { "id": "the-f", "word": "la" }, { "id": "the-plural-m", "word": "i" }, { "id": "the-plural-f", "word": "le" },
      { "id": "a", "word": "un" }, { "id": "an", "word": "un'" }, { "id": "some", "word": "alcuni" }
    ],
    "grammar/conjunctions.json": [
      { "id": "and", "word": "e" }, { "id": "or", "word": "o" }, { "id": "but", "word": "ma" }, { "id": "because", "word": "perché" }, { "id": "so", "word": "quindi" },
      { "id": "although", "word": "sebbene" }, { "id": "though", "word": "anche se" }, { "id": "even-though", "word": "nonostante" }, { "id": "while", "word": "mentre" }, { "id": "whereas", "word": "mentre invece" },
      { "id": "since", "word": "poiché" }, { "id": "unless", "word": "a meno che" }, { "id": "until", "word": "fino a quando" }, { "id": "before", "word": "prima di" }, { "id": "after", "word": "dopo che" },
      { "id": "if", "word": "se" }, { "id": "whether", "word": "se" }, { "id": "as", "word": "come" }, { "id": "than", "word": "di" }, { "id": "therefore", "word": "pertanto" },
      { "id": "however", "word": "tuttavia" }, { "id": "moreover", "word": "inoltre" }, { "id": "otherwise", "word": "altrimenti" }, { "id": "nor", "word": "né" }, { "id": "either-or", "word": "o...o" }, { "id": "neither-nor", "word": "né...né" }
    ],
    "grammar/possessives.json": [
      { "id": "my", "word": "mio" }, { "id": "your", "word": "tuo" }, { "id": "his", "word": "suo" }, { "id": "her", "word": "suo" }, { "id": "our", "word": "nostro" }, { "id": "their", "word": "loro" }
    ],
    "grammar/prepositions.json": [
      { "id": "in", "word": "in" }, { "id": "on", "word": "su" }, { "id": "under", "word": "sotto" }, { "id": "with", "word": "con" }, { "id": "without", "word": "senza" },
      { "id": "before", "word": "prima" }, { "id": "after", "word": "dopo" }, { "id": "between", "word": "tra" }, { "id": "near", "word": "vicino" }, { "id": "inside", "word": "dentro" }
    ],
    "grammar/pronouns.json": [
      { "id": "i", "word": "io" }, { "id": "you", "word": "tu" }, { "id": "he", "word": "lui" }, { "id": "she", "word": "lei" }, { "id": "we", "word": "noi" },
      { "id": "they", "word": "loro" }, { "id": "me", "word": "me" }, { "id": "my", "word": "mio" }, { "id": "your", "word": "tuo" }, { "id": "our", "word": "nostro" }
    ],
    "grammar/verbs.json": [
      { "id": "to-be", "word": "essere" }, { "id": "to-have", "word": "avere" }, { "id": "to-go", "word": "andare" }, { "id": "to-eat", "word": "mangiare" }, { "id": "to-drink", "word": "bere" },
      { "id": "to-sleep", "word": "dormire" }, { "id": "to-study", "word": "studiare" }, { "id": "to-work", "word": "lavorare" }, { "id": "to-speak", "word": "parlare" }, { "id": "to-listen", "word": "ascoltare" },
      { "id": "to-see", "word": "vedere" }, { "id": "to-think", "word": "pensare" }, { "id": "to-learn", "word": "imparare" }, { "id": "to-write", "word": "scrivere" }, { "id": "to-read", "word": "leggere" },
      { "id": "to-open", "word": "aprire" }, { "id": "to-close", "word": "chiudere" }, { "id": "to-love", "word": "amare" }, { "id": "to-like", "word": "piacere" }, { "id": "to-live", "word": "vivere" }
    ],
    "vocabulary/business.json": [
      { "id": "meeting", "word": "riunione" }, { "id": "office", "word": "ufficio" }, { "id": "company", "word": "azienda" }, { "id": "salary", "word": "stipendio" }, { "id": "manager", "word": "manager" },
      { "id": "project", "word": "progetto" }, { "id": "contract", "word": "contratto" }, { "id": "client", "word": "cliente" }, { "id": "startup", "word": "startup" }, { "id": "interview", "word": "colloquio" }
    ],
    "vocabulary/emotions.json": [
      { "id": "happiness", "word": "felicità" }, { "id": "sadness", "word": "tristezza" }, { "id": "anger", "word": "rabbia" }, { "id": "fear", "word": "paura" }, { "id": "love", "word": "amore" },
      { "id": "anxiety", "word": "ansia" }, { "id": "peace", "word": "pace" }, { "id": "hope", "word": "speranza" }, { "id": "motivation", "word": "motivazione" }, { "id": "confidence", "word": "fiducia" }
    ],
    "vocabulary/food.json": [
      { "id": "bread", "word": "pane" }, { "id": "water", "word": "acqua" }, { "id": "coffee", "word": "caffè" }, { "id": "rice", "word": "riso" }, { "id": "beans", "word": "fagioli" },
      { "id": "cheese", "word": "formaggio" }, { "id": "fish", "word": "pesce" }, { "id": "fruit", "word": "frutta" }, { "id": "milk", "word": "latte" }, { "id": "beer", "word": "birra" }
    ],
    "vocabulary/surfing.json": [
      { "id": "wave", "word": "onda" }, { "id": "board", "word": "tavola" }, { "id": "ocean", "word": "oceano" }, { "id": "beach", "word": "spiaggia" }, { "id": "reef", "word": "barriera corallina" },
      { "id": "barrel", "word": "tubo" }, { "id": "duck-dive", "word": "duck dive" }, { "id": "lineup", "word": "lineup" }, { "id": "tide", "word": "marea" }, { "id": "swell", "word": "scirocco/swell" }
    ],
    "vocabulary/travel.json": [
      { "id": "airport", "word": "aeroporto" }, { "id": "passport", "word": "passaporto" }, { "id": "hotel", "word": "hotel" }, { "id": "beach", "word": "spiaggia" }, { "id": "ticket", "word": "biglietto" },
      { "id": "backpack", "word": "zaino" }, { "id": "map", "word": "mappa" }, { "id": "train", "word": "treno" }, { "id": "bus", "word": "autobus" }, { "id": "adventure", "word": "avventura" }
    ]
  },
  "ja-JP": {
    "metadata.json": { "code": "ja-JP", "name": "日本語", "nativeName": "日本語", "direction": "ltr", "voice": "ja-JP", "flag": "🇯🇵", "createdAt": "2026-06-12T19:00:00-03:00" },
    "grammar/adjectives.json": [
      { "id": "big", "word": "大きい" }, { "id": "small", "word": "小さい" }, { "id": "beautiful", "word": "美しい" }, { "id": "ugly", "word": "醜い" }, { "id": "fast", "word": "速い" },
      { "id": "slow", "word": "遅い" }, { "id": "happy", "word": "嬉しい" }, { "id": "sad", "word": "悲しい" }, { "id": "hot", "word": "熱い" }, { "id": "cold", "word": "寒い" }
    ],
    "grammar/adverbs.json": [
      { "id": "always", "word": "いつも" }, { "id": "usually", "word": "たいてい" }, { "id": "often", "word": "よく" }, { "id": "sometimes", "word": "ときどき" }, { "id": "rarely", "word": "めったに" },
      { "id": "never", "word": "決して" }, { "id": "already", "word": "もう" }, { "id": "still", "word": "まだ" }, { "id": "yet", "word": "まだ" }, { "id": "just", "word": "ちょうど" },
      { "id": "now", "word": "今" }, { "id": "today", "word": "今日" }, { "id": "tomorrow", "word": "明日" }, { "id": "yesterday", "word": "昨日" }, { "id": "here", "word": "ここ" },
      { "id": "there", "word": "そこ" }, { "id": "everywhere", "word": "どこでも" }, { "id": "very", "word": "とても" }, { "id": "quite", "word": "かなり" }, { "id": "really", "word": "本当に" },
      { "id": "too", "word": "あまりに" }, { "id": "enough", "word": "十分に" }, { "id": "almost", "word": "ほとんど" }, { "id": "maybe", "word": "もしかしたら" }, { "id": "perhaps", "word": "恐らく" },
      { "id": "certainly", "word": "確かに" }, { "id": "probably", "word": "おそらく" }, { "id": "quickly", "word": "速く" }, { "id": "slowly", "word": "ゆっくり" }, { "id": "carefully", "word": "注意深く" }
    ],
    "grammar/articles.json": [
      { "id": "the", "word": "その" }, { "id": "the-m", "word": "その" }, { "id": "the-f", "word": "その" }, { "id": "the-plural-m", "word": "それらの" }, { "id": "the-plural-f", "word": "それらの" },
      { "id": "a", "word": "一つの" }, { "id": "an", "word": "一つの" }, { "id": "some", "word": "いくつかの" }
    ],
    "grammar/conjunctions.json": [
      { "id": "and", "word": "そして" }, { "id": "or", "word": "または" }, { "id": "but", "word": "しかし" }, { "id": "because", "word": "なぜなら" }, { "id": "so", "word": "だから" },
      { "id": "although", "word": "〜だけれども" }, { "id": "though", "word": "でも" }, { "id": "even-though", "word": "たとえ〜でも" }, { "id": "while", "word": "〜の間" }, { "id": "whereas", "word": "その一方で" },
      { "id": "since", "word": "〜以来" }, { "id": "unless", "word": "〜でない限り" }, { "id": "until", "word": "〜まで" }, { "id": "before", "word": "〜の前に" }, { "id": "after", "word": "〜の後で" },
      { "id": "if", "word": "もし" }, { "id": "whether", "word": "〜かどうか" }, { "id": "as", "word": "〜のように" }, { "id": "than", "word": "〜よりも" }, { "id": "therefore", "word": "したがって" },
      { "id": "however", "word": "しかしながら" }, { "id": "moreover", "word": "その上" }, { "id": "otherwise", "word": "さもなければ" }, { "id": "nor", "word": "〜もまたない" }, { "id": "either-or", "word": "AかBのどちらか" }, { "id": "neither-nor", "word": "AでもBでもない" }
    ],
    "grammar/possessives.json": [
      { "id": "my", "word": "私の" }, { "id": "your", "word": "あなたの" }, { "id": "his", "word": "彼の" }, { "id": "her", "word": "彼女の" }, { "id": "our", "word": "私たちの" }, { "id": "their", "word": "彼らの" }
    ],
    "grammar/prepositions.json": [
      { "id": "in", "word": "の中に" }, { "id": "on", "word": "の上に" }, { "id": "under", "word": "の下に" }, { "id": "with", "word": "と一緒に" }, { "id": "without", "word": "なしで" },
      { "id": "before", "word": "の前に" }, { "id": "after", "word": "の後で" }, { "id": "between", "word": "の間に" }, { "id": "near", "word": "の近くに" }, { "id": "inside", "word": "内部に" }
    ],
    "grammar/pronouns.json": [
      { "id": "i", "word": "私" }, { "id": "you", "word": "あなた" }, { "id": "he", "word": "彼" }, { "id": "she", "word": "彼女" }, { "id": "we", "word": "私たち" },
      { "id": "they", "word": "彼ら" }, { "id": "me", "word": "私を" }, { "id": "my", "word": "私の" }, { "id": "your", "word": "あなたの" }, { "id": "our", "word": "私たちの" }
    ],
    "grammar/verbs.json": [
      { "id": "to-be", "word": "である" }, { "id": "to-have", "word": "持つ" }, { "id": "to-go", "word": "行く" }, { "id": "to-eat", "word": "食べる" }, { "id": "to-drink", "word": "飲む" },
      { "id": "to-sleep", "word": "眠る" }, { "id": "to-study", "word": "勉強する" }, { "id": "to-work", "word": "働く" }, { "id": "to-speak", "word": "話す" }, { "id": "to-listen", "word": "聴く" },
      { "id": "to-see", "word": "見る" }, { "id": "to-think", "word": "考える" }, { "id": "to-learn", "word": "学ぶ" }, { "id": "to-write", "word": "書く" }, { "id": "to-read", "word": "読む" },
      { "id": "to-open", "word": "開ける" }, { "id": "to-close", "word": "閉める" }, { "id": "to-love", "word": "愛する" }, { "id": "to-like", "word": "好む" }, { "id": "to-live", "word": "生きる" }
    ],
    "vocabulary/business.json": [
      { "id": "meeting", "word": "会議" }, { "id": "office", "word": "オフィス" }, { "id": "company", "word": "会社" }, { "id": "salary", "word": "給料" }, { "id": "manager", "word": "マネージャー" },
      { "id": "project", "word": "プロジェクト" }, { "id": "contract", "word": "契約" }, { "id": "client", "word": "クライアント" }, { "id": "startup", "word": "スタートアップ" }, { "id": "interview", "word": "面接" }
    ],
    "vocabulary/emotions.json": [
      { "id": "happiness", "word": "幸福" }, { "id": "sadness", "word": "悲しみ" }, { "id": "anger", "word": "怒り" }, { "id": "fear", "word": "恐怖" }, { "id": "love", "word": "愛" },
      { "id": "anxiety", "word": "不安" }, { "id": "peace", "word": "平和" }, { "id": "hope", "word": "希望" }, { "id": "motivation", "word": "動機" }, { "id": "confidence", "word": "自信" }
    ],
    "vocabulary/food.json": [
      { "id": "bread", "word": "パン" }, { "id": "water", "word": "水" }, { "id": "coffee", "word": "コーヒー" }, { "id": "rice", "word": "ご飯" }, { "id": "beans", "word": "豆" },
      { "id": "cheese", "word": "チーズ" }, { "id": "fish", "word": "魚" }, { "id": "fruit", "word": "果物" }, { "id": "milk", "word": "牛乳" }, { "id": "beer", "word": "ビール" }
    ],
    "vocabulary/surfing.json": [
      { "id": "wave", "word": "波" }, { "id": "board", "word": "ボード" }, { "id": "ocean", "word": "海" }, { "id": "beach", "word": "ビーチ" }, { "id": "reef", "word": "リーフ" },
      { "id": "barrel", "word": "バレル" }, { "id": "duck-dive", "word": "ダックダイブ" }, { "id": "lineup", "word": "ラインナップ" }, { "id": "tide", "word": "潮汐" }, { "id": "swell", "word": "うねり" }
    ],
    "vocabulary/travel.json": [
      { "id": "airport", "word": "空港" }, { "id": "passport", "word": "パスポート" }, { "id": "hotel", "word": "ホテル" }, { "id": "beach", "word": "ビーチ" }, { "id": "ticket", "word": "チケット" },
      { "id": "backpack", "word": "バックパック" }, { "id": "map", "word": "地図" }, { "id": "train", "word": "電車" }, { "id": "bus", "word": "バス" }, { "id": "adventure", "word": "冒険" }
    ]
  }
};

Object.entries(data).forEach(([lang, files]) => {
  Object.entries(files).forEach(([filePath, content]) => {
    const fullPath = path.join(lang, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, JSON.stringify(content, null, 2), 'utf8');
  });
});

console.log("✅ Estruturas para ja-JP e it-IT criadas com sucesso!");
