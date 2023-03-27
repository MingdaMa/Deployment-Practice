import { useState, useEffect } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import People from './components/People';
import Notification from './components/Notification';
import personService from './services/persons';
import './index.css';

const greenStyle = {
  color: 'green',
  background: 'lightgrey',
  fontSize: '20px',
  borderStyle: 'solid',
  borderRadius: '5px',
  padding: '10px',
  marginBottom: '10px'
}

const redStyle = {
  color: 'red',
  background: 'lightgrey',
  fontSize: '20px',
  borderStyle: 'solid',
  borderRadius: '5px',
  padding: '10px',
  marginBottom: '10px'
}

const App = () => {
  const [people, setPeople] = useState([]);
  const [searchWord, setSearchWord] = useState('');
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [notification, setNotification] = useState('');
  const [notificationStyle, setNotificationStyle] = useState({});

  const fetchPeople =() => {
    personService
      .getAllPersons()
      .then(initialData => {
        setPeople(initialData);
      });
  } 

  useEffect(fetchPeople, [])

  const addName = (e) => {
    e.preventDefault();
    if (people.find(person => person.name === newName)) {
      const person = people.find(person => person.name === newName);
      const isReplace = window.confirm(`${newName} is already added to phonebook, replace number with a new one?`);
      if (isReplace) {
        updateNumber(person.id);
      }
      return;
    }
    const newPersonObj = { name: newName, number: newNumber };
    personService
      .addNewPerson(newPersonObj)
      .then(returnedPerson => {
        setNotification(`Added ${newName}`);
        setNotificationStyle(greenStyle);
        setPeople(people.concat(returnedPerson));
        setNewName('');
        setNewNumber('');

        setTimeout(() => setNotification(null), 5000);
      });
  }

  const updateNumber = (id) => {
    const person = people.find(person => person.id === id);
    const newPerson = {...person, number: newNumber};

    personService
      .updateNumber(id, newPerson)
      .then(returnedPerson => {
        setPeople(people.map(person => person.id !== id ? person : returnedPerson));
      })
      .catch(error => {
        setNotification(`${person.name} has been removed from server`);
        setNotificationStyle(redStyle);
        setTimeout(() => setNotification(null), 5000);
        setPeople(people.filter(person => person.id !== id));
      }) 
  }

  const deletePerson = (id) => {
    const name = people.find(person => person.id === id).name;
    const isConfirm = window.confirm(`Delete ${name}?`);
    if (isConfirm) {
      personService
        .deletePerson(id)
        .then(res => {
          console.log(res);
        })
        .catch(error => {
          setNotification(`${name} has been removed from server`);
          setNotificationStyle(redStyle);
          setTimeout(() => setNotification(null), 5000);
          setPeople(people.filter(person => person.id !== id));
        })
    }
    const newPeople = people.filter(person => person.id !== id);
    setPeople(newPeople);
  }

  const handleSearchWordChange = (e) => {
    const newSearchWord = e.target.value;
    setSearchWord(e.target.value);
    const newPeople = people.filter(person => {
      return person.name.toLowerCase().includes(newSearchWord.toLowerCase());
    })
    setPeople(newPeople);
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} style={notificationStyle}/>
      <Filter searchWord={searchWord} handleSearchWordChange={handleSearchWordChange} handleNumberChange={handleNumberChange}/>
      <h2>Add a new</h2>
      <PersonForm addName={addName} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <People people={people} deletePerson={deletePerson}/>
    </div>
  );
}

export default App;
