import React from 'react';

function Legal() {
  return (
    <div className="bg-slate-100 min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 mb-8 sm:mb-12">法的事項</h1>

        <section className="mb-8 sm:mb-12">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 mb-3 sm:mb-4">利用規約</h2>
          <p className="text-sm sm:text-base leading-relaxed">
            当サイト「Musashi」は、学生を支援する目的で作成された非公式なサービスです。
            掲載されている情報は、あくまで参考としてご利用ください。
          </p>
        </section>

        <section className="mb-8 sm:mb-12">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 mb-3 sm:mb-4">免責事項</h2>
          <p className="text-sm sm:text-base leading-relaxed">
            本サイトに掲載されている内容は、正確性を保証するものではありません。
            利用に際して生じた損害について、運営者は一切責任を負いません。
            本サイトに投稿された授業へのコメント、授業評価に対して、運営者は一切責任を負いません。
          </p>
        </section>

        <section className="mb-8 sm:mb-12">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 mb-3 sm:mb-4">プライバシーポリシー</h2>
          <p className="text-sm sm:text-base leading-relaxed">
            コメント投稿やログイン情報は、Google Firebaseのセキュリティポリシーに基づいて管理されています。
            個人情報は目的外で利用されることはありません。
          </p>
        </section>

        <section className="mb-8 sm:mb-12">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 mb-3 sm:mb-4">無断模倣に関する注意事項</h2>
          <p className="text-sm sm:text-base leading-relaxed">
            本サービスに掲載されているページ構成・画面設計・レイアウト・機能の構成（以下「フォーマット」）は、運営者の創意に基づき設計・実装された著作物に該当する場合があります。
            フォーマットの全部または一部を無断で模倣・流用・転載・派生利用することは、著作権法、不正競争防止法、その他の関連法令により禁止されております。
            当社では、類似サービスに対して継続的なモニタリングを行っており、明らかに当サービスのフォーマットを模倣していると判断された場合、法的措置を検討いたします。
            本件に関するご相談・通報等がございましたら、下記よりご連絡ください。
          </p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 mb-3 sm:mb-4">お問い合わせ</h2>
          <p className="text-sm sm:text-base leading-relaxed">
            サイトに関するご質問・ご要望は、以下のメールアドレスまでご連絡ください：<br />
            <strong className="text-blue-600">sotta.san17@gmail.com</strong>
          </p>
        </section>
      </div>
    </div>
  );
}

export default Legal;
