import React from 'react';

function Legal() {
  return (
    <div style={{
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      padding: '24px 16px',
      fontFamily: 'sans-serif',
      color: '#1e293b'
    }}>
      <div style={{
        maxWidth: '1024px',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#2563eb',
          marginBottom: '32px',
          textAlign: 'center'
        }}>法的事項</h1>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#2563eb',
            marginBottom: '16px'
          }}>利用規約</h2>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#374151'
          }}>
            当サイト「Musashi」は、学生を支援する目的で作成された非公式なサービスです。
            掲載されている情報は、あくまで参考としてご利用ください。
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#2563eb',
            marginBottom: '16px'
          }}>免責事項</h2>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#374151'
          }}>
            本サイトに掲載されている内容は、正確性を保証するものではありません。
            利用に際して生じた損害について、運営者は一切責任を負いません。
            本サイトに投稿された授業へのコメント、授業評価に対して、運営者は一切責任を負いません。
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#2563eb',
            marginBottom: '16px'
          }}>プライバシーポリシー</h2>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#374151'
          }}>
            コメント投稿やログイン情報は、Google Firebaseのセキュリティポリシーに基づいて管理されています。
            個人情報は目的外で利用されることはありません。
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#2563eb',
            marginBottom: '16px'
          }}>無断模倣に関する注意事項</h2>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#374151'
          }}>
            本サービスに掲載されているページ構成・画面設計・レイアウト・機能の構成（以下「フォーマット」）は、運営者の創意に基づき設計・実装された著作物に該当する場合があります。
            フォーマットの全部または一部を無断で模倣・流用・転載・派生利用することは、著作権法、不正競争防止法、その他の関連法令により禁止されております。
            当社では、類似サービスに対して継続的なモニタリングを行っており、明らかに当サービスのフォーマットを模倣していると判断された場合、法的措置を検討いたします。
            本件に関するご相談・通報等がございましたら、下記よりご連絡ください。
          </p>
        </section>

        <section>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#2563eb',
            marginBottom: '16px'
          }}>お問い合わせ</h2>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#374151'
          }}>
            サイトに関するご質問・ご要望は、以下のメールアドレスまでご連絡ください：<br />
            <strong style={{ color: '#2563eb' }}>sotta.san17@gmail.com</strong>
          </p>
        </section>
      </div>
    </div>
  );
}

export default Legal;
