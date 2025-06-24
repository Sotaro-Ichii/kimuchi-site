import React from 'react';

function Legal() {
  return (
    <div style={{ backgroundColor: '#18181b', minHeight: '100vh', padding: '30px', fontFamily: 'sans-serif', color: '#f4f4f5' }}>
      <h1 style={{ color: '#fbbf24' }}>法的事項</h1>

      <section style={{ marginBottom: '40px' }}>
        <h2>利用規約</h2>
        <p>
          当サイト「Kimuchi」は、学生を支援する目的で作成された非公式なサービスです。
          掲載されている情報は、あくまで参考としてご利用ください。
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>免責事項</h2>
        <p>
          本サイトに掲載されている内容は、正確性を保証するものではありません。
          利用に際して生じた損害について、運営者は一切責任を負いません。
          本サイトに投稿された授業へのコメント、授業評価に対して、運営者は一切責任を負いません。
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>プライバシーポリシー</h2>
        <p>
          コメント投稿やログイン情報は、Google Firebaseのセキュリティポリシーに基づいて管理されています。
          個人情報は目的外で利用されることはありません。
        </p>
      </section>

      <section>
        <h2>お問い合わせ</h2>
        <p>
          サイトに関するご質問・ご要望は、以下のメールアドレスまでご連絡ください：<br />
          <strong>sotta.san17@gmail.com</strong>
        </p>
      </section>
    </div>
  );
}

export default Legal;
