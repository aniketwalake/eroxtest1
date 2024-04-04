import React, { useState } from 'react';
import { storage, db } from './firebaseConfig'; // Import Firestore and storage
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore'; // Import Firestore functions
import { v4 as uuidv4 } from 'uuid';
import logo from './erox_1.svg';
import './App.css';

function App() {
  const [files, setFiles] = useState([]);
  const [userName, setUserName] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [fileURLs, setFileURLs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleUpload = async () => {
    if (files.length === 0 || userName === '') {
      alert('Please fill in all fields and upload at least one file.');
      return;
    }

    setUploading(true);

    const urls = [];

    for (let file of files) {
      const filename = `${file.name}-${uuidv4()}.pdf`;
      const storageRef = ref(storage, `yes/${filename}`);

      const uploadTask = uploadBytesResumable(storageRef, file, {
        contentType: 'application/pdf'
      });

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          console.error('Error uploading file:', error);
          alert('Error uploading file. Please try again.');
          setUploading(false);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('File uploaded successfully:', downloadURL);
            urls.push(downloadURL);
            if (urls.length === files.length) {
              setFileURLs(urls);
              setUploading(false);

              // Save order information to Firestore
              const orderNumber = await saveOrderToFirestore(userName, urls);
              setOrderNumber(orderNumber);
            }
          } catch (error) {
            console.error('Error getting download URL:', error);
            alert('Error getting download URL. Please try again.');
            setUploading(false);
          }
        }
      );
    }
  };

  const saveOrderToFirestore = async (userName, fileURLs) => {
    try {
      // Get the current timestamp
      const timestamp = new Date();

      // Query Firestore to get the count of existing orders
      const ordersSnapshot = await getDocs(collection(db, 'orders1'));
      const orderCount = ordersSnapshot.size + 1; // Increment the count for the new order

      // Generate the order number using the order count
      const orderNumber = `${timestamp.getTime()}-${orderCount}`;

      const orderRef = doc(db, 'orders1', orderNumber);
      await setDoc(orderRef, {
        orderNumber,
        userName,
        fileURLs,
        timestamp: timestamp.toString() // Convert timestamp to string for storage
      });
      console.log('Order saved to Firestore.');
      return orderNumber; // Return the order number
    } catch (error) {
      console.error('Error saving order to Firestore:', error);
      alert('Error saving order to Firestore. Please try again.');
      return null; // Return null in case of error
    }
  };

  return (
    <div className="container">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="content">
        <h1>Order Your Prints</h1>
        <input 
          type="file" 
          onChange={handleFileChange} 
          multiple
        />
        <br />
        <label>
          Name:
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </label>
        <br />
        {uploading && <progress value={progress} max="100" />}
        <br />
        <button onClick={handleUpload} disabled={uploading}>Upload</button>
        {orderNumber && <p>Order Number: {orderNumber}</p>}
      </div>
    </div>
  );
}

export default App;
