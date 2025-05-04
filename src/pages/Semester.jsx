import { Link, useParams } from 'react-router-dom';

function Semester() {
  const { id } = useParams();

  // セメスター別の授業リスト（手動データ）
  const courseList = {
    1: [
      { id: 'COMM100', name: 'COMM 100（楽でプレゼン中心）' },
      { id: 'MATH010', name: 'MATH 010（ほぼ中学レベル）' },
    ],
    2: [
      { id: 'COUNS105', name: 'COUNS A105（GPAを上げやすい）' },
    ],
    3: [],
    4: [],
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>{id} 学期におすすめの授業</h2>
      {courseList[id] && courseList[id].length > 0 ? (
        <ul>
          {courseList[id].map((course) => (
            <li key={course.id}>
              <Link to={`/course/${course.id}`}>{course.name}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>この学期におすすめの授業はまだありません。</p>
      )}
    </div>
  );
}

export default Semester;


