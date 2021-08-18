import React from 'react'

const Header = ({text}) => (
    <h2>{text}</h2>
)
  
const Part = ({part, exercises}) => (
    <p>{part} {exercises}</p>
)

const Content = ({parts}) => {
    return (
        <div>
            {parts.map(part =>
                <Part key={part.id} part={part.name} exercises={part.exercises}/>
            )}
        </div>
    )
}

const Total = ({parts}) => {
    return (
        <>
            Total of {parts.reduce((p, c) => p + c.exercises, 0)} exercises
        </>
    )
}

const Course = ({course}) => {
    return (
        <div>
            <Header text={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </div>
    )
}

export default Course