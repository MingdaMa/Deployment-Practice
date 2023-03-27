import axios from 'axios';
const baseUrl = 'http://localhost:3001/api/persons'

const getAllPersons = () => {
  const request = axios.get(baseUrl);
  return request.then(res => res.data);
}

const addNewPerson = (newPerson) => {
  const request = axios.post(baseUrl, newPerson);
  return request.then(res => res.data);
}

const deletePerson = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then(res => res.data);
}

const updateNumber = (id, newPersonObj) => {
  const request = axios.put(`${baseUrl}/${id}`, newPersonObj);
  return request.then(res => res.data)
}

export default { getAllPersons, addNewPerson, updateNumber, deletePerson };