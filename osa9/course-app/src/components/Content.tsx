import { CoursePart } from '../types'
import Part from './Part';

const Content = ({ courseParts }: { courseParts: CoursePart[] }) => {
  return (
    <div>
      {courseParts.map(cp => (
        <Part key={cp.name} coursePart={cp} />
      ))}
    </div>
  )
}

export default Content;