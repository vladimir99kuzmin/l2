import React, { useRef, useState, useEffect } from 'react';
import './App.css';

import { auth, firestore, firebase } from './Auth';

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

import { TextField, Button, List, ListItem } from "@material-ui/core";



function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="app">
      <section className="mainFrame">
        {user ? <><MessangerHeader /> <Rooms /></> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
    <div className="signIn-btnHandler">
      <Button className="coloredButton" onClick={signInWithGoogle}>Войти с Google</Button>
    </div>
  )
}

function MessangerHeader() {
  return auth.currentUser && (
    <div className="heading">
      <h1 className="mainHeading">Мой первый реакт чат</h1>
      <Button className="logOutBtn" variant="contained" onClick={() => auth.signOut()}>Выход</Button>
    </div>
  )
}

function Rooms() {
  const rooms =
    [{ id: 'messages', name: 'Room One' },
    { id: 'messages2', name: 'Room Two' },
    { id: 'messages3', name: 'Room Three' }];
  const [chatRoom, setChatRoom] = useState('messages');

  const result = rooms.map((element) => {
    return (
    <ListItem button onClick={() => setChatRoom(element.id)}>{element.name}</ListItem>
    );
  });

  return (
    <main>
      <List className="roomChanger">
        {result}
      </List>
      <Messanger room={chatRoom} />
    </main>
  );
}

function Messanger(props) {
  console.log(props.room);
  const messagesRef = firestore.collection(props.room);
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');
  const [messageSended, isMessageSended] = useState(0);
  const dummy = useRef();
  const sendMessage = async (e) => {
    if (formValue.trim() === '') {
      alert("Сообщение пустое");
      return;
    }
    isMessageSended(true);
    e.preventDefault();

    const { uid, photoURL, displayName } = auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
      displayName
    });

    setFormValue('');

    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  const roboAnswer = async () => {

    const { displayName } = auth.currentUser;
    await messagesRef.add({
      text: `Робот видит, что сейчас писал ${displayName}`,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid: "010101",
      photoURL: 'https://yt3.ggpht.com/a/AGF-l7-EzR4dncrYFOsecUoJB-sjtshdJoZ-thEr5A=s900-c-k-c0xffffffff-no-rj-mo',
      displayName: 'ChatBot'

    });

    setFormValue('');

    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  const firstUpdate = useRef(true);
  useEffect(() => {
    if (firstUpdate.current) firstUpdate.current = false;
    else {
      let timer = setTimeout(() => roboAnswer(), 1500);
      return () => clearTimeout(timer);
    }
  }, [messageSended])

  return (
    <>
      <div className="messages">
        {messages && messages.map(msg => <Message key={msg.id} message={msg} />)}
        <div ref={dummy}></div>
      </div>
      <form onSubmit={sendMessage} className="sendForm">
        <div className="sendFormContainer">
          <TextField label="Сообщение"
            fullWidth onChange={(e) => setFormValue(e.target.value)}
            value={formValue}
            style={{ backgroundColor: 'white', outline: '0', borderRadius: '5px' }}
            variant="filled"
            autoFocus
            multiline />
          <Button className="coloredButton" type="submit"> Отправить </Button>
        </div>
      </form>

    </>
  )
}

function Message(props) {
  const { text, photoURL, uid, createdAt, displayName } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received'

  const author = displayName ? displayName : 'анонимус';

  return (
    <div className={`${messageClass} messageBox`}>
      <p>{author} :</p>
      <div className={`message`}>
        <p>{text}</p>
        <img alt={`${author}`} src={photoURL} />
      </div>
    </div>
  )
}

export default App;
