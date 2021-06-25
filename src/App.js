import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'





const getLocalStorage = ()=>{
  let list = localStorage.getItem('item');
  if(list){
    return JSON.parse(localStorage.getItem('item'))
  }
  else{
    return [];
  }
}



function App() {
  const [name, setName] = useState('');
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    msg: '',
    type: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      //display alert
     showAlert(true,'please enter value', 'danger')
    }
    else if (name && isEditing) {
      // deal with editing
      setList(list.map((item)=>{
        if(item.id === editId){
          return {...item, title:name}
        }
        return item
      }))
      setName('');
      setEditId(null);
      setIsEditing(false)
      showAlert(true, 'item edited', 'success')
    }
    else {
      // show alert
      showAlert(true,'item added', 'success')
      // add item to the list
      const newItem = { id: new Date().getTime().toString(), title: name }
      setList([...list, newItem]);
      setName('')
    }
  }


const showAlert = (show=false, msg='', type='') =>{
  setAlert({show,msg,type})
}

const clearItem = ()=>{
  showAlert(true,'list emptied', 'danger')
  setList([]);
}

const removeSpecific = (id) =>{
  showAlert(true, 'item removed', 'danger');
  setList(list.filter((item)=>item.id !== id))
}


const editItem = (id)=>{
  const specificItem = list.find((item)=> item.id === id);
  setIsEditing(true);
  setEditId(id);
  setName(specificItem.title);
}

useEffect(()=>{
localStorage.setItem('item', JSON.stringify(list))
},[list])

  return <section className="section-center">
    <form className="grocery-form" onSubmit={handleSubmit}>
      {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
      <h3>grocery bud</h3>
      <div className="form-control">
        <input type="text" className='grocery' placeholder='e.g. Banana' value={name} onChange={(e) => setName(e.target.value)} />
        <button type='submit' className="submit-btn">
          {isEditing ? 'edit' : 'submit'}
        </button>
      </div>
    </form>
    {list.length > 0 &&
      <div className="grocery-container">
        <List items={list} removeSpecific={removeSpecific} editItem={editItem} />
        <button className="clear-btn" onClick={clearItem}>
          clear items
        </button>
      </div>}

  </section>
}

export default App
