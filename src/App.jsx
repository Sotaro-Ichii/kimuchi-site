import { Link } from 'react-router-dom';

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Kimchi（キムチ）へようこそ</h1>
      <p>Orange Coast Collegeの履修登録をサポートします。</p>
      <ul>
        <li><Link to="/semester/1">1学期に取るべき授業</Link></li>
        <li><Link to="/semester/2">2学期に取るべき授業</Link></li>
        <li><Link to="/semester/3">3学期に取るべき授業</Link></li>
        <li><Link to="/semester/4">4学期に取るべき授業</Link></li>
        <li><Link to="/comments">コメント機能</Link></li>
      </ul>
    </div>
  );
}

export default App;



