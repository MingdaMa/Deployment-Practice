const People = (props) => {
  const { people, deletePerson } = props;
  return (
    <div>
      {people.map(person => {
        return (<p key={person.id}>{person.name} {person.number}<button onClick={() => deletePerson(person.id)}>delete</button></p>)
      })}
    </div>
  )
}

export default People;