import React, {useState} from 'react';
import db from './firebaseConfig';

function CRUDSample() {
  const [name, setName] = useState('');
  const [docId, setDocId] = useState('');
  const [debugLog, setDebugLog] = useState('');
  const create = async () => {  
    const data = {
      name: name,
      age: Math.trunc(Math.random() * 100),
      createAt: new Date(),      
    }
    await db.collection('users').add(data);
    await readAll();
  };

  const read = async () => {  
    const docRef = db.collection('users').doc(docId);
    const doc = await docRef.get();
    if (doc.exists) {
      console.log(doc.data());
    } else {
      console.log('not found');
    }
  };

  const del = async () => {
    try{
      await db.collection('users').doc(docId).delete(); 
      await readAll();
    } catch (e) {
      console.log(e);
    }
    
  }

  const update = async () => {
    try {
      const doc = await db.collection("users").doc(docId).get();
      await db.collection("users").doc(docId).set({
          ...doc.data(),
          name: name,
      });
      await readAll();
    } catch (e) {
      console.log(e);
    }
  };

  const readAll = async () => {  
    const docRef = db.collection('users').orderBy('createAt', 'desc');
    const snapShot = await docRef.get();
    const dataArray = [] as any[];
    snapShot.forEach( doc => {
      dataArray.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    setDebugLog(JSON.stringify(dataArray, null, '  '));
  };
  
  return (
    <>
      <p>
        name:<input type="text" value={name} onChange={e => setName(e.target.value)} />
        <button onClick={create}>Create</button>
      </p>
      <p>
        id:<input type="text" value={docId} onChange={e => setDocId(e.target.value)} />
        <button onClick={read}>Read</button>
      </p>
      <p>
        id:<input type="text" value={docId} onChange={e => setDocId(e.target.value)} />
        <button onClick={del}>Delete</button>
      </p>           
      <p>
        id:<input type="text" value={docId} onChange={e => setDocId(e.target.value)} />
        name:<input type="text" value={name} onChange={e => setName(e.target.value)} />
        <button onClick={update}>update</button>
      </p>
      <p>
        <button onClick={readAll}>readAll</button>
      </p>
      <p><textarea value={debugLog} readOnly style={{width:'600px', height: '500px'}} /></p>
    </>
  )
}

export default CRUDSample;