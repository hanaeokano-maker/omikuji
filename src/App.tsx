import { useState } from 'react';
import './App.css';

interface Fortune {
  result: string;
  message: string;
  luckyItem: string;
  luckyIcon: string; // ラッキーアイテムのイラスト
  color: string;
  weight: number;
}

const FORTUNES: Fortune[] = [
  {
    result: '大吉',
    message: '最高の一日になります！新しいことに挑戦すると吉。',
    luckyItem: '赤いペン',
    luckyIcon: '🖊️',
    color: '#d32f2f',
    weight: 7,
  },
  {
    result: '中吉',
    message: '努力が実を結ぶ兆しがあります。笑顔を忘れずに。',
    luckyItem: '緑茶',
    luckyIcon: '🍵',
    color: '#e65100',
    weight: 21.25,
  },
  {
    result: '小吉',
    message: '小さな幸せが舞い込みます。周りの人への感謝を大切に。',
    luckyItem: 'ハンカチ',
    luckyIcon: '🧣',
    color: '#f57c00',
    weight: 21.25,
  },
  {
    result: '吉',
    message: '穏やかに過ごせる一日です。計画の見直しに最適。',
    luckyItem: '文庫本',
    luckyIcon: '📖',
    color: '#2e7d32',
    weight: 21.25,
  },
  {
    result: '末吉',
    message: '焦らずじっくり進みましょう。後半に向けて運気上昇。',
    luckyItem: 'スニーカー',
    luckyIcon: '👟',
    color: '#0277bd',
    weight: 21.25,
  },
  {
    result: '凶',
    message: '今は耐える時期。忘れ物やスケジュールの確認を徹底して。',
    luckyItem: 'チョコレート',
    luckyIcon: '🍫',
    color: '#455a64',
    weight: 5,
  },
  {
    result: '大凶',
    message: 'これ以上下がることはありません！あとは運気が上がるのみです。',
    luckyItem: '温かいスープ',
    luckyIcon: '🍲',
    color: '#212121',
    weight: 3,
  },
];

function drawWeightedFortune(fortunes: Fortune[]): Fortune {
  const totalWeight = fortunes.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;

  for (const fortune of fortunes) {
    if (random < fortune.weight) {
      return fortune;
    }
    random -= fortune.weight;
  }
  return fortunes[0];
}

// 花吹雪の演出用データ（25枚の花びらをランダム配置）
const PETALS = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  left: `${(i * 4.1) % 100}%`,
  delay: `${(i * 0.13) % 2}s`,
  duration: `${2.2 + (i % 4) * 0.4}s`,
}));

export default function App() {
  const [currentFortune, setCurrentFortune] = useState<Fortune | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleDraw = () => {
    if (isDrawing) return;
    setIsDrawing(true);
    setCurrentFortune(null);

    setTimeout(() => {
      const selected = drawWeightedFortune(FORTUNES);
      setCurrentFortune(selected);
      setIsDrawing(false);
    }, 800);
  };

  const isDaikichi = !isDrawing && currentFortune?.result === '大吉';
  const isDaikyo = !isDrawing && currentFortune?.result === '大凶';

  return (
    <div className={`app-wrapper ${isDaikyo ? 'daikyo-bg' : ''}`}>
      {/* 大吉の花吹雪演出 */}
      {isDaikichi && (
        <div className="effect-overlay" aria-hidden="true">
          {PETALS.map((petal) => (
            <span
              key={petal.id}
              className="petal"
              style={{
                left: petal.left,
                animationDelay: petal.delay,
                animationDuration: petal.duration,
              }}
            >
              🌸
            </span>
          ))}
        </div>
      )}

      {/* 大凶の雷演出 */}
      {isDaikyo && (
        <div className="effect-overlay thunder-overlay" aria-hidden="true">
          <div className="lightning-flash" />
          <span className="lightning-bolt bolt-1">⚡</span>
          <span className="lightning-bolt bolt-2">⚡</span>
        </div>
      )}

      <div className="container">
        <div className={`omikuji-card ${isDaikyo ? 'card-shake' : ''}`}>
          <h1 className="title">⛩️ 今日の運勢はどうかな？ ⛩️</h1>

          <div className="result-area">
            {isDrawing ? (
              <div className="shaking-box">
                <span className="cylinder">🎋</span>
                <p>神様おねがい...</p>
              </div>
            ) : currentFortune ? (
              <div className="fortune-display">
                <div
                  className="fortune-rank"
                  style={{ color: currentFortune.color }}
                >
                  {currentFortune.result}
                </div>
                <p className="fortune-message">{currentFortune.message}</p>
                
                {/* ラッキーアイテム（イラスト＋文字） */}
                <div className="lucky-item-box">
                  <span className="lucky-label">ラッキーアイテム</span>
                  <div className="lucky-content">
                    <span className="lucky-icon" role="img" aria-label={currentFortune.luckyItem}>
                      {currentFortune.luckyIcon}
                    </span>
                    <strong className="lucky-name">{currentFortune.luckyItem}</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="placeholder">
                <p>ボタンを押しておみくじを引いてください</p>
              </div>
            )}
          </div>

          <button
            className="draw-button"
            onClick={handleDraw}
            disabled={isDrawing}
          >
            {isDrawing
              ? '抽選中...'
              : currentFortune
              ? 'もう一度引く'
              : 'おみくじを引く'}
          </button>
        </div>
      </div>
    </div>
  );
}
