import React from 'react';

function Tokushoho() {
  return (
    <div style={{ backgroundColor: '#fff4e6', minHeight: '100vh', padding: '30px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#c92a2a' }}>特定商取引法に基づく表記</h1>

      <section style={{ marginBottom: '30px' }}>
        <h2>販売事業者</h2>
        <p>一井 湊太朗</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>所在地</h2>
        <p>兵庫県西宮市松山町５－１２</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>お問い合わせ先</h2>
        <p>sotta.san17@gmail.com</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>販売価格</h2>
        <p>授業ごとに異なります。詳細は各ページをご確認ください。</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>代金の支払方法</h2>
        <p>クレジットカード（Stripe）</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>返品・キャンセルについて</h2>
        <p>サービスの性質上、購入後のキャンセル・返金はお受けできません。</p>
      </section>
    </div>
  );
}

export default Tokushoho;
